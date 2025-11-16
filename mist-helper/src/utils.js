window.GreenHelper = window.GreenHelper || {};

window.GreenHelper.wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
