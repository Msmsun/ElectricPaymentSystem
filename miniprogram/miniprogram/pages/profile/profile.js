const userStore = require('../../utils/user');
const { request, getToken } = require('../../utils/request');
const config = require('../../utils/config');

Page({
  data: {
    userInfo: {},
    accountBalance: 0,
    loading: false,
    error: '',
    activeTab: 'profile', // 当前激活的标签页：profile, password, account
    
    // 个人信息表单
    profileForm: {
      nickName: '',
      phonenumber: '',
      email: '',
      sex: '0'
    },
    
    // 修改密码表单
    passwordForm: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    
    // 充值表单
    rechargeForm: {
      rechargeMoney: ''
    },
    
    // 添加账号表单
    addAccountForm: {
      acountBalance: ''
    },
    
    // 弹窗显示状态
    rechargeDialogVisible: false,
    addAccountDialogVisible: false
  },

  onLoad() {
    console.log('Profile page loaded');
  },

  onShow() {
    console.log('Profile page shown');
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
    this.fetchAccountBalance();
  },

  onHide() {
    console.log('Profile page hidden');
  },

  onUnload() {
    console.log('Profile page unloaded');
  },

  // 加载用户信息（直接从userStore获取）
  loadUserInfo() {
    this.setData({ loading: true, error: '' });
    
    userStore.getInfo().then(user => {
      if (user && user.id) {
        console.log('Loaded user info from store:', user);
        
        this.setData({ 
          userInfo: user,
          'profileForm.nickName': user.nickName || '',
          'profileForm.phonenumber': user.phonenumber || '',
          'profileForm.email': user.email || '',
          'profileForm.sex': user.sex !== undefined ? user.sex.toString() : '0',
          loading: false 
        });
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

  // 获取账户余额
  fetchAccountBalance() {
    request({
      url: '/PersonalPayments/PersonalAcount/selectPersonalAcount',
      method: 'POST'
    }).then(res => {
      console.log('账户余额查询结果:', res);
      if (res.data && res.data.accountBalance !== null) {
        this.setData({ accountBalance: res.data.accountBalance });
      } else {
        this.setData({ accountBalance: 0 });
      }
    }).catch(err => {
      console.error('查询账户余额失败:', err);
      this.setData({ accountBalance: 0 });
    });
  },

  // 切换标签页
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  // 个人信息输入处理
  onProfileInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`profileForm.${field}`]: e.detail.value });
  },

  // 保存个人信息
  onSaveProfile() {
    const { profileForm } = this.data;
    
    // 简单验证
    if (!profileForm.nickName.trim()) {
      wx.showToast({ title: '请输入用户昵称', icon: 'none' });
      return;
    }
    if (!profileForm.email.trim()) {
      wx.showToast({ title: '请输入邮箱', icon: 'none' });
      return;
    }
    if (!profileForm.phonenumber.trim()) {
      wx.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }

    this.setData({ loading: true });

    request({
      url: '/system/user/profile',
      method: 'PUT',
      data: profileForm
    }).then(res => {
      console.log('个人信息更新成功:', res);
      this.setData({ loading: false });
      wx.showToast({ title: '保存成功', icon: 'success' });
      
      // 更新userStore中的用户信息
      userStore.updateUserInfo({
        nickName: profileForm.nickName,
        phonenumber: profileForm.phonenumber,
        email: profileForm.email,
        sex: parseInt(profileForm.sex)
      });
      
      // 重新加载用户信息显示
      this.loadUserInfo();
    }).catch(err => {
      console.error('保存个人信息失败:', err);
      this.setData({ loading: false });
      wx.showToast({ 
        title: err.message || '保存失败', 
        icon: 'none' 
      });
    });
  },

  // 密码输入处理
  onPasswordInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`passwordForm.${field}`]: e.detail.value });
  },

  // 修改密码
  onChangePassword() {
    const { passwordForm } = this.data;
    
    // 验证
    if (!passwordForm.oldPassword) {
      wx.showToast({ title: '请输入旧密码', icon: 'none' });
      return;
    }
    if (!passwordForm.newPassword) {
      wx.showToast({ title: '请输入新密码', icon: 'none' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      wx.showToast({ title: '新密码至少6位', icon: 'none' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      wx.showToast({ title: '两次密码不一致', icon: 'none' });
      return;
    }

    this.setData({ loading: true });

    request({
      url: '/system/user/profile/updatePwd',
      method: 'PUT',
      data: {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      }
    }).then(res => {
      console.log('密码修改成功:', res);
      this.setData({ 
        loading: false,
        passwordForm: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      });
      wx.showToast({ title: '密码修改成功', icon: 'success' });
    }).catch(err => {
      console.error('密码修改失败:', err);
      this.setData({ loading: false });
      wx.showToast({ 
        title: err.message || '密码修改失败', 
        icon: 'none' 
      });
    });
  },

  // 头像上传
  onChangeAvatar() {
    wx.showActionSheet({
      itemList: ['从相册选择', '拍照'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.chooseImage('album');
        } else if (res.tapIndex === 1) {
          this.chooseImage('camera');
        }
      }
    });
  },

  // 选择图片
  chooseImage(sourceType) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: [sourceType],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.uploadAvatar(tempFilePath);
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  },

  // 上传头像
  uploadAvatar(filePath) {
    this.setData({ loading: true });
    
    wx.uploadFile({
      url: config.getFullApiUrl(config.getApiPath('uploadAvatar')),
      filePath: filePath,
      name: 'avatarfile',
      header: {
        'Authorization': 'Bearer ' + getToken()
      },
      success: (res) => {
        console.log('头像上传成功:', res);
        try {
          const data = JSON.parse(res.data);
          if (data.code === 200) {
            // 更新用户信息中的头像
            userStore.updateUserInfo({
              avatar: data.imgUrl || data.url || data.avatar
            });
            
            // 重新加载用户信息
            this.loadUserInfo();
            
            wx.showToast({
              title: '头像上传成功',
              icon: 'success'
            });
          } else {
            throw new Error(data.msg || '上传失败');
          }
        } catch (err) {
          console.error('解析上传结果失败:', err);
          wx.showToast({
            title: '头像上传失败',
            icon: 'none'
          });
        }
        this.setData({ loading: false });
      },
      fail: (err) => {
        console.error('头像上传失败:', err);
        this.setData({ loading: false });
        wx.showToast({
          title: '头像上传失败',
          icon: 'none'
        });
      }
    });
  },

  // 打开充值弹窗
  onOpenRecharge() {
    this.setData({ 
      rechargeDialogVisible: true,
      'rechargeForm.rechargeMoney': ''
    });
  },

  // 充值金额输入
  onRechargeInput(e) {
    this.setData({ 'rechargeForm.rechargeMoney': e.detail.value });
  },

  // 确认充值
  onConfirmRecharge() {
    const { rechargeForm } = this.data;
    
    if (!rechargeForm.rechargeMoney || parseFloat(rechargeForm.rechargeMoney) <= 0) {
      wx.showToast({ title: '请输入有效金额', icon: 'none' });
      return;
    }

    this.setData({ loading: true });

    request({
      url: '/PersonalPayments/PersonalAcount/rechargePersonalAcount',
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: `rechargeMoney=${rechargeForm.rechargeMoney}`
    }).then(res => {
      console.log('充值成功:', res);
      this.setData({ 
        loading: false,
        rechargeDialogVisible: false
      });
      wx.showToast({ title: '充值成功', icon: 'success' });
      this.fetchAccountBalance(); // 刷新余额
    }).catch(err => {
      console.error('充值失败:', err);
      this.setData({ loading: false });
      wx.showToast({ 
        title: err.message || '充值失败', 
        icon: 'none' 
      });
    });
  },

  // 打开添加账号弹窗
  onOpenAddAccount() {
    this.setData({ 
      addAccountDialogVisible: true,
      'addAccountForm.acountBalance': ''
    });
  },

  // 添加账号金额输入
  onAddAccountInput(e) {
    this.setData({ 'addAccountForm.acountBalance': e.detail.value });
  },

  // 确认添加账号
  onConfirmAddAccount() {
    const { addAccountForm } = this.data;
    
    if (!addAccountForm.acountBalance || parseFloat(addAccountForm.acountBalance) <= 0) {
      wx.showToast({ title: '请输入有效金额', icon: 'none' });
      return;
    }

    this.setData({ loading: true });

    request({
      url: '/PersonalPayments/PersonalAcount/addPersonalAcount',
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: `acountBalance=${addAccountForm.acountBalance}`
    }).then(res => {
      console.log('添加账号成功:', res);
      this.setData({ 
        loading: false,
        addAccountDialogVisible: false
      });
      wx.showToast({ title: '添加账号成功', icon: 'success' });
      this.fetchAccountBalance(); // 刷新余额
    }).catch(err => {
      console.error('添加账号失败:', err);
      this.setData({ loading: false });
      wx.showToast({ 
        title: err.message || '添加账号失败', 
        icon: 'none' 
      });
    });
  },

  // 关闭弹窗
  onCloseDialog() {
    this.setData({ 
      rechargeDialogVisible: false,
      addAccountDialogVisible: false
    });
  },

  // 查询余额
  onQueryBalance() {
    this.fetchAccountBalance();
    wx.showToast({ title: '余额已刷新', icon: 'success' });
  }
}); 