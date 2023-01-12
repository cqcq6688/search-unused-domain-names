import db from './db.js'
import ensSearch from './src/ens-search-web3.js'

async function main () {
  const names = Object.keys(db.data.names).filter(key => {
    return db.data.names[key]['.eth'] == undefined
  })
  // const names = [
  //   'ricmoo',
  //   'fabrice11',
  //   'faye (fay)'
  // ]
  const start = Date.now()
  const notExist = []
  console.log(`START:`, names.slice(0,50).toString(), `...${names.length}`)
  for (let item of names) {
    console.log('---------------------------------------------')
    try {
      const result = await ensSearch(item)
      if (!result) {
        notExist.push(item)
      }
      db.data.names[item]['.eth'] = result
      db.write()
    } catch(e) {
      console.log('出现错误', e)
    }
  }
  console.log('---------------------------------------------')
  console.log(`FINISHED, 共用时：${Date.now() - start}ms`)
  console.log('NotExist', notExist)
}

main()