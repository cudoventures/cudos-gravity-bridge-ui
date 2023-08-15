/* @flow */
const fs = require('fs');
const util = require('util');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const Config = require('./../../../config/config');

const MarkoModule = require('./MarkoModule');

const ArgvHelper = require('../helpers/ArgvHelper');
const FileHelper = require('../helpers/FileHelper');

const readdirSync = util.promisify(fs.readdir);

class WebpackModule {

    constructor(serverHelper, configTargetPathObj) {
        this.timeout = null;
        this.processing = false;
        this.serverHelper = serverHelper;
        this.configTargetPathObj = configTargetPathObj;

        const chunkConfig = {
            chunks: 'all',
            minSize: 30,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: 'vendor',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        };

        if (ArgvHelper.MINIFY === true) {
            this.optimization = {
                minimizer: [
                    new TerserPlugin({
                        cache: true,
                        parallel: true,
                        sourceMap: false,
                    }),
                    new OptimizeCSSAssetsPlugin({}),
                ],
                splitChunks: chunkConfig,
            };
        } else {
            this.optimization = {
                minimize: false,
                splitChunks: chunkConfig,
            };
        }

        if (ArgvHelper.DEV === true) {
            this.mode = 'development';
            this.dev_tool = 'inline-source-map';
            this.cacheIdentifier = 'dev-build';
        } else {
            this.mode = 'production';
            this.dev_tool = 'false';
            this.cacheIdentifier = `prod-build ${new Date().getTime()}`;
        }
    }

    async process() {
        const sourcePath = Config.Path.Root.Frontend.RESOURCES;
        const versions = await readdirSync(sourcePath);
        let pagePath;
        let entries;
        let entryPoint;
        let output;
        let outputHtmlsRoot;
        let outputHtmls;
        let name;
        let entryPoints;

        console.log('\x1b[33m Start WEBPACK \x1b[0m');
        console.time('webpack');

        this.processing = true;
        for (let i = versions.length; i-- > 0;) {
            if (versions[i] === 'common') {
                continue;
            }

            pagePath = path.join(sourcePath, versions[i], '/js/pages');
            entries = fs.readdirSync(pagePath);

            entryPoints = {};
            output = path.join(this.configTargetPathObj.Frontend.RESOURCES, versions[i], '/view/');

            outputHtmlsRoot = path.join(Config.Path.Root.Frontend.PAGES, versions[i]);
            outputHtmls = [];
            (await readdirSync(outputHtmlsRoot)).forEach((outputHtml) => {
                outputHtmls.push(path.join(outputHtmlsRoot, outputHtml));
            });

            for (let j = entries.length; j-- > 0;) {
                name = entries[j].replace('.js', '');
                if (name.indexOf('Page') === -1) {
                    continue;
                }
                if (ArgvHelper.isEntryPoint(name) === false) {
                    continue;
                }

                entryPoint = path.join(pagePath, entries[j]);
                entryPoints[path.join(name, 'bundle')] = [
                    'core-js/es/number',
                    'core-js/es/object',
                    'core-js/es/string',
                    'regenerator-runtime/runtime',
                    entryPoint,
                ];
            }

            if (Object.keys(entryPoints).length > 0) {
                await this.pack(entryPoints, output, outputHtmls, versions[i]);
            }
        }

        console.log('\x1b[33m Finish WEBPACK \x1b[0m');
        console.timeEnd('webpack');
        this.processing = false;
    }

    pack(entryPoints, output, outputHtmls, version) {
        return new Promise((resolve, reject) => {
            webpack({
                devtool: this.dev_tool,
                mode: this.mode,
                entry: entryPoints,
                output: {
                    // filename: 'bundle.js',
                    path: output,
                },
                optimization: this.optimization,
                watch: ArgvHelper.WATCH,
                watchOptions: {
                    aggregateTimeout: 1000,
                    ignored: /node_modules/,
                },
                plugins: [
                    new MiniCssExtractPlugin({
                        filename: '[name].css',
                        chunkFilename: 'vendor.css',
                    }),
                ],
                module: {
                    rules: [{
                        test: /\.css$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                'loader': 'css-loader',
                                'options': {
                                    'url': false,
                                },
                            },
                        ],
                    }, {
                        test: /\.js$|\.jsx$|\.ts$|\.tsx$/,
                        exclude: [/node_modules\/(!cudosjs).*/, path.join(__dirname, '../../../babel.config.js')],
                        use: {
                            loader: 'babel-loader',
                            options: {
                                'presets': [
                                    [
                                        '@babel/env',
                                        {
                                            targets: {
                                                chrome: 90,
                                                safari: 13,
                                                edge: 90,
                                            },
                                            useBuiltIns: 'entry',
                                            corejs: { version: 3, proposals: false },
                                        },
                                    ],
                                    '@babel/preset-react',
                                    '@babel/typescript',
                                ],
                                plugins: [
                                    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
                                    ['@babel/plugin-proposal-class-properties', { 'loose': false }],
                                    '@babel/proposal-object-rest-spread',
                                    '@babel/plugin-syntax-dynamic-import',
                                    // '@babel/plugin-transform-regenerator',
                                ],
                                cacheDirectory: Config.Path.Builds.Temp.CACHE,
                                configFile: false,
                                babelrc: false,
                            },
                        },
                    }, {
                        test: /\.svg$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'raw-loader',
                        },
                    }],
                },
                resolve: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
                },
            }, (err, status) => {
                if (err || status.hasErrors()) {
                    console.log(err);
                    if (status !== null && status.compilation !== null) {
                        console.log(status.compilation.errors);
                    }
                    reject();
                    return;
                }

                // if (status.hasWarnings()) {
                //     console.log(status.compilation.warnings);
                // }

                FileHelper.traversePath(output, '', null, false, (outputChild) => {
                    if (outputChild.indexOf('.css') === -1) {
                        return;
                    }

                    const css = fs.readFileSync(outputChild).toString().replace(/{URL_RESOURCES}/g, Config.URL.RESOURCES);
                    fs.writeFileSync(outputChild, css);
                });

                if (this.processing === false) {
                    outputHtmls.forEach((outputHtml) => {
                        MarkoModule.processFile(outputHtml, Config.Path.Dev.Frontend.PAGES);
                    });

                    if (this.timeout !== null) {
                        clearTimeout(this.timeout);
                    }

                    this.timeout = setTimeout(() => {
                        if (this.serverHelper !== null) {
                            console.log('webpack signal restart server');
                            this.serverHelper.restart();
                        }
                    }, 500);
                }

                console.log('\x1b[33m Entry %s is done. \x1b[0m', version);
                resolve();
            });
        });
    }

}

module.exports = WebpackModule;
