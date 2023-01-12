/* eslint-disable prettier/prettier */
import superagent from 'superagent'
// import superagentProxy from 'superagent-proxy'
import db from '../db.js'
import * as cheerio from 'cheerio'

// superagentProxy(superagent)
// const proxy = process.env.PROXY_DOMAIN

const DEBUG = true
// const DEBUG = false

// const words = 'h' // en-name.xiao84.com存在bug，g和h开头的名字有异常，不存在g开头的站点
const words = DEBUG ? 'z' : 'abcdefgijklmnopqrstuvwxyz'
const seedList = words.split('').map(item => `https://en-name.xiao84.com/names/fl_${item}.html`)
const startTime = Date.now()

const spider = async (url) => {
    const start = Date.now()
    console.log(`--------------------------------------------------------`) 
    console.log(`开始抓取页面：${url},已用时:${Date.now() - startTime}ms`)

    try {
        // 1. 抓取网页
        const res = await superagent.get(url)
        // superagent.get(`https://google.com`)
        // .proxy(proxy)
        // 2. 解析内容
        console.log(`页面获取成功：${url},当前用时:${Date.now() - start}ms`)
        console.log(`开始解析数据：${url},当前用时:${Date.now() - start}ms`)

        const $ = cheerio.load(res.text, { decodeEntites: false })
        const $table = $('.c_body_in table')
        const $list = $table.find('tbody tr')
        $list.each((idx) => {
            if (DEBUG && idx >= 3) { return }
            const $item = $list.eq(idx)
            const $name = $item.find('a')
            if (!$name.length) {
                return
            }
            const genders = {
                '♀': 'female',
                '♂': 'male',
                '⚥': 'neuter'
            }
            const itemData = {
                name: '',
                gender: '',
                cName: '',
                meaning: '',
                stars: '',
                href: ''
            }
            itemData.gender = genders[$name.text().slice(0,1)] || ''
            itemData.name = $name.text().slice(1) || ''
            itemData.cName = $item.find('td').eq(1).text() || ''
            itemData.meaning = $item.find('td').eq(2).text() || ''
            itemData.stars = $item.find('td .stars').attr('class').replace('stars ', '') || ''
            itemData.href = $name.attr('href') || ''

            db.saveName(itemData)
        })

        await db.write()
        console.log(`完成解析数据：${url},当前用时:${Date.now() - start}ms`)
        
        // 下一页
        const nextPage = $('.n-pages .next').attr('href')
        if (nextPage) {
            await spider(`https://en-name.xiao84.com/names/${nextPage}`)
        }
    } catch(err) {
        console.log(`抓取失败：${url},当前用时:${Date.now() - start}ms`)
        console.log(err)
    }
}


const main = async function () {
    console.log('开始名称爬取，种子数据：', seedList)
    const total = db.data.details.length
    console.log(`当前数据:${total}条`)
    
    for (let url of seedList) {
        await spider(url)
    }

    const endTime = Date.now()
    console.log(`--------------------------------------------------------`) 
    console.log(`完成名称爬取，共用时:${endTime - startTime}ms`)
    console.log(`新增数据:${db.data.details.length - total}条`)
}

main()