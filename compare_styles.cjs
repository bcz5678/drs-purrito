const { chromium } = require('playwright');

async function getStyles(url, name) {
  console.log(`Starting browser for ${name}...`);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 1800 });
  
  console.log(`Navigating to ${url}...`);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) {
    console.error(`Failed to load ${url}: ${e.message}`);
    await browser.close();
    return null;
  }

  // Wait a bit for everything to settle
  await page.waitForTimeout(5000);

  // Scroll to ensure topping cards are loaded
  await page.evaluate(async () => {
    window.scrollBy(0, 1000);
    await new Promise(r => setTimeout(r, 2000));
    window.scrollBy(0, 500);
    await new Promise(r => setTimeout(r, 2000));
  });

  const data = await page.evaluate(() => {
    const getComp = (el) => {
      if (!el) return null;
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        tagName: el.tagName,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        fontFamily: style.fontFamily,
        color: style.color,
        backgroundColor: style.backgroundColor,
        padding: style.padding,
        margin: style.margin,
        borderRadius: style.borderRadius,
        border: style.border,
        boxShadow: style.boxShadow,
        width: rect.width,
        height: rect.height,
        text: el.innerText.split('\n')[0].trim().substring(0, 30)
      };
    };

    // Container width - look for the main content wrapper
    const main = document.querySelector('main');
    const container = document.querySelector('.container, [class*="container"], [class*="wrapper"]') || main;

    // Headers
    const h1 = document.querySelector('h1');
    const h2 = document.querySelector('h2');
    
    // Cards - Chipotle cards usually have text like "Chicken", "Steak"
    // Look for elements that look like cards
    const allElements = Array.from(document.querySelectorAll('*'));
    const cards = allElements.filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 150 && rect.width < 400 && rect.height > 100 && rect.height < 400 && el.innerText.length > 0 && el.innerText.length < 100;
    }).slice(0, 3);

    return {
      container: getComp(container),
      h1: getComp(h1),
      h2: getComp(h2),
      cards: cards.map(getComp)
    };
  });

  await browser.close();
  return data;
}

(async () => {
  const original = await getStyles('https://www.chipotle.com/order/build/burrito?restaurant=4722', 'Original');
  const local = await getStyles('http://localhost:8080/order/build/burrito', 'Local'); // Adjusting local path if needed
  
  process.stdout.write(JSON.stringify({ original, local }, null, 2));
})();
