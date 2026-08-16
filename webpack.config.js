const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/js/app.js', // Pintu masuk utama aplikasi
    output: {
        filename: '[name].[contenthash].js', // Nama file output unik biar gak kena cache
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/' // Penting untuk routing SPA
    },
    devtool: 'inline-source-map', // Biar gampang debug kalau error
    devServer: {
        static: './dist',
        hot: true,
        historyApiFallback: true, // WAJIB ADA untuk SPA!
        port: 8080,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'], // Izinkan import CSS di JS
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource', // Izinkan import gambar di JS
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ],
    },
    plugins: [
        // 1. HtmlWebpackPlugin mengambil template dari dalam SRC
        new HtmlWebpackPlugin({
            template: './src/index.html', 
            // ...
        }),

        // 2. CopyWebpackPlugin mengambil folder public dari ROOT
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public', // Cukup tulis string 'public'
                    to: '',
                    noErrorOnMissing: true
                },
            ],
        }),
    ],
};