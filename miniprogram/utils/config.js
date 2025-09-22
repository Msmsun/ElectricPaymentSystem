// utils/config.js
// 应用配置文件

const config = {
  // 环境配置
  env: {
    isDev: true, // 开发环境标识
    useMockData: false, // 关闭模拟数据，使用真实后端
    // 多种后端地址选项，请根据实际情况选择
    baseUrl: 'http://47.239.125.4:8080', // 本地开发
    // baseUrl: 'http://127.0.0.1:8080', // 本地开发（备用）
    // baseUrl: 'http://192.168.1.100:8080', // 局域网
    // baseUrl: 'http://10.148.11.100:8080', // 原配置
    productionUrl: 'https://your-production-domain.com' // 生产环境API地址
  },

  // 网络配置
  network: {
    timeout: 20000, // 增加请求超时时间（毫秒）
    retryTimes: 3, // 重试次数
    retryDelay: 1000, // 重试延迟（毫秒）
    enableRetry: true // 是否启用重试
  },

  // 缓存配置
  cache: {
    userInfoExpire: 5 * 60 * 1000, // 用户信息缓存时间（毫秒）
    tokenKey: 'token', // token存储键名
    userInfoKey: 'userInfo' // 用户信息存储键名
  },

  // 错误处理配置
  error: {
    enableGlobalHandler: true, // 是否启用全局错误处理
    showFrameworkError: false, // 是否显示框架内部错误
    logLevel: 'warn' // 日志级别：'debug', 'info', 'warn', 'error'
  },

  // 页面配置
  pages: {
    login: '/pages/login/login',
    index: '/pages/index/index',
    user: '/pages/user/user',
    profile: '/pages/profile/profile', // 个人中心页面
    plusage: '/pages/plusage/plusage', // 电费使用页面
    bill: '/pages/bill/bill',
    statistics: '/pages/statistics/statistics',
    admin: '/pages/admin/admin',
    ai: '/pages/ai/ai' // AI助手页面（预留）
  },

  // API接口配置
  api: {
    captchaImage: '/captchaImage',
    login: '/login',
    getInfo: '/getInfo',
    personalUsage: '/PersonalElectricityUsage/PersonalElectricityUsage',
    personalBill: '/PersonalPayments/Bill',
    noticeList: '/system/notice/list',
    uploadAvatar: '/system/user/profile/avatar', // 头像上传接口
    aiContact: '/ai/contact' // AI对话接口
  },

  // 默认数据配置（仅用于开发测试）
  defaults: {
    username: '', // 清空默认用户名
    password: '', // 清空默认密码
    userId: 1
  },

  // 获取当前环境的API地址
  getApiUrl() {
    return this.env.isDev ? this.env.baseUrl : this.env.productionUrl;
  },

  // 获取完整API地址
  getFullApiUrl(path) {
    return this.getApiUrl() + path;
  },

  // 检查是否使用模拟数据
  shouldUseMockData() {
    return this.env.useMockData;
  },

  // 获取网络配置
  getNetworkConfig() {
    return this.network;
  },

  // 获取缓存配置
  getCacheConfig() {
    return this.cache;
  },

  // 获取错误处理配置
  getErrorConfig() {
    return this.error;
  },

  // 获取页面路径
  getPagePath(pageName) {
    return this.pages[pageName] || '';
  },

  // 获取API路径
  getApiPath(apiName) {
    return this.api[apiName] || '';
  },

  // 获取默认值
  getDefault(key) {
    return this.defaults[key];
  }
};

module.exports = config; 