App({
  globalData: {
    userInfo: null,
    systemInfo: null,
    isInitialized: false
  },

  onLaunch() {
    console.log('App Launch');
    
    // 使用 try-catch 包装所有初始化逻辑
    try {
      // 获取系统信息
      this.getSystemInfo();
      
      // 检查更新
      this.checkUpdate();
      
      // 初始化错误监听
      this.initErrorListener();
      
      // 标记初始化完成
      this.globalData.isInitialized = true;
    } catch (error) {
      console.error('App initialization error:', error);
    }
  },

  onShow() {
    console.log('App Show');
  },

  onHide() {
    console.log('App Hide');
  },

  onError(msg) {
    console.error('App Error:', msg);
    // 可以在这里添加错误上报逻辑
  },

  getSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      this.globalData.systemInfo = systemInfo;
      console.log('System Info:', systemInfo);
    } catch (e) {
      console.error('获取系统信息失败:', e);
      // 设置默认值
      this.globalData.systemInfo = {
        screenWidth: 375,
        screenHeight: 667,
        windowWidth: 375,
        windowHeight: 667
      };
    }
  },

  checkUpdate() {
    try {
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager();
        
        updateManager.onCheckForUpdate((res) => {
          console.log('检查更新结果:', res.hasUpdate);
        });

        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: (res) => {
              if (res.confirm) {
                updateManager.applyUpdate();
              }
            }
          });
        });

        updateManager.onUpdateFailed(() => {
          console.error('新版本下载失败');
        });
      }
    } catch (error) {
      console.error('检查更新失败:', error);
    }
  },

  initErrorListener() {
    try {
      // 监听未处理的Promise拒绝
      if (wx.onUnhandledRejection) {
        wx.onUnhandledRejection((res) => {
          console.error('Unhandled Promise Rejection:', res.reason);
          
          // 特别处理 private_getBackgroundFetchData 错误
          if (res.reason && res.reason.errMsg && 
              res.reason.errMsg.includes('private_getBackgroundFetchData')) {
            console.warn('检测到后台数据获取错误，这是框架内部错误，不影响应用功能');
            return; // 不抛出错误，避免影响应用运行
          }
        });
      }

      // 监听内存警告
      if (wx.onMemoryWarning) {
        wx.onMemoryWarning((res) => {
          console.warn('Memory Warning:', res.level);
        });
      }

      // 监听网络状态变化
      if (wx.onNetworkStatusChange) {
        wx.onNetworkStatusChange((res) => {
          console.log('Network status changed:', res);
        });
      }
    } catch (error) {
      console.error('初始化错误监听失败:', error);
    }
  }
}) 