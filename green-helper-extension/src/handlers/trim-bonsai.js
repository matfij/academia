(async () => {
  console.log(
    "\n====================== TRIM BONSAI STARTED ======================\n"
  );

  for (let tree = 1; tree <= 10; tree++) {
    for (let branch = 1; branch <= 10; branch++) {
      const branchElement = document.querySelector(`#bonsai_branch${branch}`);
      if (branchElement) {
        branchElement.click();
        console.log(`Trimmed tree: ${tree}, branch: ${branch}`);
        await window.GreenHelper.wait(50);
      } else {
        break;
      }
    }
    const nextTreeElement = document.querySelector(
      `#bonsai_slots_line > div:nth-child(${tree + 3}) > div.tree`
    );
    if (nextTreeElement) {
      nextTreeElement.click();
      await window.GreenHelper.wait(250);
    } else {
      break;
    }
  }

  console.log(
    "\n====================== TRIM BONSAI COMPLETE ======================\n"
  );
})();
