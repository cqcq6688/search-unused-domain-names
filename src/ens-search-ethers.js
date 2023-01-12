import { ethers } from 'ethers'
// 使用主网
const network = process.env.ETHEREUM_NETWORK;

const provider = new ethers.providers.InfuraProvider(
  network,
  process.env.INFURA_API_KEY
);

async function search (name) {
  if (!name) {
    return false
  }
  const domain = `${name}.eth`.toLowerCase()
  const start = Date.now()
  console.log('开始获取地址：', domain)
  const address = await provider.resolveName(domain);
  console.log('完成获取地址：', domain, address, `用时：${Date.now() - start}ms`)
  return address
}

export default search