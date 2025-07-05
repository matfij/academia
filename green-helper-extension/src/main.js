const setup = async () => {
  /*
   * Inject floating dialog
   */
  const css = await fetch(chrome.runtime.getURL("src/index.css")).then((res) => res.text());
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const html = await fetch(chrome.runtime.getURL("src/index.html")).then((res) => res.text());
  const root = document.createElement("div");
  root.innerHTML = html;
  document.body.appendChild(root);

  /*
   * Enable dialog drag & drop
   */
  let offsetX = 0;
  let offsetY = 0;
  let startX = 0;
  let startY = 0;

  const container = document.getElementById("green-helper");

  container.onmousedown = (e) => {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    offsetX = container.offsetLeft;
    offsetY = container.offsetTop;

    document.onmousemove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      container.style.left = `${offsetX + dx}px`;
      container.style.top = `${offsetY + dy}px`;
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  /*
   * Inject common utility scripts
   */
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("src/utils.js");
  (document.head || document.documentElement).appendChild(script);

  script.src = chrome.runtime.getURL("src/stock-prices.js");
  (document.head || document.documentElement).appendChild(script);

  /*
   * Append event listeners to dialog buttons
   */
  document.getElementById("sow-garden-button-1").addEventListener("click", async () => {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("src/handlers/sow-garden-1.js");
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  });

  document.getElementById("sow-garden-button-2").addEventListener("click", async () => {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("src/handlers/sow-garden-2.js");
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  });

  document.getElementById("serve-customers-button").addEventListener("click", () => {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("src/handlers/serve-customers.js");
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  });

  document.getElementById("sow-water-garden-button").addEventListener("click", async () => {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("src/handlers/sow-water-garden.js");
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  });

  document.getElementById("fertilize-mushrooms-button").addEventListener("click", () => {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("src/handlers/fertilize-mushrooms.js");
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  });

  document.getElementById("trim-bonsai-button").addEventListener("click", async () => {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("src/handlers/trim-bonsai.js");
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  });

  document.getElementById("manage-bird-post-button").addEventListener("click", async () => {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("src/handlers/manage-bird-post.js");
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  });

  document.getElementById("renew-park-button").addEventListener("click", async () => {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("src/handlers/renew-park.js");
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  });

  document.getElementById("compare-prices-button").addEventListener("click", async () => {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("src/handlers/compare-prices.js");
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  });
};

setup();
