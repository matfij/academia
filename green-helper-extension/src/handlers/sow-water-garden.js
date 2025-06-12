(async () => {
  console.log(
    "\n====================== SOW WATER GARDEN STARTED ======================\n"
  );
  for (let tile = 1; tile <= 204; tile++) {
    try {
      await window.GreenHelper.wait(10);
      document.querySelector(`#wgGrid${tile}`).click();
      console.log("Sowed tile", tile);
    } catch (e) {
      console.error("Sow error at tile", tile, e);
    }
  }
  console.log(
    "\n====================== SOW WATER GARDEN COMPLETE ======================\n"
  );
})();
