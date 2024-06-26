// +----------------------------------------------------------------------
// | Copyright (c) 2019~2024 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf.com <tulihua2004@126.com>
// +----------------------------------------------------------------------

import {reactive, ref} from "vue";
import router from "@/router";
import type {AnyObject} from "@/typings/vuecmf";
import {ElMessage} from "element-plus/es";
import { useStore } from '@/stores';
import LoginService from "@/service/LoginService";

/**
 * 事件服务基类
 */
export default abstract class BaseEvent{
    default_expand_all: boolean                             //树形列表默认是否全部展开
    action_type_list: string[]                              //动作权限列表
    add_btn_visible: boolean                                //列表中是否显示新增按钮
    current_model_config = ref()                            //当前模型配置信息
    table_name: string                                      //当前模型表名
    dataService: AnyObject                                  //服务类实例
    dataModel: AnyObject                                    //数据模型实例

    loginUserInfo: AnyObject|false //登录用户信息

    //表格事件配置
    table_event = reactive({
        tool_event: ref(),      //表格头部左边操作按钮
        row_event: ref(),       //表格行操作按钮
        fields_event: ref()     //表格字段事件处理
    })

    //弹窗中表格事件配置
    dialog_table_event = reactive({
        tool_event: ref(),      //表格头部左边操作按钮
        row_event: ref(),       //表格行操作按钮
        fields_event: ref()     //表格字段事件处理
    })

    public store

    protected constructor(dataService: AnyObject, dataModel: AnyObject) {
        this.store = useStore()
        this.dataService = dataService
        this.dataModel = dataModel
        this.table_name = router.currentRoute.value.meta.table_name as string
        this.action_type_list = this.store.getActionTypeByTableName(this.table_name)
        this.default_expand_all = true
        this.add_btn_visible = this.action_type_list.indexOf('save') != -1

        const loginService = new LoginService()
        this.loginUserInfo = loginService.getLoginUser()

        if(router.currentRoute.value.meta.is_tree == 10 && this.add_btn_visible){
            //表格行事件配置
            this.table_event.row_event = [
                { label: '添加子项', type:'primary', event: this.addSub, visible: true },
            ]
        }

    }

    /**
     * 列表中每行是否显示详情按钮
     * @param row
     */
    detailBtnVisible = (row:AnyObject):boolean => {
        //console.log(row)
        return true
    }

    /**
     * 列表中每行是否显示编辑按钮
     * @param row
     */
    editBtnVisible = (row:AnyObject):boolean => {
        //console.log(row)
        return this.action_type_list.indexOf('save') != -1
    }


    /**
     * 列表中每行是否显示删除按钮
     * @param row
     */
    delBtnVisible = (row:AnyObject):boolean => {
        //console.log(row)
        return this.action_type_list.indexOf('delete') != -1
    }


    /**
     * 列表中状态列的开关是否可用
     * @param row
     */
    statusDisabled = (row:AnyObject): boolean => {
        if(typeof this.table_name != 'undefined' && ['menu','model_config'].indexOf(this.table_name as string) != -1 && row.type == 10){
            return true
        }else{
            return this.action_type_list.indexOf('save') == -1
        }
    }


    /**
     * 添加子项
     * @param selectRow
     * @param tableService
     */
    addSub = (selectRow:AnyObject, tableService: AnyObject): void => {
        tableService.addRow()
        tableService.loadDataService.loadTableField()
        tableService.table_config.current_select_row.pid = selectRow.id
    }


    /**
     * 权限列表选择模型名称事件
     * @param value  bool 当前选择的值
     * @param model_name string 模型名称
     */
    modelNameCheckChange = (value: string, model_name: string):false => {
        if(typeof this.dataService.permission_config.checkedActionList[model_name] != 'undefined'){
            if(value){
                //若模型名称是选中状态
                const action_list: string[] = []
                if(typeof this.dataService.permission_config.permission_action_list[model_name] == 'object'){
                    Object.keys(this.dataService.permission_config.permission_action_list[model_name]).forEach((action_id) => {
                        action_list.push(action_id)
                    })
                }
                this.dataService.permission_config.checkedActionList[model_name] = action_list
            }else{
                this.dataService.permission_config.checkedActionList[model_name] = []
            }
        }

        return false
    }


