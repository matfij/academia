(async () => {
  console.log(
    "\n====================== BATTLE CASUAL STARTED ======================\n",
  );

  const { wait, isVisible } = window.GreenHelper;

  const CONFIG = {
    restoreDragonName: "Carrera",
    potionName: "Wywar Energetyzujący",
    get restoreEnergyEnabled() {
      const toggle = document.getElementById("restore-energy-toggle");
      return toggle ? toggle.checked : true;
    },
    retryCount: 5,
    baseDelay: 100,
    backoffFactor: 2,
    maxDelay: 3000,
    maxEnemyPoints: 1100,
    maxOpponentRerolls: 30,
    debug: true,
  };

  const battleResults = {};
  let battleCount = 0;
  let errorCount = 0;
  let opponentRerolls = 0;
  let canRestore = true;
  let elixirExhausted = false;

  const getDelay = (attempt) =>
    Math.min(
      CONFIG.baseDelay * CONFIG.backoffFactor ** attempt,
      CONFIG.maxDelay,
    );

  const retry = async (operation, label, retries = CONFIG.retryCount) => {
    let lastError;
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const result = await operation(attempt);
        if (result) return result;
      } catch (error) {
        lastError = error;
        console.warn(`${label} attempt ${attempt + 1} failed`, error);
      }
      await wait(getDelay(attempt));
    }
    if (lastError) console.warn(`${label} failed`, lastError);
    return null;
  };

  const normalizeText = (value) => (value ?? "").replace(/\s+/g, " ").trim();

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
    const root = document.querySelector("#mist-helper") || document.body;
    let results = document.getElementById("battle-results");
    if (!results) {
      // create minimal markup if host page doesn't include it
      results = document.createElement("div");
      results.id = "battle-results";
      results.className = "battle-results";
      const title = document.createElement("strong");
      title.className = "battle-results-title";
      title.textContent = "Battle Results";
      const tableDiv = document.createElement("div");
      tableDiv.id = "battle-results-table";
      tableDiv.className = "battle-results-table";
      const messagesDiv = document.createElement("div");
      messagesDiv.id = "battle-results-messages";
      messagesDiv.className = "battle-results-messages";
      results.appendChild(title);
      results.appendChild(tableDiv);
      results.appendChild(messagesDiv);
      root.appendChild(results);
    }
    return results;
  };

  const appendMessage = (text, cls) => {
    getResultsContainer();
    const messages = document.getElementById("battle-results-messages");
    const p = document.createElement("div");
    p.textContent = text;
    p.className = "battle-message" + (cls ? ` ${cls}` : "");
    messages.prepend(p);
    return p;
  };

  const renderResultsTable = (resultsObj) => {
    getResultsContainer();
    const tableContainer = document.getElementById("battle-results-table");
    // clear previous table
    tableContainer.innerHTML = "";
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Dragon", "Battles", "Wins", "Losses", "Silver"].forEach((h) => {
      const th = document.createElement("th");
      th.textContent = h;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    Object.keys(resultsObj).forEach((dragon) => {
      const row = document.createElement("tr");
      const stats = resultsObj[dragon];
      [
        dragon,
        stats.battles,
        stats.wins,
        stats.losses,
        stats.silverEarned,
      ].forEach((val) => {
        const td = document.createElement("td");
        td.textContent = String(val);
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    tableContainer.appendChild(table);
  };

  const getDragonName = () => {
    const dragonNameElement = document.querySelector("p.text-xl.text-green");
    if (!dragonNameElement) {
    }
    return dragonNameElement.textContent.trim();
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
      battleResults[dragonName] = {
        battles: 0,
        wins: 0,
        losses: 0,
        silverEarned: 0,
      };
    }

    battleResults[dragonName].battles++;
    if (result === "win") {
      battleResults[dragonName].wins++;
    } else if (result === "loss") {
      battleResults[dragonName].losses++;
    }
    battleResults[dragonName].silverEarned += silver;
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
    if (!client) {
      console.warn(
        "[battle] query client not found; navigation may keep the same opponent",
      );
      return null;
    }
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

  const leaveArena = async () => {
    const dragonsLink = await retry(
      () =>
        getVisibleElements('a[href*="/dragons"]').find((link) =>
          link.textContent.includes("Smoki"),
        ) || null,
      "Waiting for dragons link",
    );
    if (!dragonsLink) return false;
    dragonsLink.click();
    const arrived = await waitForPath(
      (path) => path.startsWith("/dragons") && !path.startsWith("/battles"),
      "Waiting to leave the arena",
    );
    return Boolean(arrived);
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
    arenaLink.click();
    const arrived = await waitForPath(
      (path) => path.startsWith("/battles"),
      "Waiting to enter the arena",
    );
    if (!arrived) return false;
    await waitForOwnDragonCards();
    return true;
  };

  const rerollMatchup = async (fightButton) => {
    const previous = getRivalSignature(getMatchupRoot(fightButton));
    const invalidation = invalidateBattleCandidates(fightButton);
    const left = await leaveArena();
    if (!left) console.warn("[battle] did not confirm leaving the arena");
    await openArena();
    if (invalidation) {
      await invalidation.catch((error) => {
        console.warn("[battle] candidate refresh failed", error);
      });
    }
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

  const goToArena = async () => {
    const dragonsLink = await retry(
      () =>
        getVisibleElements('a[href*="/dragons"]').find((link) =>
          link.textContent.includes("Smoki"),
        ) || null,
      "Waiting for dragons link",
    );
    if (dragonsLink) {
      dragonsLink.click();
      await wait(getDelay(0));
    }
    const arenaLink = await retry(
      () =>
        getVisibleElements('a[href="/battles/casual"]').find((link) =>
          link.textContent.includes("Arena"),
        ) || null,
      "Waiting for arena link",
    );
    if (arenaLink) {
      arenaLink.click();
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

  const getDragonNameFromLink = (link) => {
    if (!link) return null;
    const inlineSpan = link.querySelector("span.inline");
    return (inlineSpan ? inlineSpan.textContent : link.textContent).trim();
  };

  // Climb from a dragon <a> up to the surrounding card, up to `maxLevels`
  // parents, and return the card if it contains an energy-percentage span
  // (e.g. "0%", "56%"). Opponent dragons never show this badge, so this
  // doubles as a filter for "is this actually one of MY dragons".
  const getCardWithEnergyBadge = (link, maxLevels = 8) => {
    let container = link;
    for (let level = 0; level < maxLevels && container; level++) {
      const hasEnergyBadge = [...container.querySelectorAll("span")].some(
        (span) => /^\d+%$/.test(span.textContent.trim()),
      );
      if (hasEnergyBadge) return container;
      container = container.parentElement;
    }
    return null;
  };

  // Only YOUR dragons show an energy badge, so filtering on that first
  // (instead of indexing into every /dragons/ link on the page, which can
  // include opponent profile links too) reliably isolates your own
  // dragon cards, in DOM order.
  const getOwnDragonCards = () => {
    return getVisibleElements('a[href^="/dragons/"]')
      .map((link) => {
        const card = getCardWithEnergyBadge(link);
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
    const ownCards = getOwnDragonCards();
    if (CONFIG.debug) {
      console.log(
        "[energy-check] own dragons found:",
        ownCards.map(({ link, card }) => ({
          name: getDragonNameFromLink(link),
          energy:
            [...card.querySelectorAll("span")]
              .map((s) => s.textContent.trim())
              .find((t) => /^\d+%$/.test(t)) || "?",
        })),
      );
    }
    // Match by NAME across whatever cards exist right now, rather than by
    // position - the arena can re-sort this list (e.g. after a fight or
    // an item use), so "index 0" can silently start pointing at a
    // different dragon than the one we actually want to keep topped up.
    return (
      ownCards.find(({ link }) =>
        getDragonNameFromLink(link)?.includes(CONFIG.restoreDragonName),
      ) || null
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
    if (!CONFIG.restoreEnergyEnabled || !canRestore) return false;

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

    const restoreDragonName =
      getDragonNameFromLink(target.link) || CONFIG.restoreDragonName;

    appendMessage(
      `Dragon ${restoreDragonName} has no energy; checking inventory`,
      "info",
    );

    try {
      const inventoryLink = await retry(
        () =>
          getVisibleElements('a[href="/inventory"]').find((link) =>
            link.textContent.includes("Przedmioty"),
          ) || null,
        "Waiting for inventory link",
      );
      if (!inventoryLink) return false;
      inventoryLink.click();

      const item = await retry(
        () => getItemCardByName(CONFIG.potionName) || null,
        "Waiting for energy elixir item in inventory",
      );
      if (!item) {
        await goToArena();
        return false;
      }
      if (!hasUsableEnergyElixir()) {
        elixirExhausted = true;
        console.log(
          "[restore] no usable elixir available in inventory; stopping battle loop",
        );
        await goToArena();
        return false;
      }

      const useButton = await retry(
        () => findItemUseButton(),
        "Waiting for energy elixir button",
      );
      if (!useButton) {
        await goToArena();
        return false;
      }
      useButton.click();

      const confirmation = await waitForElement(
        "body",
        `Czy na pewno chcesz użyć ${CONFIG.potionName}?`,
      );
      if (!confirmation) {
        await goToArena();
        return false;
      }

      const dropdown = await waitForElement(`button[role="combobox"]`, "", 2);
      if (!dropdown) {
        await goToArena();
        return false;
      }
      dropdown.click();

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
        await goToArena();
        return false;
      }
      dragonOption.click();

      const submitButton = await waitForButton("Użyj", CONFIG.retryCount, true);
      if (!submitButton) {
        await goToArena();
        return false;
      }
      submitButton.click();
      await wait(getDelay(2));
      await goToArena();
      elixirExhausted = false;
      appendMessage(`Energy restored for ${restoreDragonName}`, "info");
      return true;
    } finally {
      // Always runs: success, early return, or thrown error.
      canRestore = true;
    }
  };

  try {
    await goToArena();

    while (errorCount < 5) {
      try {
        if (elixirExhausted) {
          console.log(
            "[battle] elixir exhaustion confirmed; skipping re-check for more fights",
          );
          break;
        }

        await restoreEnergy();

        if (elixirExhausted) {
          console.log(
            "[battle] elixir exhaustion confirmed after restore check; stopping",
          );
          break;
        }

        const fightButton = await waitForButton(
          "Walcz",
          CONFIG.retryCount,
          true,
        );
        if (!fightButton) {
          console.log("No more battles available");
          errorCount++;
          break;
        }

        const enemyPoints = getEnemyPoints(fightButton);
        if (enemyPoints == null || enemyPoints > CONFIG.maxEnemyPoints) {
          opponentRerolls++;
          if (opponentRerolls > CONFIG.maxOpponentRerolls) {
            appendMessage(
              enemyPoints == null
                ? "Could not read enemy Punkty. Stopping."
                : `Enemy Punkty stayed above ${CONFIG.maxEnemyPoints} after ${CONFIG.maxOpponentRerolls} redraws. Stopping.`,
              "info",
            );
            break;
          }
          appendMessage(
            enemyPoints == null
              ? "Could not read enemy Punkty. Leaving the arena to redraw."
              : `Enemy Punkty ${enemyPoints} exceeds ${CONFIG.maxEnemyPoints}. Leaving the arena to redraw.`,
            "info",
          );
          await rerollMatchup(fightButton);
          continue;
        }
        opponentRerolls = 0;

        fightButton.click();

        battleCount++;
        appendMessage(`Battle ${battleCount} started`, "info");
        await wait(getDelay(0));

        const skipButton = await waitForButton("Pomiń");
        if (skipButton) {
          skipButton.click();
          await wait(getDelay(0));
        }

        const dragonName = getDragonName();
        const { result, points } = await getBattleResult();
        updateDragonStats(dragonName, result, points);
        appendMessage(
          `Battle result: ${result} +${points} vs ${dragonName}`,
          "info",
        );
        renderResultsTable(battleResults);

        const returnButton = await waitForButton("Powrót");
        if (returnButton) {
          returnButton.click();
          await wait(getDelay(0));
        }
      } catch (error) {
        await goToArena();
        errorCount++;
      }
    }
    renderResultsTable(battleResults);
  } catch (error) {
    console.error("Error in battle casual handler:", error);
    appendMessage(
      `Error in battle casual handler: ${error?.message || error}`,
      "error",
    );
  }

  appendMessage(
    `\n====================== BATTLE CASUAL COMPLETE (${battleCount} battles) ======================\n`,
    "info",
  );
})();
