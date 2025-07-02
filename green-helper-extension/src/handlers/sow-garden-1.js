(async () => {
  console.log("\n====================== SOW GARDE0N [1] STARTED ======================\n");

  for (let tile = 1; tile <= 204; tile++) {
    try {
      document.querySelector(`#gardenTile${tile}`).click();
      console.log("Sowed tile", tile);
      await window.GreenHelper.wait(50);
    } catch (e) {
      console.error("Sow error at tile", tile, e);
    }
  }

  console.log("\n====================== SOW GARDEN [1] COMPLETE ======================\n");
})();
