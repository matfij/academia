(async () => {
  console.log("\n====================== SOW WATER GARDEN STARTED ======================\n");

  const size = {
    width: 17,
    height: 12,
  };

  const isInner = (x, y) => x > 2 && x < 16 && y > 2 && y < 11;

  let row = 1;
  let col = 1;

  for (let tile = 1; tile <= 204; tile++) {
    try {
      if (isInner(col, row)) {
        await window.GreenHelper.wait(25);
        document.querySelector(`#wgGrid${tile}`).click();
        console.log("Sowed tile", tile);
      }
    } catch (e) {
      console.error("Sow error at tile", tile, e);
    } finally {
      console.log({ row, col, isInner: isInner(col, row) });
      col++;
      if (col > size.width) {
        col = 1;
        row++;
      }
    }
  }

  console.log("\n====================== SOW WATER GARDEN COMPLETE ======================\n");
})();
