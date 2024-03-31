// +----------------------------------------------------------------------
// | Copyright (c) 2019~2024 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf.com <tulihua2004@126.com>
// +----------------------------------------------------------------------


import BaseEvent from "@/service/event/BaseEvent";
import type {AnyObject} from "@/typings/vuecmf";
import { useStore } from '@/stores';


/**
 * 菜单事件服务类
 */
export default class MenuEvent extends BaseEvent{

    public store

    constructor() {
        super({}, {});
        this.store = useStore()
        const action_type_list = this.store.getActionTypeByTableName('menu')

        //若是内置类型不显示编辑按钮
        this.editBtnVisible = (row: AnyObject): boolean => {
            if(row.type == 10){
                return false
            }else{
                return action_type_list.indexOf('save') != -1
            }
        }

        //若是内置类型不显示删除按钮
        this.delBtnVisible = (row: AnyObject): boolean => {
            if(row.type == 10){
                return false
            }else{
                return action_type_list.indexOf('delete') != -1
            }
        }

        //表格事件配置
        this.table_event.tool_event = []


        //表格行事件权限控制
        if(typeof this.table_event.row_event != 'undefined'){
            this.table_event.row_event[0].visible = action_type_list.indexOf('save') != -1
        }


    }

}
