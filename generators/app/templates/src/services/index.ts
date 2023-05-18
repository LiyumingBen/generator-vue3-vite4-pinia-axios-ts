//http.ts
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import qs from 'qs'
import 'element-plus/es/components/message/style/css'

const contentType = {
  json: 'application/json; charset=utf-8',
  urlEncode: 'application/x-www-form-urlencoded; charset=UTF-8',
}

// 取消重复请求
const pending: any[] = [] //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const cancelToken = axios.CancelToken
const removePending = (config: AxiosRequestConfig) => {
  const index = pending.findIndex(item => {
    return (
      item.url === config.url &&
      item.method === config.method &&
      JSON.stringify(item.params) === JSON.stringify(config.params) &&
      JSON.stringify(item.data) === JSON.stringify(config.data)
    )
  })
  if (index > -1) {
    pending[index].cancel()
    pending.splice(index, 1)
  }
}

// 设置请求头和请求路径
axios.defaults.baseURL = '/api'
axios.defaults.timeout = 10 * 60 * 1000
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8'
axios.defaults.headers.common = {
  bdc_source: 'mgmt', // 后端日志统计
}

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = window.sessionStorage.getItem('token')
    if (token && config?.headers) {
      // ts-ignore
      config.headers.token = token
    }

    // removePending(config) //在一个请求发送前执行一下取消操作
    config.cancelToken = new cancelToken(c => {
      pending.push({
        url: config.url,
        method: config.method,
        params: config.params,
        data: config.data,
        cancel: c,
      })
    })

    return config
  },
  error => {
    return error
  }
)
// 响应拦截
axios.interceptors.response.use(
  (res: AxiosResponse): any => {
    removePending(res.config) //在一个请求响应后再执行一下取消操作，把已经完成的请求从pending中移除

    const { data } = res || {}
    const { code } = data || {}

    switch (code) {
      case 200:
        break
      case 304:
        break
      case 401:
      case 404:
        break
      case undefined:
        break
      default:
        break
    }

    return Promise.resolve(res)
  },
  error => {
    ElMessage.error({
      message: '网络异常，请稍后重试~',
    })

    return Promise.reject(error)
  }
)

interface ResType<T> {
  code: number
  data?: T
  msg?: string
  err?: string
}
interface Http {
  get<T>(url: string, params?: unknown, config?: any): Promise<ResType<T>>
  post<T>(url: string, params?: unknown, config?: any): Promise<ResType<T>>
  upload<T>(url: string, params: unknown): Promise<ResType<T>>
  download(url: string): void
}

const http: Http = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get(url: string, params: any, config?: any) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, { params })
        .then(res => {
          resolve(res?.data)
        })
        .catch(err => {
          reject(err?.data)
        })
    })
  },
  post(url: string, params: any, config?: any) {
    return new Promise((resolve, reject) => {
      const { type } = config || {}
      type stringKey = Record<string, any>
      const obj: stringKey = contentType
      if (type === 'urlEncode') {
        axios.defaults.headers.post['Content-Type'] = obj[type]
        params = qs.stringify(params)
      }

      axios
        .post(url, params)
        .then(res => {
          resolve(res?.data)
        })
        .catch(err => {
          reject(err?.data)
        })
    })
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  upload(url: string, file: any, config?: any) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, file, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(res => {
          resolve(res?.data)
        })
        .catch(err => {
          reject(err?.data)
        })
    })
  },
  download(url) {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = url
    iframe.onload = function () {
      document.body.removeChild(iframe)
    }
    document.body.appendChild(iframe)
  },
}
export default http
