
import css from './../css/index.css';

import less from './../css/back.less';

import sass from './../css/main.scss';

// import $ from 'jquery'; // 引入第三方库




document.getElementById('text1').innerHTML='练习项目';

$("#box").html("这是jquery的");

//json引入
var json = require('../../config.json');
document.getElementById('jsons').innerHTML = "名字"+json.name +"年龄"+json.age;
