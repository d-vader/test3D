const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
const ConcatPlugin = require('webpack-concat-plugin');

module.exports = {
    entry: [
        './src/js/index.js',
        './src/styles/style.scss',

    ],
    output: {
        filename: 'js/bundle.js'
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src/js'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: 'env'
                    }
                }
            },
            {
                test: /\.(sass|scss)$/,
                include: path.resolve(__dirname, 'src/styles'),
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            minimize: true,
                            url: false
                        }
                    },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new ExtractTextPlugin({
            filename: './styles/style.bundle.css',
            allChunks: true,
        }),
        new HtmlWebpackPlugin({
            inject: true,
            hash: true,
            template: './src/index.html',
            filename: 'index.html'
        }),
        // new MergeIntoSingleFilePlugin({
        //     "libs.js": [
        //         path.resolve(__dirname, 'src/libs/three.js'),
        //         path.resolve(__dirname, 'src/libs/OrbitControls.js'),
        //         path.resolve(__dirname, 'src/libs/WebGL.js'),
        //     ]
        // }),
        new ConcatPlugin({
            uglify: true,
            sourceMap: true,
            name: 'libs',
            outputPath: 'libs/',
            fileName: '[name].[hash:8].js',
            filesToConcat: ['./src/libs/three.js', './src/libs/OrbitControls.js', './src/libs/WebGL.js'],
            attributes: {
                async: false
            }
        })
    ]
};