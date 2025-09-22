const { request } = require('../../utils/request');
const config = require('../../utils/config');

Page({
  data: {
    username: '',
    password: '',
    code: '',
    uuid: '',
    captchaUrl: '',
    loading: false,
    error: '',
    connectionStatus: 'checking', // checking, connected, failed
    connectionMessage: ''
  },

  onLoad() {
    console.log('Login page loaded');
    
    // 检查后端连接
    this.checkBackendConnection();
    
    // 获取验证码
    this.getCaptcha();
  },

  onShow() {
    console.log('Login page shown');
  },

  onHide() {
    console.log('Login page hidden');
  },

  onUnload() {
    console.log('Login page unloaded');
  },

  // 检查后端连接
  checkBackendConnection() {
    this.setData({ 
      connectionStatus: 'checking',
      connectionMessage: '正在检查后端连接...'
    });

    request({
      url: config.getApiPath('captchaImage'),
      method: 'GET',
      header: { isToken: false },
      timeout: 5000 // 5秒超时
    }).then(res => {
      console.log('后端连接成功:', res);
      this.setData({
        connectionStatus: 'connected',
        connectionMessage: '后端连接正常'
      });
    }).catch(err => {
      console.error('后端连接失败:', err);
      this.setData({
        connectionStatus: 'failed',
        connectionMessage: `连接失败: ${err.message}`
      });
    });
  },

  onUsernameInput(e) {
    this.setData({ 
      username: e.detail.value,
      error: '' // 清除错误信息
    });
  },

  onPasswordInput(e) {
    this.setData({ 
      password: e.detail.value,
      error: '' // 清除错误信息
    });
  },

  onCodeInput(e) {
    this.setData({ 
      code: e.detail.value,
      error: '' // 清除错误信息
    });
  },

  getCaptcha() {
    // 获取验证码图片和uuid
    console.log('开始获取验证码...');
    
    this.setData({ loading: true });
    
    request({
      url: config.getApiPath('captchaImage'),
      method: 'GET',
      header: { isToken: false }
    }).then(res => {
      console.log('验证码接口返回：', res);
      
      // 兼容后端返回结构
      let img = '';
      let uuid = '';
      if (res.img && res.uuid) {
        img = res.img;
        uuid = res.uuid;
      } else if (res.data && res.data.img && res.data.uuid) {
        img = res.data.img;
        uuid = res.data.uuid;
      } else if (res.data && res.data.data && res.data.data.img && res.data.data.uuid) {
        img = res.data.data.img;
        uuid = res.data.data.uuid;
      }
      
      if (img && uuid) {
        const captchaUrl = 'data:image/gif;base64,' + img;
        this.setData({
          captchaUrl: captchaUrl,
          uuid,
          loading: false
        });
      } else {
        this.setData({
          error: '验证码获取失败，数据格式错误',
          loading: false
        });
        wx.showToast({ 
          title: '验证码获取失败', 
          icon: 'none',
          duration: 2000
        });
      }
    }).catch(err => {
      console.error('获取验证码失败：', err);
      this.setData({
        error: '验证码获取失败，请重试',
        loading: false
      });
      wx.showToast({ 
        title: '验证码获取失败', 
        icon: 'none',
        duration: 2000
      });
    });
  },

  onLogin() {
    const { username, password, code, uuid } = this.data;
    
    // 输入验证
    if (!username || !password || !code) {
      this.setData({ error: '请输入用户名、密码和验证码' });
      wx.showToast({ 
        title: '请输入用户名、密码和验证码', 
        icon: 'none',
        duration: 2000
      });
      return;
    }

    this.setData({ loading: true, error: '' });

    request({
      url: config.getApiPath('login'),
      method: 'POST',
      data: { username, password, code, uuid },
      header: { isToken: false }
    }).then(res => {
      console.log('登录返回：', res);
      
      let token = '';
      if (res.token) {
        token = res.token;
      } else if (res.data && res.data.token) {
        token = res.data.token;
      } else if (res.data && res.data.data && res.data.data.token) {
        token = res.data.data.token;
      }
      
      if (token) {
        try {
          wx.setStorageSync('token', token);
          wx.setStorageSync('loginUsername', username);
        } catch (e) {
          console.error('保存登录信息失败:', e);
        }
        
        this.setData({ loading: false });
        wx.showToast({ 
          title: '登录成功', 
          icon: 'success',
          duration: 1500
        });
        
        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          wx.reLaunch({ url: config.getPagePath('index') });
        }, 1500);
      } else {
        this.setData({ 
          loading: false,
          error: '登录失败，请检查用户名和密码'
        });
        wx.showToast({ 
          title: '登录失败', 
          icon: 'none',
          duration: 2000
        });
        this.getCaptcha(); // 登录失败刷新验证码
      }
    }).catch(err => {
      console.error('登录失败:', err);
      this.setData({ 
        loading: false,
        error: err.message || '登录失败，请重试'
      });
      wx.showToast({ 
        title: err.message || '登录失败', 
        icon: 'none',
        duration: 2000
      });
      this.getCaptcha(); // 登录失败刷新验证码
    });
  },

  // 刷新验证码
  onRefreshCaptcha() {
    this.getCaptcha();
  },

  // 重新检查连接
  onRetryConnection() {
    this.checkBackendConnection();
  }
}); 