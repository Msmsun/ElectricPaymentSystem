// pages/statistics/statistics.js
const { request, getToken } = require('../../utils/request');

Page({
  data: {
    date: '',
    statistics: null
  },
  onShow() {
    if (!getToken()) {
      wx.redirectTo({ url: '/pages/login/login' });
    }
  },
  onLoad() {
    const today = this.formatDate(new Date());
    this.setData({ date: today });
    this.fetchStatistics(today);
  },
  onDateChange(e) {
    const date = e.detail.value;
    this.setData({ date });
  },
  onQuery() {
    this.fetchStatistics(this.data.date);
  },
  fetchStatistics(date) {
    // TODO: 替换为实际后端API路径和参数
    request({
      url: `/api/statistics/usage`,
      method: 'GET',
      data: { date }
    }).then(res => {
      this.setData({ statistics: res.data });
    }).catch(() => {
      this.setData({ statistics: null });
    });
  },
  formatDate(date) {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
});