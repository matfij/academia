const setup = async () => {
  const css = await fetch(chrome.runtime.getURL("src/index.css")).then((res) =>
    res.text()
  );
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const html = await fetch(chrome.runtime.getURL("src/index.html")).then(
    (res) => res.text()
  );
  const root = document.createElement("div");
  root.innerHTML = html;
  document.body.appendChild(root);

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

  document
    .getElementById("renew-park-button")
    .addEventListener("click", async () => {
      const script = document.createElement("script");
      script.src = chrome.runtime.getURL("src/handlers/renew-park.js");
      script.onload = () => script.remove();
      (document.head || document.documentElement).appendChild(script);
    });
};

setup();
