const webpack = require('webpack')

module.exports = {
	lintOnSave: false,
	devServer: {
		port: 8084,
		// If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
		// proxy: {
		//   '/': {
		//     target: 'https://school.fengniaotuangou.cn',
		//     ws: true,
		//     changeOrigin: true
		//   }
		// }
	},
	configureWebpack: config => {
		config.entry.app = ["babel-polyfill", "./src/main.js"]
	},
	pwa: {
		iconPaths: {
			favicon32: 'favicon.ico',
			favicon16: 'favicon.ico',
			appleTouchIcon: 'favicon.ico',
			maskIcon: 'favicon.ico',
			msTileImage: 'favicon.ico'
		}

	},
}
