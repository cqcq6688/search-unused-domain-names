import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// File path
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'data.json')

// Configure lowdb to write to JSONFile
const adapter = new JSONFile(file)
const db = new Low(adapter)

// Read data from JSON file, this will set db.data content
await db.read()

const initData = { 
  names: {},
  details: []
}

function initDbData (data) {
  for(let key in initData) {
    if (!data[key]) {
      data[key] = initData[key]
    }
  }
}

// nameData = {
//   name: '',
//   gender: '',
//   cName: '',
//   meaning: '',
//   stars: '',
//   href: ''
// }
db.saveName = function (nameData) {
  // console.log('开始写入数据', nameData)
  if (!nameData || !nameData.name) {
    return false
  }
  
  initDbData(db.data)

  // console.log('开始写入数据2', db.data)

  if (!db.data.names[nameData.name]) {
    db.data.names[nameData.name] = {}
  }
  const nameItem = db.data.details.find(item => item.name === nameData.name)
  if (nameItem) {
    for(let key in nameData) {
      nameItem[key] = nameData[key]
    }
  } else {
    db.data.details.push(nameData)
  }
}

export default db