const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')


module.exports = {
    publicPath : './',
    outputDir : 'admin',
    indexPath : 'index.html',
    assetsDir : 'static',
    productionSourceMap : false,
    configureWebpack: config => {
        const plugins = [];
        plugins.push(
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        )

        // 合并plugins
        config.plugins = [...config.plugins, ...plugins];
    },
	chainWebpack(config) {
      if (process.env.NODE_ENV === 'production') {
		config.optimization.minimize(true);
		config.optimization.splitChunks({
			chunks: 'all',
            maxSize: 300000,
			cacheGroups: {
				vendors: { //vendor 是导入的第三方依赖包
					name: 'chunk-vendors',
					test: /[\\/]node_modules[\\/]/,
					chunks: 'initial',
					priority: 1  //优先级：数字越大优先级越高
				},
				elementPlus: {
					name: 'chunk-elementPlus',
					test: /[\\/]node_modules[\\/]_?element-plus(.*)/,
					priority: 2
				}
			}
		});
    }
  }

}

