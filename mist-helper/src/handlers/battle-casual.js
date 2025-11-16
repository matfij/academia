(async () => {
  console.log(
    "\n====================== BATTLE CASUAL STARTED ======================\n"
  );

  const { wait, isVisible } = window.GreenHelper;

  const battleResults = {};

  const getDragonName = () => {
    const dragonNameElement = document.querySelector("p.text-xl.text-green");
    if (!dragonNameElement) {
    }
    return dragonNameElement.textContent.trim();
  };

  const getBattleResult = async () => {
    await wait(500);
    const resultText = document.body.textContent;
    const isWin = resultText.includes("Wygrana!");
    const isLoss = resultText.includes("Przegrana.");

    const silverSpan = document.querySelector(
      "span.mx-auto.flex.items-center.gap-1"
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
    requireEnabled = false
  ) => {
    for (let i = 0; i < maxRetries; i++) {
      const button = [...document.querySelectorAll("button")].find(
        (el) =>
          el.textContent.includes(text) &&
          (requireEnabled ? !el.disabled : true) &&
          isVisible(el)
      );
      if (button) return button;
      await wait(500 * (i + 1));
    }
    return null;
  };

  const waitForLink = async (text, maxRetries = 5) => {
    for (let i = 0; i < maxRetries; i++) {
      const link = [...document.querySelectorAll("a")].find(
        (el) => el.textContent.includes(text) && isVisible(el)
      );
      if (link) return link;
      await wait(500 * (i + 1));
    }
    return null;
  };

  try {
    const arenaLink = await waitForLink("Arena");
    if (!arenaLink) {
      console.error("Arena link not found");
      return;
    }
    arenaLink.click();
    await wait(2000);

    let battleCount = 0;
    let isRunning = true;

    while (isRunning) {
      try {
        const fightButton = await waitForButton("Walcz", 5, true);
        if (!fightButton) {
          console.log("No more battles available");
          isRunning = false;
          break;
        }
        fightButton.click();

        battleCount++;
        console.log(`Battle ${battleCount} started`);
        await wait(1000);

        const skipButton = await waitForButton("Pomiń");
        if (!skipButton) {
          console.error("Skip button not found after retries");
          break;
        }
        skipButton.click();
        await wait(1000);

        const dragonName = getDragonName();
        const { result, points } = await getBattleResult();
        updateDragonStats(dragonName, result, points);
        console.log(
          `Battle result: ${result} (+${points} points) vs ${dragonName}`
        );

        const returnButton = await waitForButton("Powrót");
        if (!returnButton) {
          console.error("Return button not found after retries");
          break;
        }
        returnButton.click();
        await wait(1500);
      } catch (error) {
        console.error("Error during battle:", error);
        isRunning = false;
      }
    }

    console.table(battleResults);
  } catch (error) {
    console.error("Error in battle casual handler:", error);
  }

  console.log(
    `\n====================== BATTLE CASUAL COMPLETE (${battleCount} battles) ======================\n`
  );
})();
