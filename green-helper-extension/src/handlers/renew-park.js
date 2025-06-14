(async () => {
  console.log(
    "\n====================== RENEW PARK STARTED ======================\n"
  );
  for (let tile = 1; tile <= 204; tile++) {
    try {
      park.setTile(tile);
      await window.GreenHelper.wait(100);
      const renew = await window.GreenHelper.waitForLabel(
        "Upłynął czas przydatności",
        "#park_renewitem_commit_duration",
        500
      );
      if (renew) {
        park.renewItemCommitCommit(tile);
        await window.GreenHelper.wait(100);
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
