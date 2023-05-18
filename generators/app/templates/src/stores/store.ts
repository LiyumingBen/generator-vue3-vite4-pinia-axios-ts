/*
 * @Author: LYM
 * @Date: 2023-05-17 16:26:35
 * @LastEditors: LYM
 * @LastEditTime: 2023-05-17 16:26:35
 * @Description: Please set Description
 */
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
