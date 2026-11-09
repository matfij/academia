(async () => {
  if (window.__maestroTraining) return;
  window.__maestroTraining = true;

  const { wait, isVisible, clickMean, pauseMean, setting, choice } = window.GreenHelper;
  const trainClick = (element) => clickMean(element, CONFIG.trainDelay);
  const BETWEEN_DRAGONS = 1.9;

  const CONFIG = {
    get trainDelay() {
      return setting("train-delay", "maestro:train-delay", 600);
    },
    get mode() {
      const value = choice("train-stat", "maestro:train-stat", "attack");
      if (value === "kondycja" || value === "agility") return value;
      return "attack";
    },
    retryCount: 8,
    baseDelay: 150,
    backoffFactor: 2,
    maxDelay: 2000,
  };

  const STATS = {
    kondycja: "Kondycja",
    agility: "Zręczność",
  };

  const STAT_TITLES = new Set([
    "Siła",
    "Kondycja",
    "Zręczność",
    "Inteligencja",
    "Siła woli",
    "Charyzma",
    "Szczęście",
  ]);

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
        // Wait and try again. Training has no panel log of its own yet.
      }
      await wait(getDelay(attempt));
    }
    return null;
  };

  const normalizeText = (value) => (value ?? "").replace(/\s+/g, " ").trim();

  const getVisibleElements = (selector) =>
    [...document.querySelectorAll(selector)].filter(isVisible);

  const waitForPath = (predicate, label) =>
    retry(
      () => (predicate(location.pathname) ? location.pathname : null),
      label,
      20,
    );

  const isStatTitle = (paragraph) =>
    (paragraph.className?.toString?.() || "").includes("text-xl");

  // The card is the smallest node with this one title and one Trenuj button.
  // A shared parent contains every stat, and its first combobox is Siła.
  const findStatCard = (name) => {
    const title = [...document.querySelectorAll("p")].find(
      (paragraph) =>
        normalizeText(paragraph.textContent) === name && isStatTitle(paragraph),
    );
    if (!title) return null;

    let card = title;
    for (let level = 0; level < 8 && card; level++) {
      const titles = [...card.querySelectorAll("p")].filter(
        (paragraph) =>
          isStatTitle(paragraph) &&
          STAT_TITLES.has(normalizeText(paragraph.textContent)),
      );
      const trains = [...card.querySelectorAll("button")].filter(
        (button) => normalizeText(button.textContent) === "Trenuj",
      );
      if (titles.length === 1 && titles[0] === title && trains.length === 1) {
        return card;
      }
      card = card.parentElement;
    }
    return null;
  };

  const trainButton = (card) =>
    [...card.querySelectorAll("button")].find(
      (button) =>
        normalizeText(button.textContent) === "Trenuj" && isVisible(button),
    ) || null;

  const lacksMaterials = (card) => {
    const lines = [...card.querySelectorAll("p")].map((paragraph) =>
      normalizeText(paragraph.textContent),
    );
    for (let index = 0; index < lines.length; index++) {
      const haveMatch = lines[index].match(/^(\d+)\s+dostępnych sztuk$/);
      if (!haveMatch) continue;
      const have = Number(haveMatch[1]);
      const needLine = lines
        .slice(0, index)
        .reverse()
        .find((line) => /x\d+/.test(line));
      const need = Number((needLine?.match(/x(\d+)/) || [])[1]);
      if (Number.isFinite(need) && have < need) return true;
    }
    return false;
  };

  const closePickers = () =>
    retry(async () => {
      const open = document.querySelector(
        'button[role="combobox"][aria-expanded="true"]',
      );
      if (open) {
        open.click();
        return null;
      }
      const leftover = [...document.querySelectorAll('[role="listbox"]')].some(
        isVisible,
      );
      return leftover ? null : true;
    }, "Closing the dragon list", 8);

  const cardCombo = (card) =>
    card?.querySelector('button[role="combobox"]') || null;

  // Only the list opened by this card. A previous stat's list can stay
  // mounted, and the first one on the page is Siła.
  const ownedList = (combo) => {
    if (!combo || combo.getAttribute("aria-expanded") !== "true") return null;
    const id = combo.getAttribute("aria-controls");
    const owned = id ? document.getElementById(id) : null;
    if (owned && isVisible(owned)) return owned;
    return (
      [...document.querySelectorAll('[role="listbox"]')].find(isVisible) || null
    );
  };

  // The name is the first paragraph. Available rows use text-light-100.
  // Busy rows use text-gray, and the active first row must still be read.
  const optionName = (option) =>
    normalizeText(option.querySelector("p")?.textContent);

  const optionTrained = (option) => {
    const text = normalizeText(option.querySelector("p.text-sm")?.textContent);
    const match = text.match(/(\d+)/);
    return match ? Number(match[1]) : null;
  };

  const optionDisabled = (option) =>
    option.getAttribute("aria-disabled") === "true";

  const listOptions = (combo) => {
    const list = ownedList(combo);
    if (!list) return null;
    const options = [...list.querySelectorAll('[role="option"]')];
    if (!options.length) return null;
    if (options.some((option) => !optionName(option))) return null;
    return options;
  };

  const openOptions = async (card) => {
    const closed = await closePickers();
    if (!closed) return null;
    const combo = cardCombo(card);
    if (!combo) return null;
    await trainClick(combo);
    const options = await retry(
      () => listOptions(combo),
      "Waiting for the dragon list",
      12,
    );
    return options ? combo : null;
  };

  const comboShowsDragon = (combo, name) => {
    if (!combo) return false;
    const labels = [...combo.querySelectorAll("p")].map((paragraph) =>
      normalizeText(paragraph.textContent),
    );
    if (!labels.length || labels.some((label) => label.includes("Wybierz smoka"))) return false;
    return labels.some((label) => label.includes(name));
  };

  // The list highlights its first row. A click on that row closes the list
  // without choosing it. Hover does not move the highlight unless the pointer
  // is really moving, so the highlight is moved with the keyboard first.
  const pressOption = async (findOption) => {
    let option = findOption();
    if (!option) return false;
    if (
      option.hasAttribute("data-active-item") ||
      option.hasAttribute("data-autofocus")
    ) {
      const options = [
        ...(option.parentElement?.querySelectorAll('[role="option"]') || []),
      ];
      const index = options.indexOf(option);
      const key = index >= 0 && index < options.length - 1 ? "ArrowDown" : "ArrowUp";
      option.dispatchEvent(
        new KeyboardEvent("keydown", {
          key,
          code: key,
          bubbles: true,
          cancelable: true,
        }),
      );
      await wait(50);
      option = findOption();
      if (!option) return false;
    }
    option.click();
    return true;
  };

  const readTrainedMap = async (stat) => {
    const card = findStatCard(stat);
    if (!card) return null;
    const combo = await openOptions(card);
    const options = combo ? listOptions(combo) : null;
    if (!options) {
      await closePickers();
      return null;
    }
    const trained = new Map();
    for (const option of options) {
      const name = optionName(option);
      const value = optionTrained(option);
      if (!name || value == null) continue;
      trained.set(name, value);
    }
    await closePickers();
    return trained;
  };

  const selectDragon = async (card, name) => {
    const combo = await openOptions(card);
    const findOption = () =>
      listOptions(cardCombo(card))?.find(
        (element) => optionName(element) === name && !optionDisabled(element),
      ) || null;
    if (!combo || !findOption()) {
      await closePickers();
      return false;
    }
    const waitForChoice = () =>
      retry(() => {
        const current = cardCombo(card);
        return comboShowsDragon(current, name) ? current : null;
      }, "Waiting for the dragon selection");
    await pressOption(findOption);
    const selected = await waitForChoice();
    if (selected) return selected;
    if (!findOption()) {
      await closePickers();
      return false;
    }
    await pressOption(findOption);
    return waitForChoice();
  };

  const ensureTrainings = async () => {
    if (location.pathname !== "/dragons/activities/trainings") {
      const link = await retry(
        () =>
          getVisibleElements('a[href="/dragons/activities/trainings"]').find(
            (anchor) => normalizeText(anchor.textContent).includes("Szkolenia"),
          ) || null,
        "Waiting for Szkolenia",
      );
      if (!link) return null;
      await trainClick(link);
      const arrived = await waitForPath(
        (path) => path === "/dragons/activities/trainings",
        "Waiting for trainings",
      );
      if (!arrived) return null;
    }
    return retry(() => findStatCard("Kondycja"), "Waiting for training cards", 20);
  };

  const buildPlan = async () => {
    if (CONFIG.mode === "attack") {
      const strength = await readTrainedMap("Siła");
      const intelligence = await readTrainedMap("Inteligencja");
      if (!strength || !intelligence) return [];
      const names = [...strength.keys()];
      for (const name of intelligence.keys()) {
        if (!names.includes(name)) names.push(name);
      }
      const plan = [];
      for (const name of names) {
        const strengthValue = strength.get(name);
        const intelligenceValue = intelligence.get(name);
        if (strengthValue == null || intelligenceValue == null) continue;
        plan.push({
          name,
          stat: intelligenceValue > strengthValue ? "Inteligencja" : "Siła",
        });
      }
      return plan;
    }

    const stat = STATS[CONFIG.mode];
    const trained = await readTrainedMap(stat);
    if (!trained) return [];
    return [...trained.keys()].map((name) => ({ name, stat }));
  };

  try {
    const ready = await ensureTrainings();
    if (!ready) return;

    const plan = await buildPlan();
    const exhausted = new Set();

    for (const item of plan) {
      if (exhausted.has(item.stat)) continue;
      const card = findStatCard(item.stat);
      if (!card || lacksMaterials(card)) {
        exhausted.add(item.stat);
        continue;
      }

      const selected = await selectDragon(card, item.name);
      if (!selected) continue;

      const button = await retry(() => {
        const found = trainButton(card);
        return found && !found.disabled ? found : null;
      }, "Waiting until Trenuj is available");
      if (!button) continue;

      await trainClick(button);
      await retry(
        () => {
          const combo = card.querySelector('button[role="combobox"]');
          const text = normalizeText(combo?.textContent);
          return text.includes("Wybierz smoka") ? combo : null;
        },
        "Waiting for the training to start",
        20,
      );
      await pauseMean(CONFIG.trainDelay * BETWEEN_DRAGONS);
    }
  } catch {
    // Swallow so the running flag is always cleared.
  } finally {
    window.__maestroTraining = false;
  }
})();
