(async () => {
  console.log(
    "\n====================== BATTLE CASUAL STARTED ======================\n",
  );

  const { wait, isVisible } = window.GreenHelper;

  const battleResults = {};
  let battleCount = 0;
  let errorCount = 0;

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
    messages.appendChild(p);
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
    ["Dragon", "Battles", "Wins", "Losses", "Silver Earned"].forEach((h) => {
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
    const resultText = document.body.textContent;
    let isWin = false;
    let isLoss = false;

    while (isWin || isLoss) {
      isWin = resultText.includes("Wygrana!");
      isLoss = resultText.includes("Przegrana.");
      await wait(70);
    }

    const silverSpan = document.querySelector(
      "span.mx-auto.flex.items-center.gap-1",
    );
    let silver = 0;
    if (silverSpan) {
      const silverText = silverSpan.textContent.trim();
      silver = parseInt(silverText) || 0;
    }

    return {
      result: isWin ? "win" : isLoss ? "loss" : "unknown",
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
    maxRetries = 5,
    requireEnabled = false,
  ) => {
    for (let i = 0; i < maxRetries; i++) {
      const button = [...document.querySelectorAll("button")].find(
        (el) =>
          el.textContent.includes(text) &&
          (requireEnabled ? !el.disabled : true) &&
          isVisible(el),
      );
      if (button) return button;
      await wait(150 * (i + 1));
    }
    return null;
  };

  const waitForLink = async (text, maxRetries = 10) => {
    for (let i = 0; i < maxRetries; i++) {
      const link = [...document.querySelectorAll("a")].find(
        (el) => el.textContent.includes(text) && isVisible(el),
      );
      if (link) return link;
      await wait(70 * (i + 1));
    }
    return null;
  };

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
    const dragonsLink = await waitForLink("Smoki");
    if (dragonsLink) {
      dragonsLink.click();
    }
    const arenaLink = await waitForLink("Arena");
    if (arenaLink) {
      arenaLink.click();
    }
    await wait(1000);
  };

  try {
    await goToArena();

    while (errorCount < 5) {
      try {
        const fightButton = await waitForButton("Walcz", 5, true);
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
        await wait(70);

        const skipButton = await waitForButton("Pomiń");
        if (skipButton) {
          skipButton.click();
          await wait(70);
        }

        const dragonName = getDragonName();
        const { result, points } = await getBattleResult();
        updateDragonStats(dragonName, result, points);
        appendMessage(
          `Battle result: ${result} (+${points} points) vs ${dragonName}`,
          "info",
        );
        renderResultsTable(battleResults);

        const returnButton = await waitForButton("Powrót");
        if (returnButton) {
          returnButton.click();
          await wait(70);
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
