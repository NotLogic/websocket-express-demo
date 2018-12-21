const axios = require('axios')
const request = axios.create({
  
})
// 设置默认头部编码
// request.defaults.headers.common.Accept = 'application/json, text/plain, charset=UTF-8'
// request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded, charset=UTF-8'
// request.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded, charset=UTF-8'
// request.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded, charset=UTF-8'

// 添加请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
request.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
module.exports = request