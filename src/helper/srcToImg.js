const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const writeFile = promisify(fs.writeFile)

module.exports = async (src, dir) => {

    if (/\.(jpg|png|gif)$/.test(src)) {
        console.log(src)
        await urlToImg(src, dir)
    } else {
        await base64ToImg(src, dir)
    }
}

// url=>image
const urlToImg = promisify((url, dir, callback) => {
    const mod = /^https/.test(url) ? https : http
    const ext = path.extname(url)
    const file = path.join(dir, `${Date.now()}${ext}`)
    mod.get(url, res => {
        res.pipe(fs.createWriteStream(file))
            .on('finish', () => {
                callback()
            })
    })
})
// base64=>image
const base64ToImg = async (base64, dir, callback) => {

    // data:image/jpeg;base64,/fdsafdsa
    const matches = base64.match(/^data:(.+?);base64,(.+)/)
    try {
        // 拿到分号后面的
        const ext = matches[1].split('/')[1]
        .replace('jpeg', 'jpg')
        const file = path.join(dir, `${Date.now()}.${ext}`)
        const content = matches[2]
        console.log(ext)
        console.log(content)
        await writeFile(file, content, 'base64')
        console.log(file)
    } catch (error) {
        console.log(error)
        console.log('非法 base64字符串 ')

    }
}