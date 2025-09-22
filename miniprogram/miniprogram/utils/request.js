// utils/request.js
// 网络请求封装

// 引入配置和错误处理工具
const config = require('./config');

// 全局错误处理器
let globalErrorHandler = null;

// 设置全局错误处理器
function setGlobalErrorHandler(handler) {
  globalErrorHandler = handler;
}

// 调用全局错误处理器
function callGlobalErrorHandler(error) {
  if (globalErrorHandler && typeof globalErrorHandler === 'function') {
    try {
      globalErrorHandler(error);
    } catch (e) {
      console.error('Global error handler failed:', e);
    }
  }
}

// 主要请求函数
function request(options) {
  return new Promise((resolve, reject) => {
    const { url, method = 'GET', data = {}, header = {}, timeout } = options;
    
    // 构建完整URL
    const fullUrl = url.startsWith('http') ? url : config.getFullApiUrl(url);
    
    // 获取token
    const token = getToken();
    if (token && header.isToken !== false) {
      header.Authorization = 'Bearer ' + token;
    }
    
    // 设置默认header
    header['Content-Type'] = header['Content-Type'] || 'application/json';
    
    // 设置超时时间
    const requestTimeout = timeout || config.getNetworkConfig().timeout;
    
    console.log('发起请求:', fullUrl, method, data);
    
    wx.request({
      url: fullUrl,
      method: method.toUpperCase(),
      data: data,
      header: header,
      timeout: requestTimeout,
      success: (res) => {
        console.log('请求成功:', fullUrl, res.statusCode);
        // 检查HTTP状态码
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          const error = new Error(`HTTP ${res.statusCode}: ${res.data?.message || '请求失败'}`);
          error.statusCode = res.statusCode;
          error.response = res;
          callGlobalErrorHandler(error);
          reject(error);
        }
      },
      fail: (err) => {
        console.error('请求失败:', fullUrl, err);
        const error = new Error(err.errMsg || '网络请求失败');
        error.originalError = err;
        callGlobalErrorHandler(error);
        reject(error);
      }
    });
  });
}

// 获取token
function getToken() {
  try {
    return wx.getStorageSync(config.getCacheConfig().tokenKey);
  } catch (e) {
    return null;
  }
}

// 设置token
function setToken(token) {
  try {
    wx.setStorageSync(config.getCacheConfig().tokenKey, token);
  } catch (e) {
    console.error('保存token失败:', e);
  }
}

// 清除token
function clearToken() {
  try {
    wx.removeStorageSync(config.getCacheConfig().tokenKey);
  } catch (e) {
    console.error('清除token失败:', e);
  }
}

module.exports = {
  request,
  getToken,
  setToken,
  clearToken,
  setGlobalErrorHandler,
  callGlobalErrorHandler
}; 