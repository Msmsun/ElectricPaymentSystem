# 电费支付系统 - 微信小程序

## 项目介绍

这是一个基于微信小程序开发的电费支付系统，为用户提供便捷的电费查询、缴费、用电分析等服务。系统采用前后端分离架构，前端使用微信小程序原生开发，后端基于Spring Boot框架。

## 功能特性

### 用户功能
- 🔐 **用户认证**: 支持用户名密码登录，验证码验证
- 👤 **个人中心**: 个人信息管理、头像上传、密码修改
- 💰 **账户管理**: 账户余额查询、充值、添加账户
- 📊 **用电查询**: 个人用电量查询、用电记录查看
- 💳 **账单管理**: 电费账单查询、在线缴费
- 📈 **统计分析**: 用电数据统计、趋势分析
- 🤖 **AI助手**: 智能用电分析、节能建议

### 管理功能
- 👨‍💼 **用户管理**: 用户信息管理、权限控制
- 📋 **账单管理**: 账单生成、状态管理
- 📊 **数据统计**: 用电数据统计、报表生成
- ⚙️ **系统设置**: 系统配置、参数管理

## 技术栈

### 前端技术
- **框架**: 微信小程序原生开发
- **语言**: JavaScript (ES6+)
- **样式**: WXSS (微信小程序样式)
- **模板**: WXML (微信小程序模板)
- **状态管理**: 原生数据绑定
- **网络请求**: wx.request API

### 后端技术
- **框架**: Spring Boot 2.x
- **语言**: Java 8+
- **数据库**: MySQL
- **缓存**: Redis
- **安全**: Spring Security + JWT
- **文档**: Swagger

## 项目结构

```
miniprogram/
├── pages/                 # 页面目录
│   ├── login/            # 登录页面
│   ├── register/         # 注册页面
│   ├── index/            # 首页
│   ├── profile/          # 个人中心
│   ├── plusage/          # 用电查询
│   ├── bill/             # 账单管理
│   ├── statistics/       # 统计分析
│   ├── admin/            # 管理页面
│   └── ai/               # AI助手
├── utils/                # 工具类
│   ├── config.js         # 配置文件
│   ├── request.js        # 网络请求封装
│   └── user.js           # 用户信息管理
├── app.js                # 应用入口
├── app.json              # 应用配置
├── app.wxss              # 全局样式
└── project.config.json   # 项目配置
```

## 安装运行

### 环境要求
- 微信开发者工具 1.06.2504010+
- 微信基础库 3.8.11+
- Node.js 14+ (可选，用于构建)

### 开发环境配置

1. **克隆项目**
   ```bash
   git clone [项目地址]
   cd ElectricityPaymentSystem-front/miniprogram
   ```

2. **打开微信开发者工具**
   - 导入项目
   - 选择小程序项目
   - 填入AppID: `wx08ee7710f4804e0e`

3. **配置开发环境**
   - 在 `utils/config.js` 中设置 `isDev: true`
   - 设置 `useMockData: true` 使用模拟数据
   - 配置后端API地址

4. **运行项目**
   - 点击编译
   - 在模拟器中预览

### 生产环境部署

1. **修改配置**
   ```javascript
   // utils/config.js
   env: {
     isDev: false,
     useMockData: false,
     baseUrl: 'https://your-production-domain.com'
   }
   ```

2. **上传代码**
   - 在微信开发者工具中点击上传
   - 填写版本号和项目备注

3. **提交审核**
   - 在微信公众平台提交审核
   - 审核通过后发布

## 配置说明

### 网络配置
```javascript
// utils/config.js
network: {
  timeout: 10000,        // 请求超时时间
  retryTimes: 2,         // 重试次数
  retryDelay: 1000,      // 重试延迟
  enableRetry: true      // 是否启用重试
}
```

### 缓存配置
```javascript
cache: {
  userInfoExpire: 5 * 60 * 1000,  // 用户信息缓存时间
  tokenKey: 'token',              // token存储键名
  userInfoKey: 'userInfo'         // 用户信息存储键名
}
```

### API接口配置
```javascript
api: {
  captchaImage: '/captchaImage',                    // 验证码接口
  login: '/login',                                  // 登录接口
  getInfo: '/getInfo',                              // 用户信息接口
  personalUsage: '/PersonalElectricityUsage/PersonalElectricityUsage',  // 用电查询
  personalBill: '/PersonalPayments/Bill',           // 账单查询
  noticeList: '/system/notice/list',                // 公告列表
  uploadAvatar: '/system/user/profile/avatar',      // 头像上传
  aiContact: '/ai/contact'                          // AI对话接口
}
```

## 开发指南

### 添加新页面

1. **创建页面文件**
   ```bash
   mkdir pages/newpage
   touch pages/newpage/newpage.js
   touch pages/newpage/newpage.wxml
   touch pages/newpage/newpage.wxss
   touch pages/newpage/newpage.json
   ```

2. **注册页面**
   ```json
   // app.json
   {
     "pages": [
       "pages/newpage/newpage"
     ]
   }
   ```

3. **页面结构**
   ```javascript
   // pages/newpage/newpage.js
   Page({
     data: {
       // 页面数据
     },
     onLoad() {
       // 页面加载
     },
     onShow() {
       // 页面显示
     }
   });
   ```

### 网络请求

```javascript
const { request } = require('../../utils/request');

// GET请求
request({
  url: '/api/path',
  method: 'GET',
  data: { param: 'value' }
}).then(res => {
  console.log('请求成功:', res);
}).catch(err => {
  console.error('请求失败:', err);
});

// POST请求
request({
  url: '/api/path',
  method: 'POST',
  data: { key: 'value' }
}).then(res => {
  console.log('请求成功:', res);
}).catch(err => {
  console.error('请求失败:', err);
});
```

### 用户信息管理

```javascript
const userStore = require('../../utils/user');

// 获取用户信息
userStore.getInfo().then(user => {
  console.log('用户信息:', user);
}).catch(err => {
  console.error('获取失败:', err);
});

// 更新用户信息
userStore.updateUserInfo({
  nickName: '新昵称',
  email: 'new@example.com'
});
```

## 常见问题

### 1. 网络请求超时
- 检查网络连接
- 确认后端服务是否正常
- 调整超时时间配置

### 2. 登录失败
- 检查用户名密码是否正确
- 确认验证码是否输入正确
- 检查后端登录接口是否正常

### 3. 页面跳转失败
- 确认页面路径是否正确
- 检查页面是否已在app.json中注册
- 确认页面文件是否存在

### 4. 数据加载失败
- 检查API接口地址是否正确
- 确认token是否有效
- 查看网络请求日志

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 实现基础登录功能
- 实现用户信息管理
- 实现用电查询功能
- 实现账单管理功能

### v1.1.0 (2024-02-01)
- 新增AI助手功能
- 优化用户体验
- 修复已知问题
- 完善错误处理

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目维护者: [维护者姓名]
- 邮箱: [邮箱地址]
- 项目地址: [项目GitHub地址]

## 致谢

感谢所有为这个项目做出贡献的开发者和用户！ 