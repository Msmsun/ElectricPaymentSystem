const { request, getToken } = require('../../utils/request');
const config = require('../../utils/config');

Page({
  data: {
    messages: [],
    inputText: '',
    loading: false,
    scrollToMessage: '',
    messageId: 0
  },

  onLoad() {
    console.log('=== AI Page Loaded ===');
    console.log('AI page loaded successfully');
    console.log('Initial data:', this.data);
  },

  onShow() {
    console.log('=== AI Page Shown ===');
    console.log('AI page shown');
    
    if (!getToken()) {
      console.log('No token found, redirecting to login');
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
    
    console.log('Token found, AI page ready');
    console.log('Current messages:', this.data.messages);
  },

  onHide() {
    console.log('AI page hidden');
  },

  onUnload() {
    console.log('AI page unloaded');
  },

  // 输入框内容变化
  onInputChange(e) {
    console.log('Input changed:', e.detail.value);
    this.setData({
      inputText: e.detail.value
    });
  },

  // 发送消息 - 简化版本
  sendMessage() {
    console.log('=== Send Message Called ===');
    const text = this.data.inputText.trim();
    console.log('Input text:', text);
    console.log('Current loading state:', this.data.loading);
    
    if (!text) {
      console.log('Message empty, showing toast');
      wx.showToast({
        title: '请输入问题',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    
    if (this.data.loading) {
      console.log('Currently loading, skipping');
      return;
    }

    console.log('=== Starting Message Process ===');
    
    // 1. 添加用户消息
    console.log('Step 1: Adding user message');
    this.addMessage('user', text, 'text');
    
    // 2. 清空输入框
    console.log('Step 2: Clearing input');
    this.setData({ inputText: '' });

    // 3. 设置加载状态
    console.log('Step 3: Setting loading state');
    this.setData({ loading: true });

    // 4. 模拟AI响应
    console.log('Step 4: Starting AI response simulation');
    setTimeout(() => {
      console.log('Step 5: Generating AI response');
      this.generateSimpleResponse(text);
      this.setData({ loading: false });
      console.log('Step 6: AI response completed');
    }, 1000);
  },

  // 简化的AI响应生成
  generateSimpleResponse(message) {
    console.log('=== Generate Simple Response ===');
    console.log('Message received:', message);
    
    let response = '';
    
    if (message.includes('用电') || message.includes('电费')) {
      response = '根据您的用电数据，本月用电量较上月增长15%，建议错峰用电以节省费用。';
    } else if (message.includes('节能') || message.includes('节省')) {
      response = '节能建议：1.及时关闭不使用的电器 2.使用节能灯泡 3.合理设置空调温度';
    } else if (message.includes('异常') || message.includes('预警')) {
      response = '系统检测到用电异常，建议检查电器设备是否正常关闭。';
    } else {
      response = '您好！我是智能用电助手，可以为您提供用电分析、节能建议等服务。';
    }
    
    console.log('Generated response:', response);
    this.addMessage('ai', response, 'text');
  },

  // 发送建议问题
  sendSuggestion(e) {
    console.log('=== Send Suggestion ===');
    const text = e.currentTarget.dataset.text;
    console.log('Suggestion text:', text);
    
    if (text) {
      console.log('Setting suggestion text and sending...');
      this.setData({ inputText: text });
      this.sendMessage();
    }
  },

  // 添加消息 - 简化版本
  addMessage(sender, text, type = 'text') {
    console.log('=== Add Message ===');
    console.log('Parameters:', { sender, type, textLength: text.length });
    console.log('Current messages count:', this.data.messages.length);
    
    const messageId = this.data.messageId + 1;
    const message = {
      id: messageId,
      sender: sender,
      text: text,
      type: type,
      timestamp: new Date().getTime()
    };

    console.log('New message object:', message);

    const newMessages = [...this.data.messages, message];
    console.log('New messages array length:', newMessages.length);

    this.setData({
      messages: newMessages,
      messageId: messageId,
      scrollToMessage: `msg-${messageId}`
    });

    console.log('Message added successfully');
    console.log('Updated messages count:', this.data.messages.length);
    
    // 强制更新界面
    this.setData({
      messages: newMessages
    });
    
    console.log('Final messages count:', this.data.messages.length);
  },

  // 滚动到底部
  scrollToBottom() {
    console.log('Scrolling to bottom...');
    const query = wx.createSelectorQuery();
    query.select('.chat-messages').boundingClientRect();
    query.exec((res) => {
      if (res[0]) {
        console.log('Scroll area found, setting scroll position');
        this.setData({
          scrollToMessage: `msg-${this.data.messageId}`
        });
      } else {
        console.log('Scroll area not found');
      }
    });
  },

  // 页面分享
  onShareAppMessage() {
    return {
      title: 'AI智能用电助手',
      path: '/pages/ai/ai',
      imageUrl: '/images/ai-share.png'
    };
  },

  // 测试添加消息
  testAddMessage() {
    console.log('=== Test Add Message ===');
    console.log('Testing message addition...');
    
    // 添加测试用户消息
    this.addMessage('user', '这是一条测试消息', 'text');
    
    // 延迟添加AI回复
    setTimeout(() => {
      this.addMessage('ai', '这是一条测试AI回复消息', 'text');
    }, 500);
  }
}); 