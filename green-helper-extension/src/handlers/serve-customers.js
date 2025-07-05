(async () => {
  console.log("\n====================== SERVE CUSTOMERS STARTED ======================\n");

  let maxCustomerIndex = 0;
  let nextCustomer = document.querySelector(`#i${maxCustomerIndex}`);

  while (nextCustomer) {
    maxCustomerIndex++;
    nextCustomer = document.querySelector(`#i${maxCustomerIndex}`);
  }

  maxCustomerIndex--;
  nextCustomer = document.querySelector(`#i${maxCustomerIndex}`);

  while (maxCustomerIndex >= 0) {
    await window.GreenHelper.wait(100);
    nextCustomer?.click();
    await window.GreenHelper.wait(200);
    document.querySelector("#wimpVerkaufYes")?.click();
    console.log(`Customer ${maxCustomerIndex} served.`);
    maxCustomerIndex--;
    nextCustomer = document.querySelector(`#i${maxCustomerIndex}`);
  }

  document.querySelector("#baseDialogButton")?.click();

  console.log("\n====================== SERVE CUSTOMERS COMPLETE ======================\n");
})();
