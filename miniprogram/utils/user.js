// miniprogram/utils/user.js
const { request } = require('./request');
const config = require('./config');

const userStore = {
  userInfo: null,
  lastFetchTime: 0,

  // 检查缓存是否有效
  isCacheValid() {
    const cacheConfig = config.getCacheConfig();
    return this.userInfo && 
           this.userInfo.id && 
           (Date.now() - this.lastFetchTime) < cacheConfig.userInfoExpire;
  },

  // 清除缓存
  clearCache() {
    this.userInfo = null;
    this.lastFetchTime = 0;
  },

  // 获取用户信息
  getInfo() {
    return new Promise((resolve, reject) => {
      // 检查缓存是否有效
      if (this.isCacheValid()) {
        console.log('Using cached user info');
        resolve(this.userInfo);
        return;
      }

      console.log('Fetching user info from server');
      
      request({
        url: config.getApiPath('getInfo'),
        method: 'GET'
      }).then(res => {
        console.log('User info response:', res);
        
        // 根据web端的格式，用户信息在res.user中
        let user = res.user || res.data || {};
        
        if (!user || (!user.userId && !user.id)) {
          throw new Error('用户信息格式错误');
        }

        // 保存完整的用户信息，字段名与web端保持一致
        this.userInfo = {
          id: user.userId || user.id || '',
          username: user.userName || user.username || '',
          nickName: user.nickName || user.nickname || user.userName || user.username || '未知用户',
          name: user.userName || user.nickName || user.username || '未知用户',
          avatar: user.avatar || '',
          email: user.email || '',
          phonenumber: user.phonenumber || user.phone || '',
          sex: user.sex !== undefined ? user.sex : 0,
          createTime: user.createTime || '',
          accountBalance: user.accountBalance || 0
        };
        
        this.lastFetchTime = Date.now();
        
        console.log('User info updated:', this.userInfo);
        resolve(this.userInfo);
      }).catch(err => {
        console.error('获取用户信息失败:', err);
        this.clearCache();
        reject(err);
      });
    });
  },

  // 强制刷新用户信息
  refreshInfo() {
    this.clearCache();
    return this.getInfo();
  },

  // 更新用户信息（用于个人中心保存后更新缓存）
  updateUserInfo(newInfo) {
    if (this.userInfo) {
      this.userInfo = { ...this.userInfo, ...newInfo };
      this.lastFetchTime = Date.now();
    }
  },

  // 获取用户ID
  getUserId() {
    return this.userInfo ? this.userInfo.id : null;
  },

  // 获取用户名
  getUserName() {
    return this.userInfo ? this.userInfo.name : null;
  },

  // 获取用户昵称
  getNickName() {
    return this.userInfo ? this.userInfo.nickName : null;
  },

  // 获取用户邮箱
  getEmail() {
    return this.userInfo ? this.userInfo.email : null;
  },

  // 获取用户手机号
  getPhoneNumber() {
    return this.userInfo ? this.userInfo.phonenumber : null;
  },

  // 获取用户性别
  getSex() {
    return this.userInfo ? this.userInfo.sex : 0;
  },

  // 检查是否已登录
  isLoggedIn() {
    return this.userInfo && this.userInfo.id;
  }
};

module.exports = userStore; 