import type { ProxyOptions } from 'vite'

export interface IProxyItem {
  prefix: string
  target: string
}

type ProxyTargetList = Record<string, ProxyOptions & { rewrite: (path: string) => string }>

const httpsRE = /^https:\/\//

/**
 * Generate proxy
 * @param list
 */
export function createProxy(list: IProxyItem[]) {
  const rst: ProxyTargetList = {}

  for (const { prefix, target } of list) {
    const isHttps = httpsRE.test(target)

    rst[prefix] = {
      target: target,
      changeOrigin: true,
      ws: true,
      rewrite: path => path.replace(new RegExp(`^${prefix}`), ''),
      // https is require secure=false
      ...(isHttps ? { secure: false } : {}),
    }
  }

  return rst
}