    /**
     * 权限项选择事件
     * @param value array 当前选择的值
     * @param model_name string 模型名称
     */
    actionCheckChange = (value: string[], model_name: string):false => {
        if(typeof this.dataService.permission_config.checkedActionList == 'object' &&
            typeof this.dataService.permission_config.checkedActionList[model_name] != 'undefined'
        ){
            this.dataService.permission_config.checkedActionList[model_name] = value

            //计算当前模型的动作总数
            let action_list_num = 0
            Object.keys(this.dataService.permission_config.permission_action_list[model_name]).forEach(() => {
                action_list_num = action_list_num + 1
            })

            //当前模型选中的动作数量
            const checkedCount = value.length
            //若选择数量与总数相等，则勾选上当前模型名称
            this.dataService.permission_config.checkedModelNameList[model_name] = action_list_num === checkedCount
            //若有选择但没有全选中的话，则当前模型名称设置为半勾选状态
            if(typeof this.dataService.permission_config.modelNameIndeterminate != 'undefined'){
                this.dataService.permission_config.modelNameIndeterminate[model_name] = checkedCount > 0 && checkedCount < action_list_num
            }

        }

        return false
    }


    /**
     * 打开设置权限对话框
     * @param permission_param 获取已有权限的参数
     * @param login_data 当前登录用户信息
     * @param permission_type  权限类型 role = 角色， user = 用户
     */
    setPermission = (permission_param:AnyObject, login_data:AnyObject, permission_type = 'role'):void => {
        //获取所有权限列表
        this.dataModel.getActionList(this.table_name, login_data).then((res:AnyObject) => {
            if(res.status == 200 && res.data.code == 0){
                this.dataService.permission_config.permission_action_list = res.data.data

                if(typeof this.dataService.permission_config.permission_action_list != 'undefined'){
                    const modelNameList = [] as AnyObject
                    const checkedActionList = [] as AnyObject
                    const modelNameIndeterminate = [] as AnyObject

                    Object.keys(this.dataService.permission_config.permission_action_list).forEach((index) => {
                        modelNameList[index] = false
                        checkedActionList[index] = []
                        modelNameIndeterminate[index] = false
                    })

                    this.dataService.permission_config.checkedModelNameList = modelNameList
                    this.dataService.permission_config.checkedActionList = checkedActionList
                    this.dataService.permission_config.modelNameIndeterminate = modelNameIndeterminate

                    //获取角色的已有权限
                    this.dataModel.getPermission(this.table_name, permission_param, permission_type).then((res:AnyObject) => {
                        if(res.status == 200 && res.data.code == 0){

                            Object.keys(res.data.data).forEach((index) => {
                                checkedActionList[index] = res.data.data[index]
                                this.actionCheckChange(checkedActionList[index], index)
                            })

                            this.dataService.permission_config.checkedActionList = checkedActionList

                        }else{
                            ElMessage.error(res.data.msg)
                        }
                    })

                    this.dataService.permission_config.permission_dlg = true
                }else{
                    ElMessage.error('没有获取到权限项记录')
                }

            }else{
                ElMessage.error(res.data.msg)
            }

        })

    }

    /**
     * 保存权限项
     * @param permission_param 获取已有权限的参数
     * @param permission_type  权限类型 role = 角色， user = 用户
     */
    savePermission = (permission_param:AnyObject, permission_type = 'role'):false => {
        const action_arr: unknown[]  = []

        setTimeout(()=>{
            Object.values(this.dataService.permission_config.checkedActionList).forEach((item) => {
                if((item as Array<string>).length > 0) {
                    (item as Array<string>).forEach((val) => {
                        action_arr.push(val)
                    })
                }
            })

            permission_param['action_id'] = action_arr.join(',')

            this.dataModel.savePermission(this.table_name, permission_param, permission_type).then((res:AnyObject) => {
                if(res.status == 200 && res.data.code == 0){
                    ElMessage.success(res.data.msg)
                    this.dataService.permission_config.permission_dlg = false
                }else{
                    ElMessage.error(res.data.msg)
                }
            })
        }, 300)

        return false
    }

