
const path = require('path'); //引入path

const uglify = require('uglifyjs-webpack-plugin'); //压缩文件插件 自带文件

const htmlPlugin = require('html-webpack-plugin'); //html文件的打发布  需要下载

 const extractTextPlugin = require('extract-text-webpack-plugin'); //分离css  需要下载

//css分离图片找不到问题
const website ={
    publicPath:'http://192.168.1.6:1717/'
}

//接口暴漏出去
module.exports ={
    entry:{
        entry:'./src/entry.js',
        entry2:'./src/entry2.js'
    }, // 入口
    output:{
        //path 是路径
        path:path.resolve(__dirname,'dist'),//dist 是文件夹名字
        //filename  要打包的文件
        filename:'[name].js', // 入口文件和出口文件一样 可以用name显示

        publicPath:website.publicPath  //设置图片路径解决css分离图片找不到问题
    }, // 出口
    module:{
        rules:[
            {
                test:/.css$/,//用正则处理我的的文件名
                use:extractTextPlugin.extract({
                    fallback:"style-loader",
                    use:[
                        {loader:'css-loader',options:{importLoaders:1}}, //css3自动加后缀
                        "postcss-loader"
                    ]

                })
                //use:['style-loader','css-loader'],//三种写法
               // loader:['style-loader','css-loader'],//
               //  use:[
               //      {
               //          loader:'style-loader'
               //      },
               //      {
               //          loader:'css-loader'
               //      }
               //  ]//
                // include:'', //那些文件不需要处理
                // query:'' //额外配置
            },{
                test:/\.(png|jpg|gif)/,
                use:[
                    {
                        loader:'url-loader',//解决加载 文件太大问题
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
                test:/\.less$/,  //加载less
                use:extractTextPlugin.extract({  //分离less
                    use:[
                        {
                            loader:'css-loader'//有加载顺序要求
                        },
                        {
                            loader:'less-loader'
                    }],
                    fallback:"style-loader"
                })
            },
            {
                test:/\.scss/,  //加载sass
                use:extractTextPlugin.extract({  //分离less
                    use:[
                        {
                           loader:'css-loader'
                        },{
                            loader:'sass-loader'
                    }],
                    fallback:"style-loader"
                })
            }
        ]
    }, //解读 图片转化  css解析
    plugins:[
       // new uglify(), //压缩 打包文件

       new htmlPlugin({
           minify:{removeAttributeQuotes:true}, //删除 引号
           hash:true, //不要缓存
           template:'./src/index.html' //打包
       }),

      new extractTextPlugin("css/index.css"),//分离css

],//插件
    devServer:{
        contentBase:path.resolve(__dirname,'dist'), //配置路径
        host:'192.168.1.6',
        compress:true,
        port:1717,
    }, //配置服务
}