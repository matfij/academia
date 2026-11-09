window.GreenHelper = window.GreenHelper || {};

window.GreenHelper.wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Short jittered pause before a click, so repeated actions are not metronomic.
window.GreenHelper.pause = (min = 160, max = 480) => {
  const low = Math.ceil(Math.min(min, max));
  const high = Math.floor(Math.max(min, max));
  const span = Math.max(0, high - low);
  const ms = low + Math.floor(Math.random() * (span + 1));
  return window.GreenHelper.wait(ms);
};

window.GreenHelper.click = async (element, min, max) => {
  if (!element) return false;
  await window.GreenHelper.pause(min, max);
  element.click();
  return true;
};

// Uniform range whose average is the panel slider. 0.62–1.38 keeps the old spread.
window.GreenHelper.spread = (mean) => {
  const center = Number(mean);
  const safe = Number.isFinite(center) && center > 0 ? center : 320;
  const low = Math.max(20, Math.round(safe * 0.62));
  const high = Math.max(low, Math.round(safe * 1.38));
  return [low, high];
};

window.GreenHelper.pauseMean = (mean) => {
  const [low, high] = window.GreenHelper.spread(mean);
  return window.GreenHelper.pause(low, high);
};

window.GreenHelper.clickMean = async (element, mean) => {
  const [low, high] = window.GreenHelper.spread(mean);
  return window.GreenHelper.click(element, low, high);
};

window.GreenHelper.setting = (id, key, fallback) => {
  const input = document.getElementById(id);
  const fromInput = input ? Number(input.value) : NaN;
  if (Number.isFinite(fromInput) && fromInput > 0) return fromInput;
  const saved = Number(localStorage.getItem(key));
  if (Number.isFinite(saved) && saved > 0) return saved;
  return fallback;
};

window.GreenHelper.choice = (name, key, fallback) => {
  const input = document.querySelector(`input[name="${name}"]:checked`);
  if (input?.value) return input.value;
  return localStorage.getItem(key) || fallback;
};

window.GreenHelper.isVisible = (el) => {
  const style = window.getComputedStyle(el);
  const rect = el.getBoundingClientRect();

  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    parseFloat(style.opacity) !== 0 &&
    rect.width > 0 &&
    rect.height > 0
  );
};

// Reserved for a later per-function log. Battle results use the counts table.
window.GreenHelper.log = () => {};

window.GreenHelper.waitForLabel = async (text, parent, timeout = 1000) => {
  const interval = timeout / 10;
  let elapsed = 0;

  while (elapsed < timeout) {
    const found = [...document.body.querySelectorAll(parent)].some(
      (el) => el.textContent.includes(text) && window.GreenHelper.isVisible(el)
    );

    if (found) {
      return true;
    }

    await window.GreenHelper.wait(interval);
    elapsed += interval;
  }

  return false;
};
