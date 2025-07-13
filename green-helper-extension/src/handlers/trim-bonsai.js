(async () => {
  console.log("\n====================== TRIM BONSAI STARTED ======================\n");

  for (let tree = 1; tree <= 10; tree++) {
    for (let branch = 1; branch <= 10; branch++) {
      await window.GreenHelper.wait(10);
      const branchElement = document.querySelector(`#bonsai_branch${branch}`);
      if (branchElement) {
        await window.GreenHelper.wait(150);
        branchElement.click();
        console.log(`Trimmed tree: ${tree}, branch: ${branch}`);
      } else {
        break;
      }
    }
    const nextTreeElement = document.querySelector(
      `#bonsai_slots_line > div:nth-child(${tree + 2}) > div.tree`
    );
    if (nextTreeElement) {
      await window.GreenHelper.wait(500);
      nextTreeElement.click();
    } else {
      break;
    }
  }

  console.log("\n====================== TRIM BONSAI COMPLETE ======================\n");
})();
