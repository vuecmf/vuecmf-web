// +----------------------------------------------------------------------
// | Copyright (c) 2019~2024 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf.com <tulihua2004@126.com>
// +----------------------------------------------------------------------

import BaseEvent from "@/service/event/BaseEvent";
import type {AnyObject} from "@/typings/vuecmf";
import {ElMessage} from "element-plus/es";
import { useStore } from '@/stores';


/**
 * 角色事件服务类
 */
export default class RolesEvent extends BaseEvent{

    current_role: AnyObject //当前选择的角色信息

    public store

    constructor(dataService: AnyObject,dataModel: AnyObject) {
        super(dataService, dataModel);
        this.store = useStore()
        //表格事件配置
        this.table_event.tool_event = []

        //表格行事件配置
        this.table_event.row_event = [
            { label: '添加子角色', type:'primary', event: this.addSub, visible: true },
            { label: '设置权限', type:'success', event: this.setRolePermission, visible: true },
            { label: '设置用户', type:'success', event: this.setUsers, visible: true },
        ]

        this.current_role = {}

        //表格行事件权限控制
        const action_type_list = this.store.getActionTypeByTableName('roles')
        this.table_event.row_event.forEach((item: AnyObject) => {
            if(item.label == '添加子角色'){
                item.visible = action_type_list.indexOf('save') != -1
            }else if(item.label == '设置权限'){
                item.visible = action_type_list.indexOf('add_permission') != -1
            }else if(item.label == '设置用户'){
                item.visible = action_type_list.indexOf('assign_users') != -1
            }
        })

    }

    /**
     * 添加子角色
     * @param selectRow
     * @param tableService
     */
    addSub = (selectRow:AnyObject, tableService: AnyObject): void => {
        tableService.addRow()
        tableService.loadDataService.loadTableField()
        tableService.table_config.current_select_row.pid = selectRow.id
    }

    /**
     * 打开设置权限对话框
     * @param selectRow
     */
    setRolePermission = (selectRow:AnyObject):void => {
        this.current_role = selectRow
        this.dataService.permission_config.current_user_or_role = this.current_role.role_name
        let login_data = {}

        if(this.current_role.pid > 0) {
            login_data = {role_name: this.current_role.role_name}
        }else if(this.current_role.pid == 0 && this.loginUserInfo != false && this.loginUserInfo['role'] != '超级管理员'){
            login_data = {username: this.loginUserInfo['username']}
        }

        this.setPermission({role_name: this.current_role.role_name}, login_data)
    }

    /**
     * 保存角色权限项
     */
    saveRolePermission = ():false => {
        this.savePermission({role_name: this.current_role.role_name})
        return false
    }


    /**
     * 打开设置用户对话框
     * @param selectRow
     */
    setUsers = (selectRow:AnyObject): void => {
        this.current_role = selectRow
        this.dataService.assign_config.assigned_data = []
        this.dataService.assign_config.assign_dlg_title = '设置(' + this.current_role.role_name + ')用户'
        const username = this.loginUserInfo != false ? this.loginUserInfo['username'] : '';

        this.dataModel.getAllUsers(this.table_name,{username: username}).then((res:AnyObject) => {
            if(res.status == 200 && res.data.code == 0){
                res.data.data.forEach((item:AnyObject) => {
                    item.disabled = false
                })

                this.dataService.assign_config.all_data = res.data.data

                //获取已分配用户
                this.dataModel.getAssignUsers(this.table_name, {role_name: this.current_role.role_name}).then((res2:AnyObject) => {
                    if(res2.status == 200 && res2.data.code == 0){
                        this.dataService.assign_config.assigned_data = res2.data.data
                        this.dataService.assign_config.set_assign_dlg = true
                    }else{
                        ElMessage.error(res2.data.msg)
                    }
                })

            }else{
                ElMessage.error(res.data.msg)
            }
        })


    }

    /**
     * 保存角色已分配的用户
     */
    saveAssignUsers = (): false => {
        this.dataModel.saveAssignUsers(this.table_name, {
            role_name: this.current_role.role_name,
            userid_list: this.dataService.assign_config.assigned_data
        }).then((res:AnyObject) => {
            if(res.status == 200 && res.data.code == 0){
                ElMessage.success(res.data.msg)
                this.dataService.assign_config.set_assign_dlg = false
            }else{
                ElMessage.error(res.data.msg)
            }
        })

        return false
    }




}
