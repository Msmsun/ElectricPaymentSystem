const userStore = require('../../utils/user');
const { request, getToken } = require('../../utils/request');
const config = require('../../utils/config');

Page({
  data: {
    userId: '',
    usageList: [],
    loading: false,
    error: '',
    hasData: false
  },

  onLoad() {
    console.log('Plusage page loaded');
  },

  onShow() {
    console.log('Plusage page shown');
    if (!getToken()) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      });
      setTimeout(() => {
        wx.redirectTo({ url: config.getPagePath('login') });
      }, 2000);
      return;
    }
    
    this.loadUserInfo();
  },

  onHide() {
    console.log('Plusage page hidden');
  },

  onUnload() {
    console.log('Plusage page unloaded');
    this.setData({ 
      usageList: [],
      loading: false,
      error: '',
      hasData: false
    });
  },

  // 加载用户信息
  loadUserInfo() {
    this.setData({ loading: true, error: '' });
    
    userStore.getInfo().then(user => {
      if (user && user.id) {
        this.setData({ 
          userId: user.id.toString(),
          loading: false 
        });
        this.fetchUsage(user.id);
      } else {
        this.setData({ 
          loading: false,
          error: '获取用户信息失败'
        });
      }
    }).catch(err => {
      console.error('获取用户信息失败:', err);
      this.setData({ 
        loading: false,
        error: '获取用户信息失败，请重新登录'
      });
    });
  },

  // 用户ID输入处理
  onUserIdInput(e) {
    this.setData({ 
      userId: e.detail.value,
      error: '' // 清除之前的错误信息
    });
  },

  // 搜索按钮点击
  onSearch() {
    const userId = (this.data.userId || '').toString().trim();
    if (!userId) {
      this.setData({ error: '请输入用户ID' });
      wx.showToast({ 
        title: '请输入用户ID', 
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    this.fetchUsage(userId);
  },

  // 获取用电数据
  fetchUsage(userId) {
    this.setData({ 
      loading: true, 
      error: '',
      hasData: false
    });

    console.log('Fetching usage data for userId:', userId);

    request({
      url: config.getApiPath('personalUsage'),
      method: 'GET',
      data: { userId },
    }).then(res => {
      console.log('Usage data response:', res);
      
      let list = res.data || res.rows || [];
      
      // 格式化数据
      const formattedList = list.map(item => ({
        ...item,
        usageMonth: this.formatDate(item.usageMonth),
        electricityUsage: parseFloat(item.electricityUsage || 0).toFixed(2)
      }));

      this.setData({ 
        usageList: formattedList,
        loading: false,
        hasData: formattedList.length > 0,
        error: formattedList.length === 0 ? '暂无用电数据' : ''
      });

      if (formattedList.length === 0) {
        wx.showToast({
          title: '暂无用电数据',
          icon: 'none',
          duration: 2000
        });
      }
    }).catch(err => {
      console.error('获取用电数据失败:', err);
      this.setData({ 
        usageList: [],
        loading: false,
        hasData: false,
        error: err.message || '获取数据失败，请稍后重试'
      });
      
      wx.showToast({
        title: err.message || '获取数据失败',
        icon: 'none',
        duration: 3000
      });
    });
  },

  // 格式化日期
  formatDate(dateStr) {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return dateStr; // 如果解析失败，返回原字符串
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (e) {
      console.error('日期格式化失败:', e);
      return dateStr;
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    if (this.data.userId) {
      this.fetchUsage(this.data.userId);
    }
    wx.stopPullDownRefresh();
  },

  // 点击用电记录项
  onUsageItemTap(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.usageList[index];
    
    wx.showModal({
      title: '用电详情',
      content: `用户ID: ${item.userId}\n日期: ${item.usageMonth}\n用电量: ${item.electricityUsage} kWh`,
      showCancel: false,
      confirmText: '确定'
    });
  }
});
