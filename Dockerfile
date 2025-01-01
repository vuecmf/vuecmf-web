FROM node:20-alpine as builder
COPY . /app/
# 设置工作目录
WORKDIR /app
# 设置淘宝 npm 镜像源

FROM node:20-alpine as builder
COPY . /app/
# 设置工作目录
WORKDIR /app
# 设置阿里云 npm 镜像源
RUN npm config set registry https://registry.npmmirror.com
# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install

# 构建 Vite 项目
RUN pnpm run build-only

# 使用官方的 Nginx 镜像作为运行镜像
FROM nginx:alpine
ENV TZ=Asia/Shanghai
# 复制构建后的文件到 Nginx 的 html 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install

# 构建 Vite 项目
RUN pnpm run build-only

# 使用官方的 Nginx 镜像作为运行镜像
FROM nginx:alpine
ENV TZ=Asia/Shanghai
# 复制构建后的文件到 Nginx 的 html 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
