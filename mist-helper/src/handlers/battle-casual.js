(async () => {
  console.log(
    "\n====================== BATTLE CASUAL STARTED ======================\n",
  );

  const { wait, isVisible } = window.GreenHelper;

  const CONFIG = {
    restoreDragonName: "Symboli",
    potionName: "Wywar Energetyzujący",
    get restoreEnergyEnabled() {
      const toggle = document.getElementById("restore-energy-toggle");
      return toggle ? toggle.checked : true;
    },
    retryCount: 5,
    baseDelay: 100,
    backoffFactor: 2,
    maxDelay: 3000,
    debug: true,
  };

  const battleResults = {};
  let battleCount = 0;
  let errorCount = 0;
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

  const getOpponentRank = (button) => {
    try {
      let el = button;
      for (let i = 0; i < 6 && el; i++) {
        const candidate = [...el.querySelectorAll("*")].find(
          (n) => n.textContent && n.textContent.includes("Punkty"),
        );
        if (candidate) {
          const m = candidate.textContent.match(/(\d[\d\s,.]*)/);
          if (m) return parseInt(m[1].replace(/\D/g, "")) || 0;
        }
        el = el.parentElement;
      }
      const global = [...document.querySelectorAll("*")].find(
        (n) => n.textContent && n.textContent.includes("Punkty"),
      );
      if (global) {
        const m2 = global.textContent.match(/(\d[\d\s,.]*)/);
        if (m2) return parseInt(m2[1].replace(/\D/g, "")) || 0;
      }
    } catch (e) {
      return 0;
    }
    return 0;
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

        const opponentRank = getOpponentRank(fightButton);
        if (opponentRank > 1000) {
          appendMessage(
            `Detected Rank=${opponentRank} > 1000 - retry.`,
            "info",
          );
          await goToArena();
          continue;
        }

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
