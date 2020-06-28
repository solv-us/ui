module.exports = {
    css: {
        loaderOptions: {
            sass: {
                prependData: ` @import "@/scss/_variables.scss";`
            }
        }
    },
     devServer: { headers: { 'Cache-Control': 'no-store' } },
    chainWebpack: (config) => {
        if (process.env.NODE_ENV === 'development') {
        config.plugins.delete('preload');
        }
  },
}