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
    maxEnemyPoints: 1100,
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

  // The casual matchup is one grid: your dragon (energy badge) on the left,
  // the rival (no energy badge) on the right, and Walcz overlaid on both.
  // "Punkty" on the page is the elo value in span.text-light-300, not Poziom.
  const getMatchupRoot = (button) => {
    let el = button;
    for (let i = 0; i < 12 && el; i++) {
      const className = el.className?.toString?.() || "";
      if (className.includes("max-w-3xl") && className.includes("grid")) return el;
      el = el.parentElement;
    }
    return null;
  };

  const getPanels = (root) =>
    [...root.children]
      .filter((child) => {
        const hasDragon = child.querySelector("a[href^='/dragons/']");
        const hasPunkty = [...child.querySelectorAll("p")].some((p) =>
          p.textContent.includes("Punkty"),
        );
        return hasDragon && hasPunkty;
      })
      .map((el) => ({
        el,
        hasEnergy: [...el.querySelectorAll("span")].some((span) =>
          /^\d+%$/.test(span.textContent.trim()),
        ),
      }));

  const readPunkty = (panel) => {
    const line = [...panel.querySelectorAll("p")].find((p) =>
      normalizeText(p.textContent).includes("Punkty"),
    );
    if (!line) return null;
    const valueNode =
      [...line.querySelectorAll("span")].find((span) =>
        (span.className?.toString?.() || "").includes("text-light-300"),
      ) || line.querySelector("span");
    const digits = (valueNode?.textContent || "").replace(/\D/g, "");
    if (!digits) return null;
    const points = Number.parseInt(digits, 10);
    return Number.isFinite(points) ? points : null;
  };

  const getRivalSignature = (root) => {
    if (!root) return null;
    const panels = getPanels(root);
    const own = panels.find((panel) => panel.hasEnergy);
    const rival = panels.find((panel) => !panel.hasEnergy);
    if (!own || !rival) return null;
    return {
      ownHref: own.el.querySelector("a[href^='/dragons/']")?.getAttribute("href") || "",
      rivalHref:
        rival.el.querySelector("a[href^='/dragons/']")?.getAttribute("href") || "",
      points: readPunkty(rival.el),
    };
  };

  const sameSignature = (left, right) =>
    Boolean(left) &&
    Boolean(right) &&
    left.ownHref === right.ownHref &&
    left.rivalHref === right.rivalHref &&
    left.points === right.points;

  const getEnemyPoints = (button) => {
    const signature = getRivalSignature(getMatchupRoot(button));
    return signature ? signature.points : null;
  };

  const getOwnName = (button) => {
    const root = getMatchupRoot(button);
    if (!root) return "";
    const own = getPanels(root).find((panel) => panel.hasEnergy);
    if (!own) return "";
    return nameFromDragonLink(own.el.querySelector("a[href^='/dragons/']"));
  };

  const findMatchupSignature = (ownHref) => {
    const roots = getVisibleElements(".grid.max-w-3xl");
    for (const root of roots) {
      const signature = getRivalSignature(root);
      if (!signature) continue;
      if (!ownHref || signature.ownHref === ownHref) return signature;
    }
    return null;
  };

  // battle.candidate is cached for an hour, so leaving the route alone
  // shows the same rival. Drop that cache, then leave and come back.
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

  const invalidateBattleCandidates = (anchor) => {
    const client = findQueryClient(anchor);
    if (!client) return null;
    return client.invalidateQueries({
      predicate: (query) => {
        try {
          return JSON.stringify(query.queryKey).includes("candidate");
        } catch {
          return false;
        }
      },
    });
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
    await pauseMean(CONFIG.rerollDelay * TEMPO.reroll);
    await waitForOwnDragonCards();
    return true;
  };

  const rerollMatchup = async (fightButton) => {
    const previous = getRivalSignature(getMatchupRoot(fightButton));
    const invalidation = invalidateBattleCandidates(fightButton);
    await leaveArena();
    await openArena();
    if (invalidation) await invalidation.catch(() => {});
    return retry(
      () => {
        const next = findMatchupSignature(previous?.ownHref);
        if (!next || next.points == null) return null;
        if (sameSignature(previous, next)) return null;
        return next;
      },
      "Waiting for a new opponent",
      12,
    );
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

  const getDragonNameFromLink = (link) => nameFromDragonLink(link);

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

  const getRestoreTarget = () => {
    const name = CONFIG.restoreDragonName;
    if (!name) return null;
    const matches = getOwnDragonCards().filter(
      ({ link }) => nameFromDragonLink(link) === name,
    );
    return (
      matches.find(({ link }) => !link.getAttribute("href")?.includes("/details/")) ||
      matches[0] ||
      null
    );
  };

  const getDragonEnergyPercent = (card) => {
    if (!card) return null;
    const energyLabel = [...card.querySelectorAll("span")].find((span) =>
      /^\d+%$/.test(span.textContent.trim()),
    );
    const energyText = energyLabel?.textContent.trim();
    if (!energyText || !/^\d+%$/.test(energyText)) return null;
    return Number.parseInt(energyText, 10);
  };

  const firstDragonHasNoEnergy = () => {
    const target = getRestoreTarget();
    if (!target) return false;
    const energy = getDragonEnergyPercent(target.card);
    return energy === 0;
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

    const restoreDragonName = getDragonNameFromLink(target.link) || "Dragon";

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

      const dropdown = await waitForElement(`button[role="combobox"]`, "", 2);
      if (!dropdown) {
        await goToArena({ slow: true });
        return false;
      }
      await clickMean(dropdown, CONFIG.restoreDelay);

      // Match by NAME, not index — the dropdown's order does not
      // necessarily match the arena list's order.
      const dragonOption = await retry(
        () =>
          getVisibleElements('[role="option"]').find((option) =>
            option.textContent.trim().includes(restoreDragonName),
          ) || null,
        `Waiting for ${restoreDragonName} option`,
      );
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
        if (elixirExhausted) break;

        await restoreEnergy();

        if (elixirExhausted) break;

        const fightButton = await waitForButton(
          "Walcz",
          CONFIG.retryCount,
          true,
        );
        if (!fightButton) {
          errorCount++;
          break;
        }

        const ownName = getOwnName(fightButton) || CONFIG.restoreDragonName || "Dragon";
        const enemyPoints = getEnemyPoints(fightButton);
        if (enemyPoints == null || enemyPoints > CONFIG.maxEnemyPoints) {
          opponentRerolls++;
          if (opponentRerolls > CONFIG.maxOpponentRerolls) break;
          await rerollMatchup(fightButton);
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
