
const path = require('path'); //查看node_modules中是否有path

const glob = require('glob'); //删除没有使用的css

const uglify = require('uglifyjs-webpack-plugin'); //压缩文件插件 自带文件不需要下载

const htmlPlugin = require('html-webpack-plugin'); //html文件的打发布  需要下载

const extractTextPlugin = require('extract-text-webpack-plugin'); //分离css  需要下载

const purifyCssPlugin = require('purifycss-webpack');//删除没有使用的css

const entry = require('./js2/entry_webpack.js'); //模块化

//css分离图片找不到问题


console.log(encodeURIComponent(process.env.type));//参数传递不过来需要修改

if(process.env.type== "build"){
    var website={ //开发路径
        publicPath:'http://192.168.1.6:1717/'
    }
}else{
    var website={  //生产路径
        publicPath:'http://www.baidu.com/'
    }
}


module.exports ={
    devtool:'',//开发用的工具
    // source-map（独立文件）打包慢 比较详细
    // cheap-module-source-map打包慢（独立文件）
    //  eval-source-map 用于开发

    // entry:{
    //     entry:'./src/js/entry.js',
    //     entry2:'./src/js/entry2.js'
    // },
    entry:entry.path, //配置模块化

    output:{
        //path 是路径
        path:path.resolve(__dirname,'dist'),//dist 是文件夹名字
        //filename  要打包的文件
        filename:'[name].js', // 入口文件和出口文件一样 可以用name显示

        //公用路径
        publicPath:website.publicPath
    },
    module:{
        rules:[
            {
                test: /\.css$/,
                use:extractTextPlugin.extract({ //分离css
                    fallback:"style-loader",
                    use:[
                        {loader:'css-loader',options:{importLoaders:1}}, //css3自动加后缀
                        "postcss-loader" //css3加后缀
                    ]
                })

            },{
                test:/\.(png|jpg|gif)/,
                use:[
                    {
                        loader:'url-loader',//loader只下载不用引入， url-loader解决加载 文件太大问题
                        options:{
                            limit:5000,//大于5000就会拷贝，不大于就会生产base64格式
                            outputPath:'images/'//建立一个文件夹存放图片
                        }
                    },
                    // {
                    //     loader:'file-loader',//解决文件名不同
                    // }
                ]
            },{
                test:/\.(htm|html)$/i,  //配置 img引入图片
                use:['html-withimg-loader']
            },
            {
                test: /\.less$/,
                use: extractTextPlugin.extract({ //分离less
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.scss$/,
                use: extractTextPlugin.extract({//分离sass
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            { //把es6 es7 转化为 es2015
                test:/\.(jsx|js)$/,
                use:{
                    loader:'babel-loader',
                },
                exclude:/node_modules/  //去除node_modules这个文件夹
            }
        ]
    },
    plugins:[
//压缩 打包文件
     // new uglify(),

 //配置html文件
        new htmlPlugin({
            minify:{removeAttributeQuotes:true}, //删除 引号
            hash:true, //不要缓存
            template:'./src/index.html' //打包
        }),
//分离css
        new extractTextPlugin("css/index.css"),

//删除没有使用的css
        new purifyCssPlugin({
            paths:glob.sync(path.join(__dirname,'src/*.html')) //搜索所有的html
        })

    ],
    devServer:{ //热更新监听
        contentBase:path.resolve(__dirname,'dist'), //监听那个文件
        host:'192.168.1.6', //localhost，自己的IP地址
        compress:true, //是否启用服务器压缩
        port:1717, //端口
    }, //配置服务

}