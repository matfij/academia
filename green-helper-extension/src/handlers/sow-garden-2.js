(async () => {
  const skipTiles = [17, 34, 51, 68, 85, 102, 119, 136, 153, 170, 187, 204];

  console.log(
    "\n====================== SOW GARDEN [2] STARTED ======================\n"
  );

  for (let tile = 1; tile <= 204; tile++) {
    try {
      if (tile % 2 === 0 || skipTiles.includes(tile)) {
        continue;
      }
      document.querySelector(`#gardenTile${tile}`).click();
      console.log("Sowed tile", tile);
      await window.GreenHelper.wait(50);
    } catch (e) {
      console.error("Sow error at tile", tile, e);
    }
  }

  console.log(
    "\n====================== SOW GARDEN [2] COMPLETE ======================\n"
  );
})();
