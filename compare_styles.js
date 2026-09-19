const { chromium } = require('playwright');

async function getStyles(url, name) {
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

  // Scroll to ensure everything is loaded
  await page.evaluate(async () => {
    window.scrollBy(0, 1000);
    await new Promise(r => setTimeout(r, 2000));
    window.scrollBy(0, 1000);
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
        text: el.innerText.split('\n')[0].trim()
      };
    };

    // Main Container
    const mainContainer = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;
    
    // Hero Heading
    const heroHeading = document.querySelector('h1');
    
    // Section Header
    const sectionHeader = document.querySelector('h2');
    
    // Selection Cards (Topping/Ingredient cards)
    // Chipotle uses a specific structure. Let's try to find them.
    // Usually they are buttons or divs with specific classes.
    const cards = Array.from(document.querySelectorAll('[data-testid*="ingredient"], [class*="card"], [class*="Item"]'))
      .filter(el => el.getBoundingClientRect().width > 100)
      .slice(0, 5); // Get a few to compare

    return {
      container: getComp(mainContainer),
      hero: getComp(heroHeading),
      section: getComp(sectionHeader),
      cards: cards.map(getComp)
    };
  });

  await browser.close();
  return data;
}

(async () => {
  const original = await getStyles('https://www.chipotle.com/order/build/burrito?restaurant=4722', 'Original');
  const local = await getStyles('http://localhost:8080', 'Local');
  
  console.log(JSON.stringify({ original, local }, null, 2));
})();
