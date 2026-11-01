(async () => {
  if (window.__mistHelperFeeding) {
    console.warn("[feed] already running");
    return;
  }
  window.__mistHelperFeeding = true;

  console.log(
    "\n====================== FEED DRAGONS STARTED ======================\n",
  );

  const { wait, isVisible } = window.GreenHelper;

  const CONFIG = {
    foodName: "Ziarna",
    retryCount: 8,
    baseDelay: 150,
    backoffFactor: 2,
    maxDelay: 2000,
  };

  const getDelay = (attempt) =>
    Math.min(
      CONFIG.baseDelay * CONFIG.backoffFactor ** attempt,
      CONFIG.maxDelay,
    );

  const retry = async (operation, label, retries = CONFIG.retryCount) => {
    let lastError;
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const result = await operation(attempt);
        if (result) return result;
      } catch (error) {
        lastError = error;
        console.warn(`${label} attempt ${attempt + 1} failed`, error);
      }
      await wait(getDelay(attempt));
    }
    if (lastError) console.warn(`${label} failed`, lastError);
    return null;
  };

  const normalizeText = (value) => (value ?? "").replace(/\s+/g, " ").trim();

  const getVisibleElements = (selector) =>
    [...document.querySelectorAll(selector)].filter(isVisible);

  const waitForPath = (predicate, label) =>
    retry(
      () => (predicate(location.pathname) ? location.pathname : null),
      label,
      20,
    );

  // "Siła woli" must not match the Siła card.
  const readStat = (name) => {
    const heading = [...document.querySelectorAll("p")].find(
      (paragraph) =>
        (paragraph.className?.toString?.() || "").includes("text-lg") &&
        new RegExp(`^${name}\\s*:`).test(normalizeText(paragraph.textContent)),
    );
    if (!heading) return null;

    let card = heading;
    for (let level = 0; level < 8 && card; level++) {
      const headings = [...card.querySelectorAll("p")].filter(
        (paragraph) =>
          (paragraph.className?.toString?.() || "").includes("text-lg") &&
          /:\s*\d+/.test(normalizeText(paragraph.textContent)),
      );
      const plusButtons = [...card.querySelectorAll("button")].filter(
        (button) => normalizeText(button.textContent) === "+1",
      );
      if (headings.length === 1 && plusButtons.length === 1) {
        const digits = (heading.querySelector("span")?.textContent || "").replace(
          /\D/g,
          "",
        );
        const value = digits ? Number.parseInt(digits, 10) : null;
        return {
          name,
          value: Number.isFinite(value) ? value : null,
          plus: plusButtons[0],
        };
      }
      card = card.parentElement;
    }
    return null;
  };

  const getFoodCombo = () => {
    const label = [...document.querySelectorAll("div")].find(
      (element) =>
        normalizeText(element.textContent) === "Pokarm" &&
        (element.className?.toString?.() || "").includes("text-sm"),
    );
    return label?.parentElement?.querySelector('[role="combobox"]') || null;
  };

  const selectedFoodName = (combo) => {
    const nameSpan = [...combo.querySelectorAll("span")].find((span) => {
      const text = normalizeText(span.textContent);
      return text && !text.startsWith("+");
    });
    return nameSpan ? normalizeText(nameSpan.textContent) : "";
  };

  const getDragonHrefs = () => {
    const seen = new Set();
    const hrefs = [];
    for (const link of getVisibleElements('a[href^="/dragons/details/"]')) {
      const href = link.getAttribute("href") || "";
      if (!/^\/dragons\/details\/[^/]+$/.test(href) || seen.has(href)) continue;
      seen.add(href);
      hrefs.push(href);
    }
    return hrefs;
  };

  const linkLabel = (link) => {
    const named = link?.querySelector("p.font-semibold, span.inline");
    return named ? normalizeText(named.textContent) : "";
  };

  // The profile title is p.text-2xl > span.inline. It is not inside the
  // /dragons/:id anchor, which is only the expand icon.
  const profileName = () => {
    const named = document.querySelector("p.text-2xl span.inline");
    return named && isVisible(named) ? normalizeText(named.textContent) : "";
  };

  const waitForDragonPage = (href, expectedName) =>
    retry(() => {
      if (location.pathname !== href) return null;
      const name = profileName();
      if (!name) return null;
      if (expectedName && name !== expectedName) return null;
      const combo = getFoodCombo();
      const strength = readStat("Siła");
      const intelligence = readStat("Inteligencja");
      if (!combo || !strength || strength.value == null) return null;
      if (!intelligence || intelligence.value == null) return null;
      return { name, combo, strength, intelligence };
    }, "Waiting for the dragon page", 20);

  const openDragon = async (href) => {
    const link = getVisibleElements(`a[href="${href}"]`).find((element) =>
      linkLabel(element),
    );
    const expectedName = linkLabel(link);
    if (location.pathname !== href) {
      if (!link) return null;
      link.click();
      const arrived = await waitForPath(
        (path) => path === href,
        "Waiting to open the dragon",
      );
      if (!arrived) return null;
    }
    return waitForDragonPage(href, expectedName);
  };

  const selectFood = async () => {
    const combo = getFoodCombo();
    if (!combo) return false;
    if (selectedFoodName(combo) === CONFIG.foodName) return true;

    combo.click();
    const option = await retry(
      () =>
        getVisibleElements('[role="option"]').find((element) =>
          [...element.querySelectorAll("span")].some(
            (span) => normalizeText(span.textContent) === CONFIG.foodName,
          ),
        ) || null,
      `Waiting for ${CONFIG.foodName}`,
      12,
    );
    if (!option) return false;
    option.click();

    const selected = await retry(() => {
      const current = getFoodCombo();
      return current && selectedFoodName(current) === CONFIG.foodName
        ? current
        : null;
    }, "Waiting for the food selection");
    return Boolean(selected);
  };

  const chooseOffense = (strength, intelligence) => {
    if (intelligence.value > strength.value) {
      return { stat: "Inteligencja", value: intelligence.value };
    }
    return { stat: "Siła", value: strength.value };
  };

  try {
    let hrefs = getDragonHrefs();
    if (!hrefs.length) {
      const dragonsLink = getVisibleElements('a[href="/dragons"]').find((link) =>
        link.textContent.includes("Smoki"),
      );
      if (dragonsLink) dragonsLink.click();
      await waitForPath((path) => path === "/dragons", "Waiting for the dragon list");
      hrefs = await retry(() => {
        const found = getDragonHrefs();
        return found.length ? found : null;
      }, "Waiting for dragons", 20);
    }

    if (!hrefs?.length) return;

    for (const href of hrefs) {
      const page = await openDragon(href);
      if (!page) continue;

      const selected = await selectFood();
      if (!selected) continue;

      const form = getFoodCombo()?.closest("form");
      const nakarm = form
        ? [...form.querySelectorAll("button")].find(
          (button) =>
            normalizeText(button.textContent) === "Nakarm" &&
            isVisible(button) &&
            !button.disabled,
        )
        : null;
      if (!nakarm) continue;

      const before = chooseOffense(page.strength, page.intelligence);
      nakarm.click();

      const trained = await retry(() => {
        const current = readStat(before.stat);
        if (!current?.plus || current.plus.disabled) return null;
        return current;
      }, `Waiting for ${before.stat} +1`, 20);

      if (!trained) continue;

      const valueBefore = trained.value;
      trained.plus.click();
      await retry(() => {
        const current = readStat(before.stat);
        if (!current || current.value == null) return null;
        if (current.value > valueBefore) return current;
        return null;
      }, `Waiting for ${before.stat} to increase`);

      await wait(getDelay(0));
    }
  } catch (error) {
    console.error("Error in feed dragons handler:", error);
  } finally {
    window.__mistHelperFeeding = false;
  }
})();
