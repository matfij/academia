(() => {
  for (let row = 2; row <= 21; row++) {
    const productName = document.querySelector(
      `body > div.marketContainer > table > tbody > tr:nth-child(${row}) > td:nth-child(2) > a`
    ).textContent;

    const productPrice = parseFloat(
      document
        .querySelector(
          `body > div.marketContainer > table > tbody > tr:nth-child(${row}) > td:nth-child(4)`
        )
        .textContent.replace(".", "")
        .replace(",", ".")
    );

    const priceDiff =
      Math.round(100 * ((window.GreenHelper.stockPrices[productName] ?? 0) - productPrice)) / 100;

    let priceDiffLabel = document.createElement("b");

    if (priceDiff > 0) {
      priceDiffLabel.textContent = `+${priceDiff}`;
      priceDiffLabel.style.color = "#12ff21";
    } else {
      priceDiffLabel.textContent = `${priceDiff}`;
      priceDiffLabel.style.color = "#ff1221";
    }

    document
      .querySelector(
        `body > div.marketContainer > table > tbody > tr:nth-child(${row}) > td:nth-child(4)`
      )
      .appendChild(priceDiffLabel);
  }
})();
