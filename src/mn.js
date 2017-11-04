const puppeteer = require('puppeteer')
// const {screenshot} = require('./config/default')
const { mn, webUrl, searchInputSelector, searchKey, searchSubmitSelector, imgSelector } = require('./config/default')
const srcToImg = require('./helper/srcToImg')

puppeteer.launch().then(async (browser) => {
    const page = await browser.newPage()
    // 昵图网  我发现百度的src是http的时候  好像反爬虫了 就没用百度了
    await page.goto(webUrl)
    console.log(`go to ${webUrl}` )
    // 把浏览器窗口改的特别大 这样就可以少触发懒加载
    await page.setViewport({
        width: 1000,
        height: 600
    })
    console.log('reset viewport');

    // 焦点在搜索框
    await page.focus(searchInputSelector)

    // 输入字符
    await page.keyboard.sendCharacter(searchKey)
    // 触发点击
    await page.click(searchSubmitSelector)
    console.log('go to search list')
    // 等待网页加载完成
    page.on('load', async () => {
        console.log('page loading done, start fetching');
        const srcs = await page.evaluate(async () => {
            const images = document.querySelectorAll('.search-works-thumb img')
            return Array.prototype.map.call(images, img => img.src)
        })
        console.log(`get ${srcs.length} images, start download`)
        // 保存图片也是异步的
        srcs.forEach(async (src, index) => {
            // sleep 稍微低频调用
            await page.waitFor(200)
            await srcToImg(src, mn)
        })
        await browser.close()
    })



})