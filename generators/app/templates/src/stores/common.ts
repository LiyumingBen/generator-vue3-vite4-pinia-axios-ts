/*
 * @Author: LYM
 * @Date: 2023-05-17 16:27:48
 * @LastEditors: LYM
 * @LastEditTime: 2023-05-17 16:51:38
 * @Description: Please set Description
 */
import { defineStore } from 'pinia'
import type { IStoreCommon } from './types'

export const useCommonStore = defineStore({
  id: 'common',
  state: (): IStoreCommon => ({
    name: ''
  }),
  getters: {},
  actions: {},
  persist: [
    {
      paths: ['name'], // paths 指定要持久化的字段，其他的则不会进行持久化
      storage: localStorage, // 选择存储方式  默认保存在sessionStorage  可选localStorage或sessionStorage
    },
  ],
})
