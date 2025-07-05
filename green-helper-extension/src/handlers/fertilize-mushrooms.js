(async () => {
  console.log("\n====================== FERTILIZE MUSHROOMS STARTED ======================\n");

  await window.GreenHelper.wait(100);
  document.querySelector("#megafruit_need_water")?.click();
  await window.GreenHelper.wait(100);
  setObjectMegafruitCommit(3);
  await window.GreenHelper.wait(100);
  document.querySelector("#baseDialogButton")?.click();

  await window.GreenHelper.wait(100);
  document.querySelector("#megafruit_need_light")?.click();
  await window.GreenHelper.wait(100);
  setObjectMegafruitCommit(8);
  await window.GreenHelper.wait(100);
  document.querySelector("#baseDialogButton")?.click();

  await window.GreenHelper.wait(100);
  document.querySelector("#megafruit_need_fertilize")?.click();
  await window.GreenHelper.wait(100);
  setObjectMegafruitCommit(13);
  await window.GreenHelper.wait(100);
  document.querySelector("#baseDialogButton")?.click();

  console.log("\n====================== FERTILIZE MUSHROOMS COMPLETE ======================\n");
})();
