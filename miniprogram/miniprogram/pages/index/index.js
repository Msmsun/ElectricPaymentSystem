const userStore = require('../../utils/user');
const { request, getToken } = require('../../utils/request');
const config = require('../../utils/config');

Page({
  data: {
    userInfo: {},
    notice: ''
  },
  onShow() {
    if (!getToken()) {
      wx.redirectTo({ url: config.getPagePath('login') });
      return;
    }
    
    // 从userStore获取用户信息
    userStore.getInfo().then(user => {
      console.log('Index page - loaded user info:', user);
      this.setData({ userInfo: user });
    }).catch(err => {
      console.error('获取用户信息失败:', err);
      this.setData({ userInfo: {} });
    });
    
    this.getNotice();
  },
  getNotice() {
    request({
      url: config.getApiPath('noticeList'),
      method: 'GET',
      data: { pageNum: 1, pageSize: 1 }
    }).then(res => {
      let notice = '';
      if (res.rows && res.rows.length > 0) {
        notice = res.rows[0].noticeTitle;
      } else if (res.data && res.data.rows && res.data.rows.length > 0) {
        notice = res.data.rows[0].noticeTitle;
      }
      this.setData({ notice });
    }).catch(err => {
      console.error('获取公告失败:', err);
    });
  },
  goToBill() {
    console.log('Navigating to bill page');
    wx.navigateTo({ url: config.getPagePath('bill') });
  },
  goToPlusage() {
    console.log('Navigating to plusage page');
    wx.navigateTo({ url: config.getPagePath('plusage') });
  },
  goToProfile() {
    console.log('Navigating to profile page');
    const profilePath = config.getPagePath('profile');
    console.log('Profile path:', profilePath);
    
    wx.navigateTo({ 
      url: profilePath,
      success: function() {
        console.log('Navigation to profile successful');
      },
      fail: function(err) {
        console.error('Navigation to profile failed:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  goToAI() {
    console.log('=== AI Navigation Debug ===');
    console.log('Navigating to AI page');
    
    const aiPath = config.getPagePath('ai');
    console.log('AI path from config:', aiPath);
    console.log('Config pages object:', config.pages);
    
    if (!aiPath) {
      console.error('AI path is empty or undefined');
      wx.showToast({
        title: 'AI页面路径配置错误',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    console.log('Attempting navigation to:', aiPath);
    
    wx.navigateTo({ 
      url: aiPath,
      success: function(res) {
        console.log('Navigation to AI successful:', res);
      },
      fail: function(err) {
        console.error('Navigation to AI failed:', err);
        console.error('Error details:', JSON.stringify(err));
        
        // 尝试使用不同的导航方式
        console.log('Trying redirectTo as fallback...');
        wx.redirectTo({
          url: aiPath,
          success: function(res) {
            console.log('Redirect to AI successful:', res);
          },
          fail: function(err2) {
            console.error('Redirect to AI also failed:', err2);
            wx.showToast({
              title: 'AI功能开发中',
              icon: 'none',
              duration: 2000
            });
          }
        });
      }
    });
  }
}); 