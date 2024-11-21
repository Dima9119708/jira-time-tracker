import path from 'path'
import webpack from 'webpack'
import Dotenv from 'dotenv-webpack'
import WebpackShellPluginNext from 'webpack-shell-plugin-next'

interface IBuildEnv {
    mode: 'development' | 'production'
}

export default (env: IBuildEnv) => {
    const mode = env?.mode || 'development'
    const isDev = mode === 'development'
    const isProd = !isDev

    let config: webpack.Configuration
    config = {
        mode,
        target: 'electron-main',
        entry: path.resolve(__dirname, 'src', 'electron-app', 'main.js'),
        output: {
            filename: 'main.js',
            path: path.resolve(__dirname, 'build', 'electron-app'),
            clean: true,
            // https://github.com/webpack/webpack/issues/1114
            library: {
                type: 'commonjs2',
            },
        },
        resolve: {
            extensions: ['.ts', '.js'],
            preferAbsolute: true,
            mainFiles: ['index'],
            modules: [path.resolve(__dirname, 'src'), 'node_modules'],
            alias: {},
            fallback: {},
        },
        optimization: {
            minimize: isProd,
        },
        plugins: [
            new webpack.ProgressPlugin(),
            new Dotenv({
                path: isDev ? path.resolve(__dirname, '.env') : path.resolve(__dirname, '.env.production'),
            }),
            isDev && new WebpackShellPluginNext({
                onBuildEnd: {
                    scripts: [`electronmon .`],
                    blocking: false,
                    parallel: true,
                },
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.(js|ts)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [['@babel/preset-env']],
                            plugins: [['@babel/plugin-transform-typescript'], '@babel/plugin-transform-runtime'],
                        },
                    },
                },
            ],
        },
    }

    return config
}
