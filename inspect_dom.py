import asyncio, json
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 2400})
        await page.goto('https://webcloud-corporation.vercel.app/en/journal/why-i-dont-use-templates', wait_until='networkidle')
        await page.wait_for_timeout(2000)

        res = await page.evaluate('''() => {
            const img = document.querySelector('main img');
            if (!img) return { error: 'No img in main' };
            const rect = img.getBoundingClientRect();
            const computed = window.getComputedStyle(img);
            const reveal = img.closest('[data-reveal]');
            const rComputed = reveal ? window.getComputedStyle(reveal) : null;
            const parent = img.parentElement;
            const pComputed = parent ? window.getComputedStyle(parent) : null;

            return {
                src: img.src,
                currentSrc: img.currentSrc,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
                imgComputed: {
                    display: computed.display,
                    visibility: computed.visibility,
                    opacity: computed.opacity,
                    clipPath: computed.clipPath,
                    transform: computed.transform
                },
                revealComputed: rComputed ? {
                    opacity: rComputed.opacity,
                    clipPath: rComputed.clipPath,
                    visibility: rComputed.visibility,
                    transform: rComputed.transform
                } : null,
                parentComputed: pComputed ? {
                    opacity: pComputed.opacity,
                    clipPath: pComputed.clipPath,
                    overflow: pComputed.overflow
                } : null
            };
        }''')
        print(json.dumps(res, indent=2))
        await browser.close()

asyncio.run(main())
