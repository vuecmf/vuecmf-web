// +----------------------------------------------------------------------
// | Copyright (c) 2019~2024 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf.com <tulihua2004@126.com>
// +----------------------------------------------------------------------

import { defineStore } from 'pinia'
import type {AnyObject} from "@/typings/vuecmf";

export const useStore = defineStore('storeId', {
  state: () => {
    return {
      nav_menu_list: [] as AnyObject, //系统导航菜单列表
      api_maps: [] as AnyObject, //后端API映射列表
    }
  },
  getters: {
    navMenuList: (state) => {
      return state.nav_menu_list
    },
    apiMaps: (state) => {
      return state.api_maps
    },
    getActionTypeByTableName: (state) => (table_name:string):string[] => {
      let action_type:string[] = []

      if(typeof table_name != 'undefined' && typeof state.api_maps[table_name] != 'undefined'){
        action_type = Object.keys(state.api_maps[table_name])
      }

      return action_type
    }
  },
  actions: {
    setNavMenuList(menuList: []){
      this.nav_menu_list = menuList
    },
    setApiMaps(apiMaps: []){
      this.api_maps = apiMaps
    },
  },
})

