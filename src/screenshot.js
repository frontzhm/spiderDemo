const puppeteer = require('puppeteer')
// const {screenshot} = require('./config/default')
const {mn} = require('./config/default')
const srcToImg = require('./helper/srcToImg')

puppeteer.launch().then(async (browser) => {
    const page = await browser.newPage()
    await page.goto('http://image.baidu.com')
    console.log('go to http://image.baidu.com')
    // 把浏览器窗口改的特别大 这样就可以少触发懒加载
    await page.setViewport({
        width: 1920,
        height: 1080
    })
    console.log('reset viewport');
    
    // 焦点在搜索框
    await page.focus('#kw')
    // 输入字符
    await page.keyboard.sendCharacter('狗')
    // 触发点击
    await page.click('.s_btn')
    console.log('go to search list')
    // 等待网页加载完成
    page.on('load', ()=>{
        console.log('page loading done, start fetching');
        const srcs = page.evaluate(async () => {
            const images = document.querySelectorAll('img.main_img')
            return Array.prototype.map.call(images,img=>{
                img.src
            })
        })
        console.log(`get ${srcs.length} images, start download`)
        
        srcs.forEach(src=>{
            srcToImg(src,mn)
        })
        await browser.close()
    })

    
    
})