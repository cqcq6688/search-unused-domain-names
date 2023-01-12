import Web3 from 'web3'
import tunnel from 'tunnel'

const network = process.env.ETHEREUM_NETWORK;
const rpcUrl = `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`;

const options = {
  keepAlive: true,
  timeout: 20000,
  agent: {
      https: tunnel.httpsOverHttp({
          proxy: {
              host: process.env.PROXY_HOST,
              port: process.env.PROXY_PORT
          }
      })
  }
}

const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl, options))

async function search (name) {
  if (!name) {
    return false
  }
  const domain = `${name}.eth`.toLowerCase()
  const start = Date.now()
  console.log('开始获取地址：', domain)
  const address = await web3.eth.ens.recordExists(domain);
  console.log('完成获取地址：', domain, address, `用时：${Date.now() - start}ms`)
  return address
}

export default search