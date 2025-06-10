(async () => {
  console.log(
    "\n====================== RENEW PARK STARTED ======================\n"
  );
  for (let tile = 1; tile <= 204; tile++) {
    try {
      await window.GreenHelper.wait(100);
      park.setTile(tile);
      const renew = await window.GreenHelper.waitForLabel(
        "Upłynął czas przydatności",
        "#park_renewitem_commit_duration",
        400
      );
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
