// pages/bill/bill.js
const userStore = require('../../utils/user');
const { request, getToken } = require('../../utils/request');

Page({
  data: {
    loading: false,
    userId: '',
    billStatus: '',
    selectedStatus: '',
    userInfo: {},
    billDTO: {
      userName: '',
      userEmail: '',
      billList: []
    },
    billStatusOptions: [
      { label: '未支付', value: '0' },
      { label: '已支付', value: '1' }
    ]
  },
  onLoad(options) {

  },
  onReady() {

  },
  onShow() {
    if (!getToken()) {
      wx.redirectTo({ url: '/pages/login/login' });
      return;
    }
    userStore.getInfo().then(user => {
      if (user.id) {
        this.setData({ 
          userId: user.id,
          userInfo: user
        });
        this.getList();
      }
    });
  },
  onHide() {
    this.setData({ 
      billDTO: { userName: '', userEmail: '', billList: [] },
      selectedStatus: ''
    });
  },
  onUnload() {
    this.setData({ 
      billDTO: { userName: '', userEmail: '', billList: [] },
      selectedStatus: ''
    });
  },
  onPullDownRefresh() {

  },
  onReachBottom() {

  },
  onShareAppMessage() {

  },
  onUserIdInput(e) {
    this.setData({ userId: e.detail.value });
  },
  onBillStatusChange(e) {
    const index = e.detail.value;
    const option = this.data.billStatusOptions[index];
    this.setData({ 
      billStatus: option.value,
      selectedStatus: option.label
    });
  },
  onSearch() {
    this.getList();
  },
  onReset() {
    userStore.getInfo().then(user => {
      this.setData({
        userId: user.id || '',
        billStatus: '',
        selectedStatus: '',
        userInfo: user,
        billDTO: { userName: '', userEmail: '', billList: [] }
      });
    });
  },
  getList() {
    if (!this.data.userId) {
      wx.showToast({ title: '用户ID未设置，无法查询账单', icon: 'none' });
      return;
    }
    this.setData({ loading: true });
    const params = {
      userId: this.data.userId
    };
    if (this.data.billStatus) {
      params.billStatus = this.data.billStatus;
    }
    request({
      url: '/PersonalPayments/Bill',
      method: 'GET',
      data: params
    }).then(res => {
      console.log('账单接口返回数据:', res);
      if (res.code === 200) {
        // 格式化账单列表字段，避免WXML调用JS方法
        const billList = (res.data.userBillList || []).map(item => ({
          ...item,
          usageMonth: item.usageMonth ? this.formatDate(item.usageMonth) : '-',
          createTime: item.createTime ? this.formatDateTime(item.createTime) : '-',
          updateTime: item.updateTime ? this.formatDateTime(item.updateTime) : '-'
        }));
        this.setData({
          billDTO: {
            userName: res.data.userName || '',
            userEmail: res.data.email || '',
            billList
          }
        });
        console.log('账单列表:', billList);
      } else {
        wx.showToast({ title: res.msg || '获取账单列表失败', icon: 'none' });
      }
      this.setData({ loading: false });
    }).catch(() => {
      wx.showToast({ title: '请求失败，请稍后再试', icon: 'none' });
      this.setData({ loading: false });
    });
  },
  handlePay(e) {
    const bill = e.currentTarget.dataset.bill;
    if (!bill.id) {
      wx.showToast({ title: '账单ID无效', icon: 'none' });
      return;
    }
    wx.showModal({
      title: '缴费确认',
      content: `确认支付 ${bill.cost.toFixed(2)} 元的电费吗？`,
      success: (res) => {
        if (res.confirm) {
          this.payBill(bill.id);
        }
      }
    });
  },
  payBill(billId) {
    this.setData({ loading: true });
    request({
      url: `/PersonalPayments/PersonalPayments/payBill/${billId}`,
      method: 'GET'
    }).then(res => {
      if (res.code === 200) {
        wx.showToast({ title: '支付成功', icon: 'success' });
        this.getList(); // 刷新账单列表
      } else {
        wx.showToast({ title: res.msg || '支付失败', icon: 'none' });
      }
      this.setData({ loading: false });
    }).catch(() => {
      wx.showToast({ title: '支付失败，请稍后再试', icon: 'none' });
      this.setData({ loading: false });
    });
  },
  formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '-';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  formatDateTime(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '-';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  },
  getBillStatusText(status) {
    const statusMap = { 0: '未支付', 1: '已支付' };
    return statusMap[status] || '未知状态';
  }
});