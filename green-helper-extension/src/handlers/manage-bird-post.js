(async () => {
  console.log("\n====================== MANAGE BIRD POST STARTED ======================\n");

  const jobSlots = [1, 2, 6];
  const birdSlots = [1, 2, 5];

  await window.GreenHelper.wait(50);
  document.querySelector(`#birds_quick`)?.click();

  // collect rewards
  for (let birdSlot of birdSlots) {
    try {
      await window.GreenHelper.wait(50);
      document.querySelector(`#birds_job_overview_slot${birdSlot}`)?.click();
      await window.GreenHelper.wait(50);
      document.querySelector(`#birds_job_finishbutton`)?.click();
      await window.GreenHelper.wait(50);
      document.querySelector(`#birds_job_backbutton`)?.click();
      console.log(`Collected reward at slot ${slot}.`);
    } catch {
      console.log(`Reward at slot ${slot} not found.`);
    }
  }

  await window.GreenHelper.wait(50);
  document.querySelector(`#birds_quick`)?.click();

  // feed birds
  for (let birdSlot of birdSlots) {
    try {
      await window.GreenHelper.wait(50);
      birds.feedBirdCommit(birdSlot);
      await window.GreenHelper.wait(50);
      document.querySelector(`#baseDialogButton`)?.click();
      console.log(`Fed bird at slot ${slot} not found.`);
    } catch {
      console.log(`Feeding at slot ${slot} not found.`);
    }
  }

  await window.GreenHelper.wait(50);
  document.querySelector(`#birds_quick`)?.click();

  // start new job
  for (let i = 0; i < jobSlots.length; i++) {
    try {
      await window.GreenHelper.wait(50);
      birds.setJobSlot(jobSlots[i]);
      await window.GreenHelper.wait(50);
      birds.clickHouse(birdSlots[i]);
      await window.GreenHelper.wait(50);
      birds.startJob();
      await window.GreenHelper.wait(50);
      birds.setJobSlot(jobSlots[i]);
      console.log(`Job at slot ${jobSlots[i]} started by bird ${birdSlots[i]}.`);
    } catch (err) {
      console.log(`Job at slot ${jobSlots[i]} could not be started.`, err);
    }
  }

  console.log("\n====================== MANAGE BIRD POST COMPLETE ======================\n");
})();
