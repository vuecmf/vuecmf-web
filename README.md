# vuecmf
VueCMF内容管理快速开发框架v3(前端)

前端：

https://gitee.com/emei/vuecmf-web

后端：

PHP版  https://gitee.com/emei/vuecmf-php

Go版   https://gitee.com/emei/vuecmf-go


# 项目介绍
VueCMF是一款完全开源免费的内容管理快速开发框架。采用前后端分离模式搭建，v3版本前端使用vue3、Element Plus和TypeScript构建，后端API的PHP版基于ThinkPHP8开发，Go版基于Gin开发。可用于快速开发CMS、CRM、WMS、OMS、ERP等管理系统，开发简单、高效易用，极大减少系统的开发周期和研发成本！甚至不用写一行代码就能设计出功能强大的管理系统。

# 示例演示
- [vuecmf示例演示](http://www.vuecmf.com/)

# 开始使用
## 安装运行环境
第一步：安装nodejs (已安装过的则跳过此步骤)，建议安装v20+

- [下载nodejs（https://nodejs.org/zh-cn/）](https://nodejs.org/zh-cn/), 并安装完后，在命令行执行下面操作安装yarn
```
npm install -g yarn

npm install -g degit
```

第二步：使用vuecmf-web模板创建项目

```
npx degit vuecmf/vuecmf-web my-project
```
my-project为你创建的项目名称，可自定义

若因网络问题无法创建模板，也可直接打开 https://gitee.com/emei/vuecmf-web 下载

第三步：下载依赖包
```
cd my-project
yarn install
```

## 运行项目
```
# 如果是开发调试，则在命令行输入下面回车
yarn dev

# 如果是发布到测试环境运行，则在命令行输入下面回车
yarn build:test

# 如果是发布生产环境运行，则在命令行输入下面回车
yarn build-only

```
## Docker部署
若没有安装docker，则必须先安装docker，然后在项目根目录下执行如下命令即可快速部署项目
```
docker compose up -d
```

