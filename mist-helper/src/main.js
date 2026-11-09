const main = async () => {
  /*
   * Inject floating dialog
   */
  const css = await fetch(chrome.runtime.getURL("src/index.css")).then((res) =>
    res.text()
  );
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const html = await fetch(chrome.runtime.getURL("src/index.html")).then(
    (res) => res.text()
  );
  const root = document.createElement("div");
  root.innerHTML = html;
  document.body.appendChild(root);

  /*
   * Energy restore setting
   */
  const restoreEnergyToggle = document.getElementById("restore-energy-toggle");
  const saved = localStorage.getItem("maestro:restore-energy");
  restoreEnergyToggle.checked = saved === null ? true : saved === "true";

  restoreEnergyToggle.addEventListener("change", () => {
    localStorage.setItem("maestro:restore-energy", String(restoreEnergyToggle.checked));
  });

  const restoreDragonSelect = document.getElementById("restore-dragon");
  const dragonKey = "maestro:restore-dragon";

  const names = [];
  const seen = new Set();
  for (const entry of globalThis.MAESTRO_DRAGONS || []) {
    const name = String(entry || "").trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    names.push(name);
  }
  const savedDragon = localStorage.getItem(dragonKey) || "";
  restoreDragonSelect.replaceChildren(new Option("Choose", ""));
  for (const name of names) restoreDragonSelect.add(new Option(name, name));
  restoreDragonSelect.value = names.includes(savedDragon) ? savedDragon : "";

  restoreDragonSelect.addEventListener("change", () => {
    localStorage.setItem(dragonKey, restoreDragonSelect.value);
  });

  const bindRange = (id, key, fallback) => {
    const input = document.getElementById(id);
    const output = document.getElementById(`${id}-value`);
    const saved = Number(localStorage.getItem(key));
    const min = Number(input.min);
    const max = Number(input.max);
    const initial = Number.isFinite(saved) ? saved : fallback;
    input.value = String(Math.min(max, Math.max(min, initial)));
    const paint = () => {
      output.textContent = `${input.value} ms`;
    };
    paint();
    input.addEventListener("input", () => {
      localStorage.setItem(key, input.value);
      paint();
    });
  };

  bindRange("battle-delay", "maestro:battle-delay", 320);
  bindRange("restore-delay", "maestro:restore-delay", 600);
  bindRange("reroll-delay", "maestro:reroll-delay", 600);
  bindRange("feed-delay", "maestro:feed-delay", 600);
  bindRange("train-delay", "maestro:train-delay", 600);

  const statKey = "maestro:feed-stat";
  const savedStat = localStorage.getItem(statKey) === "kondycja" ? "kondycja" : "attack";
  const statInput = document.querySelector(`input[name="feed-stat"][value="${savedStat}"]`);
  if (statInput) statInput.checked = true;
  for (const radio of document.querySelectorAll('input[name="feed-stat"]')) {
    radio.addEventListener("change", () => {
      if (radio.checked) localStorage.setItem(statKey, radio.value);
    });
  }

  const trainKey = "maestro:train-stat";
  const savedTrain = localStorage.getItem(trainKey);
  const trainStat = ["attack", "kondycja", "agility"].includes(savedTrain) ? savedTrain : "attack";
  const trainInput = document.querySelector(`input[name="train-stat"][value="${trainStat}"]`);
  if (trainInput) trainInput.checked = true;
  for (const radio of document.querySelectorAll('input[name="train-stat"]')) {
    radio.addEventListener("change", () => {
      if (radio.checked) localStorage.setItem(trainKey, radio.value);
    });
  }

  const tabKey = "maestro:panel-tab";
  const tabButtons = [...document.querySelectorAll("[data-tab]")];
  const tabPanels = [...document.querySelectorAll("[data-panel]")];
  const showTab = (name) => {
    const active = tabPanels.some((panel) => panel.dataset.panel === name) ? name : "battle";
    for (const button of tabButtons) {
      const on = button.dataset.tab === active;
      button.classList.toggle("is-active", on);
      button.setAttribute("aria-selected", on ? "true" : "false");
    }
    for (const panel of tabPanels) panel.hidden = panel.dataset.panel !== active;
    localStorage.setItem(tabKey, active);
  };
  showTab(localStorage.getItem(tabKey) || "battle");
  for (const button of tabButtons) {
    button.addEventListener("click", () => showTab(button.dataset.tab));
  }

  /*
   * Enable dialog drag & drop
   */
  let offsetX = 0;
  let offsetY = 0;
  let startX = 0;
  let startY = 0;

  const container = root.querySelector("#maestro");

  if (container) container.onmousedown = (e) => {
    if (e.target.closest("input, button, a, label, textarea, select")) return;
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    offsetX = container.offsetLeft;
    offsetY = container.offsetTop;

    document.onmousemove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      container.style.left = `${offsetX + dx}px`;
      container.style.top = `${offsetY + dy}px`;
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  /*
   * Inject common utility scripts
   */
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("src/utils.js");
  (document.head || document.documentElement).appendChild(script);

  /*
   * Append event listeners to dialog buttons
   */
  const runHandler = (id, path) => {
    document.getElementById(id).addEventListener("click", async () => {
      const script = document.createElement("script");
      script.src = chrome.runtime.getURL(path);
      script.onload = () => script.remove();
      (document.head || document.documentElement).appendChild(script);
    });
  };

  runHandler("battle-button", "src/handlers/battle.js");
  runHandler("feed-button", "src/handlers/feed.js");
  runHandler("train-button", "src/handlers/train.js");
};

main();
