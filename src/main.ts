// +----------------------------------------------------------------------
// | Copyright (c) 2019~2024 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf.com <tulihua2004@126.com>
// +----------------------------------------------------------------------

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
/*导入vuecmf editor、vuecmf dialog和vuecmf table组件*/
import VuecmfEditor from 'vue-vuecmf-editor'
import VuecmfDialog from 'vue-vuecmf-dialog'
import VuecmfTable from "vue3-vuecmf-table"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VuecmfDialog)
app.use(VuecmfEditor)
app.use(VuecmfTable)

app.mount('#app')

//注册全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
