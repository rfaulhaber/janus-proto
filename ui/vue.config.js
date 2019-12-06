module.exports = {
    devServer: {
        overlay: {
            warnings: true,
            errors: true
        }
    },
    configureWebpack: {
        target: 'electron-renderer'
    }
};
