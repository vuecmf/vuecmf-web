// +----------------------------------------------------------------------
// | Copyright (c) 2019~2024 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf.com <tulihua2004@126.com>
// +----------------------------------------------------------------------

export interface Tag {
    title: string,
    path: string
}

export interface TagList {
    [index:number]:Tag
}

export interface AnyObject {
    [key: string]: any
}

export interface RouterObject {
    key: string,
    path: Array<string>
}





