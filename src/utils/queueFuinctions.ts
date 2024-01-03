import puppeteer, { errors, Page } from "puppeteer";

export const browserPageInit = async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage();
    return page
}

export const isHeader = async (page: Page) => {
    return await page.evaluate(async () => {
        try {
            const firstshadowRoot = document.querySelector('body')?.firstElementChild?.shadowRoot
            const mastercontainer = firstshadowRoot?.firstElementChild?.firstElementChild?.querySelector('sn-canvas-appshell-layout')?.querySelector('sn-polaris-layout')?.shadowRoot?.firstElementChild?.nextElementSibling
            const headerBar = mastercontainer?.firstElementChild?.nextElementSibling?.firstElementChild
            return !!headerBar
        } catch (error) {
            console.error("Error: ", error)
            return false
        }
    });
} 