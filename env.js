const isDev = process.env.NODE_ENV === 'development'
const env = {
  isDev,
  proxy: isDev ? 'http://127.0.0.1:1080' : undefined, // 设置本地翻墙代理
  apiTTL: 10 * 60, // 接口缓存时长，单位为秒
}

export default env