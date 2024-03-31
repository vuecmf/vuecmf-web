// +----------------------------------------------------------------------
// | Copyright (c) 2019~2024 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf.com <tulihua2004@126.com>
// +----------------------------------------------------------------------

import axios from "axios";
import type {AxiosInstance, Method} from "axios";
import * as qs from "qs";
import type {AnyObject} from "@/typings/vuecmf";
import { useStore } from '@/stores';


/**
 * 基础模型
 */
export default abstract class Model {

    public token: string  //登录后的token
    public httpAxios: AxiosInstance
    public store

    constructor() {
        this.store = useStore()
        this.httpAxios = axios.create()
        this.httpAxios.defaults.timeout = 30000

        this.httpAxios.defaults.baseURL = import.meta.env.VITE_APP_BASE_API

        //允许跨域携带cookie信息
        this.httpAxios.defaults.withCredentials = true
        this.httpAxios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
        this.httpAxios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

        this.token = localStorage.getItem('vuecmf_token') as string
        this.httpAxios.defaults.headers.common['token'] = this.token

        //请求拦截
        this.httpAxios.interceptors.request.use((config) => {
            if(config.method === "post" || config.method === "put" || config.method === "delete"){
                // qs序列化
                config.data = qs.parse(config.data)
            }
            return config
        }, error => {
            return Promise.reject(error.data.error.message)
        })

        //响应拦截
        this.httpAxios.interceptors.response.use((config) => {
            if (config.status === 200 || config.status === 204) {
                return Promise.resolve(config);
            } else {
                return Promise.reject(config);
            }
        }, error => {
            if(error.data == null && error.response != null){
                return Promise.reject(error.response.data)
            }
            return Promise.reject(error.data.error.message)
        })

    }

    /**
     * GET请求
     * @param url
     * @param data
     */
    public async get(url: string, data: AnyObject): Promise<AnyObject> {
        return await this.httpAxios.request({
            method: 'get',
            url,
            data: data,
        })
    }

    /**
     * POST请求
     * @param url
     * @param data
     */
    public async post(url: string, data: AnyObject): Promise<AnyObject> {
        return await this.httpAxios.request({
            method: 'post',
            url,
            data: data,
        })
    }

    /**
     * 公共API请求
     * @param table_name
     * @param action_type
     * @param data
     * @param method
     * @param app_id
     */
    public request = async (table_name: string,action_type: string,data?:AnyObject, method?: Method, app_id?:number): Promise<AnyObject> => {
        if(typeof method == 'undefined') method = 'post'
        const api_maps:AnyObject = this.store.apiMaps
        if(typeof api_maps[table_name] == 'undefined' || typeof api_maps[table_name][action_type] == 'undefined'){
            return await this.httpAxios.request({
                method: 'post',
                url: '/vuecmf/model_action/get_api_map',
                data: {
                    data: {
                        table_name: table_name,
                        action_type: action_type,
                        app_id: app_id
                    }
                }
            }).then(async (res) => {
                if(res.status === 200 && res.data.code == 0){
                    if(typeof api_maps[table_name] == 'undefined') api_maps[table_name] = []
                    api_maps[table_name][action_type] = res.data.data
                    return await this.httpAxios.request({
                        method: method,
                        url: res.data.data,
                        data: data,
                    })
                }else{
                    return res
                }
            })

        }else{
            let req_data = {
                method: method,
                url: api_maps[table_name][action_type],
                data: data,
            }

            if(method.toLowerCase() === 'get')  {
                const params_arr:string[] = []
                let params = ''
                if(data){
                    Object.keys(data).forEach((key) => {
                        params_arr.push(key + '=' + data[key])
                    })
                    params = '?' + params_arr.join('&')
                }

                req_data = {
                    method: method,
                    url: api_maps[table_name][action_type] + params,
                    data: {},
                }
            }

            return await this.httpAxios.request(req_data)
        }
    }

    /**
     * 根据模型表名及动作类型获取API请求URL
     * @param table_name
     * @param action_type
     */
    public getApiUrl = (table_name: string,action_type: string): string => {
        const api_maps:AnyObject = this.store.apiMaps
        if(typeof api_maps[table_name] != 'undefined' && typeof api_maps[table_name][action_type] != 'undefined'){
            return import.meta.env.VITE_APP_BASE_API + api_maps[table_name][action_type]
        }else{
            return ''
        }
    }

    /**
     * 根据模型表名及动作类型获取完整API请求URL
     * @param table_name
     * @param action_type
     */
    public getFullApiUrl = (table_name: string,action_type: string): string => {
        const api_maps:AnyObject = this.store.apiMaps
        if(typeof api_maps[table_name] != 'undefined' && typeof api_maps[table_name][action_type] != 'undefined'){
            return this.httpAxios.defaults.baseURL + api_maps[table_name][action_type]
        }else{
            return ''
        }
    }


    /**
     * 获取用户登录信息
     */
    public getLoginUser = (): AnyObject|false => {
        const user = localStorage.getItem('vuecmf_user')
        if(user == null || user == '' || user == undefined) return false
        return JSON.parse(user)
    }


}


