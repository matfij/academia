const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isVisible = (el) => {
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

const waitForMessage = async (text, timeout = 1000) => {
  const interval = 50;
  let elapsed = 0;
  while (elapsed < timeout) {
    const found = [
      ...document.body.querySelectorAll("#park_renewitem_commit_duration"),
    ].some((el) => el.textContent.includes(text) && isVisible(el));
    if (found) {
      return true;
    }
    await wait(interval);
    elapsed += interval;
  }
  return false;
};

(async () => {
  console.log(
    "\n====================== RENEW PARK STARTED ======================\n"
  );
  for (let tile = 1; tile <= 204; tile++) {
    try {
      await wait(100);
      park.setTile(tile);
      const renew = await waitForMessage("Upłynął czas przydatności", 400);
      if (renew) {
        park.renewItemCommitCommit(tile);
        console.log("Renewed for tile", tile);
      }
      basedialog.close();
    } catch (e) {
      console.error("Renew error at tile", tile, e);
    }
  }
  console.log(
    "\n====================== RENEW PARK COMPLETE ======================\n"
  );
})();
