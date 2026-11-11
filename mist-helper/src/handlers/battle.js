(async () => {
  const { wait, isVisible, clickMean, pauseMean, setting } = window.GreenHelper;

  // Settles stay in proportion to the slider mean from the previous fixed ranges.
  const TEMPO = {
    nav: 0.94,
    fight: 1.17,
    skip: 0.94,
    back: 1.53,
    restoreNav: 1.15,
    reroll: 1.15,
    elixir: 1.7,
  };

  const CONFIG = {
    potionName: "Wywar Energetyzujący",
    get restoreEnergyEnabled() {
      const toggle = document.getElementById("restore-energy-toggle");
      return toggle ? toggle.checked : true;
    },
    get restoreDragonName() {
      const select = document.getElementById("restore-dragon");
      return select ? select.value : "";
    },
    get battleDelay() {
      return setting("battle-delay", "maestro:battle-delay", 320);
    },
    get restoreDelay() {
      return setting("restore-delay", "maestro:restore-delay", 600);
    },
    get rerollDelay() {
      return setting("reroll-delay", "maestro:reroll-delay", 600);
    },
    retryCount: 5,
    baseDelay: 100,
    backoffFactor: 2,
    maxDelay: 3000,
    maxEnemyPoints: 1190,
    maxOpponentRerolls: 30,
  };

  const battleResults = {};
  let errorCount = 0;
  let opponentRerolls = 0;
  let canRestore = true;
  let elixirExhausted = false;

  const getDelay = (attempt) =>
    Math.min(
      CONFIG.baseDelay * CONFIG.backoffFactor ** attempt,
      CONFIG.maxDelay,
    );

  const retry = async (operation, _label, retries = CONFIG.retryCount) => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const result = await operation(attempt);
        if (result) return result;
      } catch {
        // Wait and try again. A real failure is reported by the caller.
      }
      await wait(getDelay(attempt));
    }
    return null;
  };

  const normalizeText = (value) => (value ?? "").replace(/\s+/g, " ").trim();

  const dragonIdFromHref = (href) => {
    const match = String(href || "").match(/\/dragons\/(?:details\/)?([^/?#]+)/);
    return match ? match[1] : "";
  };

  const nameFromDragonLink = (link) => {
    const named = link?.querySelector("span.inline");
    return named ? normalizeText(named.textContent) : "";
  };

  const getVisibleElements = (selector) =>
    [...document.querySelectorAll(selector)].filter(isVisible);

  const getTextElement = (selector, text) =>
    getVisibleElements(selector).find((element) =>
      normalizeText(element.textContent).includes(text),
    );

  const waitForElement = async (selector, text = "", index = 0, retries) =>
    retry(
      () => {
        const element = text
          ? getTextElement(selector, text)
          : getVisibleElements(selector)[index];
        return element || null;
      },
      `Waiting for ${text || selector}`,
      retries,
    );

  const getResultsContainer = () => {
    const root = document.querySelector("#maestro") || document.body;
    let results = document.getElementById("battle-results");
    if (!results) {
      results = document.createElement("div");
      results.id = "battle-results";
      results.className = "battle-results";
      const title = document.createElement("strong");
      title.className = "battle-results-title";
      title.textContent = "Battle Results";
      const tableDiv = document.createElement("div");
      tableDiv.id = "battle-results-table";
      tableDiv.className = "battle-results-table";
      results.appendChild(title);
      results.appendChild(tableDiv);
      root.appendChild(results);
    }
    return results;
  };

  const renderResultsTable = (resultsObj) => {
    getResultsContainer();
    const tableContainer = document.getElementById("battle-results-table");
    tableContainer.replaceChildren();
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Dragon", "Wins", "Losses", "Silver"].forEach((label, index) => {
      const th = document.createElement("th");
      th.textContent = label;
      if (index > 0) th.className = "num";
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (const dragon of Object.keys(resultsObj)) {
      const row = document.createElement("tr");
      const stats = resultsObj[dragon];
      [dragon, stats.wins, stats.losses, stats.silverEarned].forEach((val, index) => {
        const td = document.createElement("td");
        td.textContent = String(val);
        if (index > 0) td.className = "num";
        row.appendChild(td);
      });
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    tableContainer.appendChild(table);
  };

  const getBattleResult = async () => {
    const result = await retry(
      () => {
        const resultText = document.body.textContent;
        if (resultText.includes("Wygrana!")) return "win";
        if (resultText.includes("Przegrana.")) return "loss";
        return null;
      },
      "Waiting for battle result",
    );

    const silverSpan = document.querySelector(
      "span.mx-auto.flex.items-center.gap-1",
    );
    let silver = 0;
    if (silverSpan) {
      const silverText = silverSpan.textContent.trim();
      silver = parseInt(silverText) || 0;
    }

    return {
      result: result || "unknown",
      points: silver,
    };
  };

  const updateDragonStats = (dragonName, result, silver) => {
    if (!battleResults[dragonName]) {
      battleResults[dragonName] = { wins: 0, losses: 0, silverEarned: 0 };
    }

    const stats = battleResults[dragonName];
    if (result === "win") stats.wins++;
    else if (result === "loss") stats.losses++;
    stats.silverEarned += silver;
  };

  const waitForButton = async (
    text,
    maxRetries = CONFIG.retryCount,
    requireEnabled = false,
  ) => {
    return retry(
      () =>
        getVisibleElements("button").find(
          (button) =>
            button.textContent.trim().includes(text) &&
            (!requireEnabled || !button.disabled),
        ) || null,
      `Waiting for button ${text}`,
      maxRetries,
    );
  };

  const waitForLink = async (text, maxRetries = CONFIG.retryCount) =>
    retry(
      () => getTextElement("a", text) || null,
      `Waiting for link ${text}`,
      maxRetries,
    );

  // Walcz sits between the two dragons. Own Punkty is on the left and is
  // about as close to the button as the rival's, so the rival is the closest
  // Punkty to the right of that button. The same split picks the two links.
  const centerOf = (el) => {
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  const nearest = (origin, items) => {
    let best = null;
    let bestDist = Infinity;
    for (const item of items) {
      const dx = item.center.x - origin.x;
      const dy = item.center.y - origin.y;
      const dist = dx * dx + dy * dy;
      if (dist < bestDist) {
        bestDist = dist;
        best = item;
      }
    }
    return best;
  };

  const parsePunkty = (line) => {
    const valueNode =
      [...line.querySelectorAll("span")].find((span) =>
        (span.className?.toString?.() || "").includes("text-light-300"),
      ) || line.querySelector("span");
    const digits = (valueNode?.textContent || "").replace(/\D/g, "");
    if (!digits) return null;
    const points = Number.parseInt(digits, 10);
    return Number.isFinite(points) ? points : null;
  };

  const punktyReadouts = () =>
    getVisibleElements("p")
      .filter((line) => normalizeText(line.textContent).includes("Punkty"))
      .map((line) => {
        const points = parsePunkty(line);
        return points == null ? null : { points, center: centerOf(line) };
      })
      .filter(Boolean);

  const arenaDragonLinks = () =>
    getVisibleElements("a[href^='/dragons/']").filter((link) => {
      const href = link.getAttribute("href") || "";
      if (!/^\/dragons\/(?:details\/)?[^/?#]+$/.test(href)) return false;
      if (/^\/dragons\/(?:activities|academy)(?:\/|$)/.test(href)) return false;
      return Boolean(link.querySelector("span.inline"));
    });

  const sideItems = (items, origin, side) =>
    items.filter((item) =>
      side === "right" ? item.center.x > origin.x + 12 : item.center.x < origin.x - 12,
    );

  const readMatchupNear = (button) => {
    if (!button?.isConnected) return null;
    const origin = centerOf(button);
    const links = arenaDragonLinks().map((link) => ({ link, center: centerOf(link) }));
    const own = nearest(origin, sideItems(links, origin, "left"));
    const rival = nearest(origin, sideItems(links, origin, "right"));
    const enemy = nearest(origin, sideItems(punktyReadouts(), origin, "right"));
    if (!own?.link || enemy?.points == null) return null;
    return {
      ownHref: own.link.getAttribute("href") || "",
      ownName: nameFromDragonLink(own.link),
      rivalHref: rival?.link.getAttribute("href") || "",
      points: enemy.points,
    };
  };

  const sameSignature = (left, right) =>
    Boolean(left) &&
    Boolean(right) &&
    left.ownHref === right.ownHref &&
    left.rivalHref === right.rivalHref &&
    left.points === right.points;

  const fightButtons = () =>
    getVisibleElements("button").filter((button) =>
      normalizeText(button.textContent).includes("Walcz"),
    );

  const buttonNearLink = (link) => {
    if (!link) return null;
    const origin = centerOf(link);
    return (
      nearest(
        origin,
        fightButtons().map((button) => ({ button, center: centerOf(button) })),
      )?.button || null
    );
  };

  const buttonForDragon = (ownHref) => {
    if (!ownHref) return null;
    return (
      fightButtons().find((button) => readMatchupNear(button)?.ownHref === ownHref) ||
      null
    );
  };

  // The button that can fight now. A chosen dragon is used only while its
  // Walcz is enabled. A disabled one, such as the first dragon at 0% energy,
  // must not stop the run: the next enabled Walcz is the active button.
  const activeFightButton = () => {
    const enabled = fightButtons().filter((button) => !button.disabled);
    if (!enabled.length) return null;
    const name = CONFIG.restoreDragonName;
    if (!name) return enabled[0];
    const links = arenaDragonLinks();
    const owned = links[0] ? readOwnedDragons(links[0]) : null;
    const ownedDragon = owned?.find((dragon) => dragon.name === name);
    const link = ownedDragon?.uid
      ? links.find((item) => dragonIdFromHref(item.getAttribute("href")) === ownedDragon.uid)
      : links.find((item) => nameFromDragonLink(item) === name);
    const chosen = buttonNearLink(link);
    return chosen && !chosen.disabled ? chosen : enabled[0];
  };

  // Each dragon has its own battle.candidate, cached for an hour. Leaving the
  // route keeps a fresh cache, so drop only the dragon about to fight.
  const findQueryClient = (anchor) => {
    const fiberKey = Object.keys(anchor).find((key) =>
      key.startsWith("__reactFiber$"),
    );
    let fiber = fiberKey ? anchor[fiberKey] : null;
    const seen = new Set();
    while (fiber && !seen.has(fiber)) {
      seen.add(fiber);
      const candidates = [fiber.memoizedProps?.value, fiber.memoizedProps?.client];
      const client = candidates.find(
        (value) =>
          value &&
          typeof value.invalidateQueries === "function" &&
          typeof value.getQueryCache === "function",
      );
      if (client) return client;
      fiber = fiber.return;
    }
    return null;
  };

  // Drop the cached rival and do not wait for the refetch. invalidateQueries
  // resolves only when that refetch finishes, and the second reroll leaves
  // the arena while the first refetch is still running, so the promise hangs.
  const dropBattleCandidate = (anchor, dragonUid) => {
    const client = findQueryClient(anchor);
    if (!client || !dragonUid) return;
    const filters = {
      predicate: (query) => {
        try {
          const key = JSON.stringify(query.queryKey);
          return key.includes('"candidate"') && key.includes(dragonUid);
        } catch {
          return false;
        }
      },
    };
    const pending = client.cancelQueries?.(filters);
    if (pending && typeof pending.catch === "function") pending.catch(() => {});
    client.removeQueries?.(filters);
    const invalidation = client.invalidateQueries(filters);
    if (invalidation && typeof invalidation.catch === "function") invalidation.catch(() => {});
  };

  const waitForNewOpponent = async (previous) => {
    let sameStreak = 0;
    for (let attempt = 0; attempt < 20; attempt++) {
      const next = readMatchupNear(buttonForDragon(previous.ownHref));
      if (next?.ownHref === previous.ownHref && next.points != null) {
        if (!sameSignature(previous, next)) return next;
        sameStreak += 1;
        // The old rival is already on screen. Sitting here does not change
        // it; the next leave-and-return does.
        if (sameStreak >= 5) return null;
      } else {
        sameStreak = 0;
      }
      await wait(200);
    }
    return null;
  };

  const waitForPath = (predicate, label) =>
    retry(
      () => (predicate(location.pathname) ? location.pathname : null),
      label,
      20,
    );

  // Mostly Szkolenia. Akademia about one leave in four.
  const leaveDestinations = [
    { href: "/dragons/activities/trainings", label: "Szkolenia", weight: 3 },
    { href: "/dragons/academy", label: "Akademia", weight: 1 },
  ];

  const pickLeaveDestination = () => {
    const total = leaveDestinations.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * total;
    for (const destination of leaveDestinations) {
      roll -= destination.weight;
      if (roll < 0) return destination;
    }
    return leaveDestinations[0];
  };

  const findNavLink = (href, label) =>
    getVisibleElements(`a[href="${href}"]`).find((link) =>
      normalizeText(link.textContent).includes(label),
    ) || null;

  const leaveArena = async () => {
    const primary = pickLeaveDestination();
    const secondary = leaveDestinations.find((item) => item !== primary);
    const link = await retry(
      () =>
        findNavLink(primary.href, primary.label) ||
        findNavLink(secondary.href, secondary.label) ||
        getVisibleElements('a[href="/dragons"]').find((item) =>
          normalizeText(item.textContent).includes("Smoki"),
        ) ||
        null,
      `Waiting for ${primary.label}`,
    );
    if (!link) return false;
    await clickMean(link, CONFIG.rerollDelay);
    const arrived = await waitForPath(
      (path) => path.startsWith("/dragons") && !path.startsWith("/battles"),
      "Waiting to leave the arena",
    );
    if (!arrived) return false;
    await pauseMean(CONFIG.rerollDelay * TEMPO.reroll);
    return true;
  };

  const openArena = async () => {
    const arenaLink = await retry(
      () =>
        getVisibleElements('a[href="/battles/casual"]').find((link) =>
          link.textContent.includes("Arena"),
        ) || null,
      "Waiting for arena link",
    );
    if (!arenaLink) return false;
    await clickMean(arenaLink, CONFIG.rerollDelay);
    const arrived = await waitForPath(
      (path) => path.startsWith("/battles"),
      "Waiting to enter the arena",
    );
    if (!arrived) return false;
    await pauseMean(0.4 * CONFIG.rerollDelay * TEMPO.reroll);
    await waitForOwnDragonCards();
    return true;
  };

  const rerollMatchup = async (fightButton) => {
    const previous = readMatchupNear(fightButton);
    if (!previous?.ownHref) return null;
    if (previous.points != null && !(previous.points > CONFIG.maxEnemyPoints)) return null;
    dropBattleCandidate(fightButton, dragonIdFromHref(previous.ownHref));
    await leaveArena();
    await openArena();
    return waitForNewOpponent(previous);
  };

  const goToArena = async ({ slow = false } = {}) => {
    const mean = slow ? CONFIG.restoreDelay : CONFIG.battleDelay;
    const settle = mean * (slow ? TEMPO.restoreNav : TEMPO.nav);
    const dragonsLink = await retry(
      () =>
        getVisibleElements('a[href*="/dragons"]').find((link) =>
          link.textContent.includes("Smoki"),
        ) || null,
      "Waiting for dragons link",
    );
    if (dragonsLink) {
      await clickMean(dragonsLink, mean);
      await pauseMean(settle);
    }
    const arenaLink = await retry(
      () =>
        getVisibleElements('a[href="/battles/casual"]').find((link) =>
          link.textContent.includes("Arena"),
        ) || null,
      "Waiting for arena link",
    );
    if (arenaLink) {
      await clickMean(arenaLink, mean);
    }
    await waitForOwnDragonCards(5);
  };

  const getItemCardByName = (itemName) => {
    const itemNode = [...document.querySelectorAll("li, [role='listitem'], article")].find(
      (element) => normalizeText(element.textContent).includes(itemName),
    );
    if (itemNode) return itemNode;

    const fallback = [...document.querySelectorAll("div")].find(
      (element) =>
        normalizeText(element.textContent).includes(itemName) &&
        element.querySelector("button"),
    );
    return fallback || null;
  };

  const findItemUseButton = () => {
    const item = getItemCardByName(CONFIG.potionName);
    if (!item) return null;

    let container = item;
    for (let level = 0; level < 6 && container; level++) {
      const useButton = [...container.querySelectorAll("button")].find(
        (button) => isVisible(button) && !button.disabled,
      );
      if (useButton) return useButton;
      container = container.parentElement;
    }
    return null;
  };

  // The energy badge for your dragon sits in the same panel. A rival link
  // only reaches that badge by climbing into the shared matchup grid, which
  // also contains a second dragon id. Require a single id so rivals drop out.
  const getOwnPanel = (link) => {
    const ownId = dragonIdFromHref(link.getAttribute("href"));
    if (!ownId) return null;
    let container = link;
    for (let level = 0; level < 8 && container; level++) {
      const ids = new Set(
        [...container.querySelectorAll('a[href^="/dragons/"]')]
          .map((anchor) => dragonIdFromHref(anchor.getAttribute("href")))
          .filter(Boolean),
      );
      const hasEnergy = [...container.querySelectorAll("span")].some((span) =>
        /^\d+%$/.test(normalizeText(span.textContent)),
      );
      if (hasEnergy && ids.size === 1 && ids.has(ownId)) return container;
      container = container.parentElement;
    }
    return null;
  };

  const getOwnDragonCards = () => {
    return getVisibleElements('a[href^="/dragons/"]')
      .map((link) => {
        const card = getOwnPanel(link);
        return card ? { link, card } : null;
      })
      .filter(Boolean);
  };

  const getOwnDragons = () =>
    getOwnDragonCards()
      .map((entry) => ({
        ...entry,
        id: dragonIdFromHref(entry.link.getAttribute("href")),
        name: nameFromDragonLink(entry.link),
      }))
      .filter((entry) => entry.id);

  // The elixir dropdown is getOwnedDragons(), same order as the arena cards.
  const readOwnedDragons = (anchor) => {
    const client = findQueryClient(anchor);
    if (!client) return null;
    const query = client.getQueryCache().getAll().find((item) => {
      try {
        return JSON.stringify(item.queryKey).includes("getOwnedList");
      } catch {
        return false;
      }
    });
    const data = query?.state?.data;
    return Array.isArray(data) ? data : null;
  };

  const resolveBattleDragon = () => {
    const name = CONFIG.restoreDragonName;
    if (!name) return null;
    const cards = getOwnDragons();
    const owned = cards[0] ? readOwnedDragons(cards[0].link) : null;
    const ownedIndex = owned?.findIndex((dragon) => dragon.name === name) ?? -1;
    const uid = ownedIndex >= 0 ? owned[ownedIndex].uid : "";
    const matches = cards.filter((item) => (uid && item.id === uid) || item.name === name);
    const card = matches.find((item) => getCardFightButton(item.card)) || matches[0] || null;
    if (!card) return null;
    if (ownedIndex >= 0) return { ...card, index: ownedIndex };
    const seen = new Set();
    let index = -1;
    for (const item of cards) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      if (item.id === card.id) {
        index = seen.size - 1;
        break;
      }
    }
    return index >= 0 ? { ...card, index } : null;
  };

  const getCardFightButton = (panel) => {
    let root = panel;
    for (let level = 0; level < 8 && root; level++) {
      const className = root.className?.toString?.() || "";
      if (className.includes("max-w-3xl") && className.includes("grid")) {
        return (
          [...root.querySelectorAll("button")].find((button) =>
            normalizeText(button.textContent).includes("Walcz"),
          ) || null
        );
      }
      root = root.parentElement;
    }
    return null;
  };

  const waitForOwnDragonCards = async (retries = CONFIG.retryCount) =>
    retry(
      () => {
        const ownCards = getOwnDragonCards();
        if (!ownCards.length) return null;
        return ownCards;
      },
      "Waiting for own dragon cards",
      retries,
    );

  const getRestoreTarget = () => resolveBattleDragon();

  const getDragonEnergyPercent = (card) => {
    if (!card) return null;
    const energyLabel = [...card.querySelectorAll("span")].find((span) =>
      /^\d+%$/.test(span.textContent.trim()),
    );
    const energyText = energyLabel?.textContent.trim();
    if (!energyText || !/^\d+%$/.test(energyText)) return null;
    return Number.parseInt(energyText, 10);
  };

  // The arena is finished when every Walcz is disabled, or every energy
  // badge on screen is 0%. A page that has not rendered its cards is not
  // finished. With restore off, this alone ends the run. With restore on,
  // the run ends here only after the elixir is also gone.
  const arenaIsSpent = () => {
    const buttons = fightButtons();
    const energies = getOwnDragonCards()
      .map(({ card }) => getDragonEnergyPercent(card))
      .filter((energy) => energy != null);
    if (!buttons.length && !energies.length) return false;
    const buttonsSpent = buttons.length > 0 && buttons.every((button) => button.disabled);
    const energySpent = energies.length > 0 && energies.every((energy) => energy === 0);
    return buttonsSpent || energySpent;
  };

  const hasUsableEnergyElixir = () => {
    const itemCard = getItemCardByName(CONFIG.potionName);
    if (!itemCard) return false;

    const countText = [...itemCard.querySelectorAll("*")]
      .map((node) => normalizeText(node.textContent))
      .find((text) => /^\d+$/.test(text));

    const count = Number.parseInt(countText || "0", 10);
    const useButton = [...itemCard.querySelectorAll("button")].find(
      (button) => isVisible(button) && !button.disabled,
    );

    return count > 0 && Boolean(useButton);
  };

  const restoreEnergy = async () => {
    if (!CONFIG.restoreEnergyEnabled || !canRestore || !CONFIG.restoreDragonName) return false;
    // Potions are already gone. Other dragons may still have a Walcz.
    if (elixirExhausted) return false;

    const target = await retry(
      () => getRestoreTarget() || null,
      "Waiting for restore target",
      3,
    );
    if (!target) {
      elixirExhausted = false;
      await goToArena();
      return false;
    }

    const energy = getDragonEnergyPercent(target.card);
    if (energy === null || energy !== 0) {
      elixirExhausted = false;
      return false;
    }

    canRestore = false;

    const restoreIndex = target.index;

    try {
      const inventoryLink = await retry(
        () =>
          getVisibleElements('a[href="/inventory"]').find((link) =>
            link.textContent.includes("Przedmioty"),
          ) || null,
        "Waiting for inventory link",
      );
      if (!inventoryLink) return false;
      await clickMean(inventoryLink, CONFIG.restoreDelay);

      const item = await retry(
        () => getItemCardByName(CONFIG.potionName) || null,
        "Waiting for energy elixir item in inventory",
      );
      if (!item) {
        await goToArena({ slow: true });
        return false;
      }
      if (!hasUsableEnergyElixir()) {
        elixirExhausted = true;
        await goToArena({ slow: true });
        return false;
      }

      const useButton = await retry(
        () => findItemUseButton(),
        "Waiting for energy elixir button",
      );
      if (!useButton) {
        await goToArena({ slow: true });
        return false;
      }
      await clickMean(useButton, CONFIG.restoreDelay);

      const confirmation = await waitForElement(
        "body",
        `Czy na pewno chcesz użyć ${CONFIG.potionName}?`,
      );
      if (!confirmation) {
        await goToArena({ slow: true });
        return false;
      }

      const dropdown = await retry(
        () =>
          getVisibleElements('button[role="combobox"]').find((button) =>
            normalizeText(button.textContent).includes("Wybierz smoka"),
          ) || null,
        "Waiting for dragon select",
      );
      if (!dropdown) {
        await goToArena({ slow: true });
        return false;
      }
      await clickMean(dropdown, CONFIG.restoreDelay);

      const dragonOption = await retry(() => {
        const lists = document.querySelectorAll('[role="listbox"]');
        const list = lists[lists.length - 1];
        const option = list?.querySelectorAll('[role="option"]')[restoreIndex];
        if (!option || option.getAttribute("aria-disabled") === "true") return null;
        return option;
      }, "Waiting for dragon option");
      if (!dragonOption) {
        await goToArena({ slow: true });
        return false;
      }
      await clickMean(dragonOption, CONFIG.restoreDelay);

      const submitButton = await waitForButton("Użyj", CONFIG.retryCount, true);
      if (!submitButton) {
        await goToArena({ slow: true });
        return false;
      }
      await clickMean(submitButton, CONFIG.restoreDelay);
      await pauseMean(CONFIG.restoreDelay * TEMPO.elixir);
      await goToArena({ slow: true });
      elixirExhausted = false;
      return true;
    } finally {
      // Always runs: success, early return, or thrown error.
      canRestore = true;
    }
  };

  try {
    renderResultsTable(battleResults);
    await goToArena();

    while (errorCount < 5) {
      try {
        const restored = await restoreEnergy();
        // The elixir click returns to the arena. Read Walcz on the next pass
        // so a button that was disabled at 0% is not treated as spent.
        if (restored) continue;

        // All Walcz disabled and energies at 0%. Restore off stops here.
        // Restore on stops only after the elixir is gone. A failed restore
        // that did not prove the elixir is gone retries, then the error cap ends it.
        if (arenaIsSpent()) {
          if (!CONFIG.restoreEnergyEnabled || elixirExhausted) break;
          errorCount++;
          continue;
        }

        const fightButton = await retry(
          () => {
            const button = activeFightButton();
            return button && !button.disabled ? button : null;
          },
          "Waiting for button Walcz",
          CONFIG.retryCount,
        );
        if (!fightButton) {
          errorCount++;
          await goToArena();
          continue;
        }

        const near = await retry(
          () => {
            const button = fightButton.isConnected ? fightButton : activeFightButton();
            if (!button || button.disabled) return null;
            return readMatchupNear(button);
          },
          "Waiting for enemy points",
          3,
        );
        const ownName = near?.ownName || CONFIG.restoreDragonName || "Dragon";
        if (!near || near.points == null || near.points > CONFIG.maxEnemyPoints) {
          opponentRerolls++;
          if (opponentRerolls > CONFIG.maxOpponentRerolls) break;
          await rerollMatchup(fightButton.isConnected ? fightButton : activeFightButton());
          continue;
        }
        opponentRerolls = 0;

        await clickMean(fightButton, CONFIG.battleDelay);
        await pauseMean(CONFIG.battleDelay * TEMPO.fight);

        const skipButton = await waitForButton("Pomiń");
        if (skipButton) {
          await clickMean(skipButton, CONFIG.battleDelay);
          await pauseMean(CONFIG.battleDelay * TEMPO.skip);
        }

        const { result, points } = await getBattleResult();
        updateDragonStats(ownName, result, points);
        renderResultsTable(battleResults);

        const returnButton = await waitForButton("Powrót");
        if (returnButton) {
          await clickMean(returnButton, CONFIG.battleDelay);
          await pauseMean(CONFIG.battleDelay * TEMPO.back);
        }
      } catch {
        await goToArena();
        errorCount++;
      }
    }
    renderResultsTable(battleResults);
  } catch {
    renderResultsTable(battleResults);
  }
})();
