

//1. route 되야하는 파일을 모두 가져와서 routes에 모음.
var common = require('./common.js');
var blog = require('./blog.js');
var user = require('./user.js');
var routes = {};

routes.common = common;
routes.user = user;
routes.blog = blog;

//2. routes 로 exports 시킴.
module.exports = routes;