    /**
     * 初始化列表
     * @param dlg_ref            弹窗ref
     * @param dlg_config            弹窗配置对象
     * @param table_name            模型表名
     * @param selectRows            当前选择的行数据
     * @param export_file_name      导出文件名
     */
    initTable = (dlg_ref: AnyObject,
                 dlg_config: AnyObject,
                 table_name: string,
                 selectRows: AnyObject,
                 export_file_name: string,
    ):void => {

        this.dataService.dialog_config.current_table_name = table_name

        //列表按钮权限控制
        this.tablePermission(table_name, dlg_config)

        //设置行操作列宽度
        if(this.current_model_config.value.type == 10 &&
            ['model_index','model_action','field_option','model_relation','model_form_rules','model_form_linkage'].indexOf(table_name) != -1
        ){
            dlg_config.operate_width = 89
        }else{
            this.dataService.resizeVuecmfTable()
        }


        //设置当前选择的行数据, 供弹窗回调函数 dialogTableCallback 使用
        this.dataService.table_config.current_row = selectRows

        //设置列表后端相关接口地址
        dlg_config.server = this.dataModel.getApiUrl(table_name, 'list')
        dlg_config.del_server = this.dataModel.getApiUrl(table_name, 'delete')
        dlg_config.import_server = this.dataModel.getApiUrl(table_name, 'save_all')
        dlg_config.save_server = this.dataModel.getApiUrl(table_name, 'save')

        //列表导出文件名
        dlg_config.export_file_name = export_file_name + '(' + selectRows.label + ')'

        dlg_config.show_dlg = true

    }


    /**
     * 重置对话框中表格的高度
     * @param dlg_ref  对话框的 ref
     * @param dlg_config  对话框配置
     */
    resizeDlgTable = (dlg_ref: AnyObject, dlg_config: AnyObject):void => {
        const dlg_dom = dlg_ref.$refs.vuecmf_dlg_ref
        const dlg_header = dlg_dom.querySelector('.el-dialog__header')
        const dlg_body = dlg_dom.querySelector('.el-dialog__body')
        const table_header = dlg_body.querySelector('.el-row')
        dlg_config.table_height = (dlg_body.clientHeight - table_header.clientHeight - dlg_header.clientHeight - 27).toString()
    }

    /**
     * 重置对话框中表格的高度公共方法
     * @param dlg_ref  对话框的 ref
     * @param dlg_config  对话框配置
     */
    commonResizeDlgTable = (dlg_ref: AnyObject, dlg_config: AnyObject):void => {
        dlg_config.toggleScreen = () => {
            this.resizeDlgTable(dlg_ref, dlg_config)
            return null
        }
        this.resizeDlgTable(dlg_ref, dlg_config)
    }

    /**
     * 弹窗列表中按钮权限控制
     * @param table_name  模型表名
     * @param dlg_config  弹窗配置信息
     */
    tablePermission = (table_name: string, dlg_config: AnyObject):void => {
        const action_type_list = this.store.getActionTypeByTableName(table_name)

        //详情按钮功能
        dlg_config.detailBtnVisible = () => action_type_list.indexOf('list') != -1

        if(this.current_model_config.value.type == 10){
            //若模型是内置类型，则不允许新增、编辑和删除
            if(table_name == 'field_option'){
                dlg_config.add_btn_visible = action_type_list.indexOf('save') != -1
                dlg_config.editBtnVisible = (row: AnyObject): boolean => {
                    if(row.type == 10){
                        return false
                    }else{
                        return action_type_list.indexOf('save') != -1
                    }
                }

                dlg_config.delBtnVisible = (row: AnyObject): boolean => {
                    if(row.type == 10){
                        return false
                    }else{
                        return action_type_list.indexOf('save') != -1
                    }
                }

            }else{
                dlg_config.add_btn_visible = false
                dlg_config.editBtnVisible = () => false
                dlg_config.delBtnVisible = () => false
            }

        }else{
            //行新增和编辑功能权限控制
            dlg_config.add_btn_visible = action_type_list.indexOf('save') != -1
            dlg_config.editBtnVisible = () => action_type_list.indexOf('save') != -1

            //行删除功能权限控制
            dlg_config.delBtnVisible = () => action_type_list.indexOf('delete') != -1
        }

    }


}
