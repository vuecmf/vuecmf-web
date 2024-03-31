// +----------------------------------------------------------------------
// | Copyright (c) 2019~2024 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf.com <tulihua2004@126.com>
// +----------------------------------------------------------------------

import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import type {RouteRecordRaw} from 'vue-router'
import { useStore } from '@/stores';
import LayoutService from "@/service/LayoutService"
import { ElMessage } from 'element-plus'


const service = new LayoutService()

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Layout.vue'),
    redirect: 'welcome',
    children: [
      {
        path: 'welcome',
        component: () => import('@/views/Welcome.vue'),
        name: 'welcome',
        meta: { breadcrumb_list: ['欢迎页'], title: 'welcome! - Powered by www.vuecmf.com', icon: 'welcome', noCache: true,topId:0, id:0, token:'123'}
      },
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
    name: 'login',
    meta: { title: '登录系统 - Powered by www.vuecmf.com', icon: 'welcome', noCache: true,topId:0, id:0}
  },
  {
    path:'/refresh',
    component: () => import('@/views/Refresh.vue'),
  },
]

/**
 * 创建路由
 */
const router = createRouter({
  history: import.meta.env.MODE === 'production' ? createWebHistory(import.meta.env.BASE_URL) : createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

/**
 * 进入路由前
 */
router.beforeEach( (to,from, next) => {
  const token = localStorage.getItem('vuecmf_token')
  const store = useStore()
  if(to.name == 'login'){
    next()
  }else{
    if(token == '' || token == null){
      ElMessage.error('还没有登录或登录超时,请先登录！')
      next({name:'login'});
    }else if(to.name !== 'welcome' && store.nav_menu_list.length == 0){
      service.loadMenu().then((res:string|void)=> {
        res === 'router loaded' ? next({ path: to.path, query: to.query }) : next()
      })
    }else{
      next()
    }
  }

})


export default router
