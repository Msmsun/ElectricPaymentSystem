# 真实登录配置指南

## 📋 配置概述

本指南将帮助您将小程序从模拟数据模式切换到真实后端连接模式。

## ✅ 已完成的配置修改

### 1. 配置文件修改
- ✅ 关闭模拟数据模式 (`useMockData: false`)
- ✅ 增加网络超时时间 (15秒)
- ✅ 增加重试次数 (3次)
- ✅ 清空默认登录信息

### 2. 登录页面修改
- ✅ 移除模拟数据指示器
- ✅ 移除默认用户名密码
- ✅ 优化验证码获取逻辑
- ✅ 增强错误处理

### 3. 网络请求修改
- ✅ 移除模拟数据代码
- ✅ 优化真实网络请求
- ✅ 增强错误处理机制

## 🔧 后端服务配置

### 1. 确认后端服务状态

请确认您的后端服务正在运行：

```bash
# 检查后端服务是否运行
curl http://10.148.11.100:8080/captchaImage

# 或者使用浏览器访问
http://10.148.11.100:8080/captchaImage
```

### 2. 后端服务要求

确保后端服务提供以下接口：

#### 验证码接口
```
GET /captchaImage
响应格式：
{
  "img": "base64编码的图片",
  "uuid": "验证码标识"
}
```

#### 登录接口
```
POST /login
请求参数：
{
  "username": "用户名",
  "password": "密码",
  "code": "验证码",
  "uuid": "验证码标识"
}
响应格式：
{
  "token": "JWT令牌",
  "user": {
    "userId": 1,
    "username": "用户名",
    "nickname": "昵称"
  }
}
```

#### 用户信息接口
```
GET /getInfo
请求头：Authorization: Bearer {token}
响应格式：
{
  "user": {
    "userId": 1,
    "username": "用户名",
    "nickname": "昵称",
    "email": "邮箱",
    "phone": "手机号"
  }
}
```

## 🌐 网络配置

### 1. 微信开发者工具设置

在微信开发者工具中：

1. **项目设置** → **本地设置**
2. **不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书检查** ✅
3. **不校验安全域名、TLS 版本以及 HTTPS 证书检查** ✅

### 2. 网络地址配置

当前配置的后端地址：
```javascript
baseUrl: 'http://10.148.11.100:8080'
```

如需修改，请编辑 `utils/config.js`：
```javascript
env: {
  baseUrl: 'http://your-backend-ip:port'
}
```

## 🔍 测试步骤

### 1. 验证码测试
1. 打开小程序
2. 查看验证码是否正常显示
3. 点击验证码是否能够刷新

### 2. 登录测试
1. 输入正确的用户名和密码
2. 输入验证码
3. 点击登录按钮
4. 检查是否成功跳转到首页

### 3. 功能测试
1. 测试各页面跳转
2. 测试数据加载
3. 测试用户交互功能

## 🚨 常见问题解决

### 1. 验证码获取失败

**问题**: 验证码图片不显示或获取失败

**解决方案**:
```javascript
// 检查后端接口是否正常
curl http://10.148.11.100:8080/captchaImage

// 检查网络连接
ping 10.148.11.100

// 检查防火墙设置
```

### 2. 登录失败

**问题**: 登录时提示网络错误或认证失败

**解决方案**:
1. 确认用户名密码正确
2. 确认验证码输入正确
3. 检查后端登录接口是否正常
4. 查看网络请求日志

### 3. 网络超时

**问题**: 请求超时错误

**解决方案**:
```javascript
// 增加超时时间
network: {
  timeout: 20000, // 增加到20秒
  retryTimes: 3,
  retryDelay: 1000
}
```

### 4. CORS错误

**问题**: 跨域请求被阻止

**解决方案**:
1. 后端需要配置CORS
2. 或者使用代理服务器
3. 或者配置微信开发者工具不校验域名

## 📱 真机调试

### 1. 真机调试配置

1. **微信开发者工具** → **预览**
2. 使用微信扫描二维码
3. 在手机上打开小程序

### 2. 真机调试注意事项

- 真机调试需要HTTPS协议
- 需要配置合法域名
- 建议使用内网穿透工具

### 3. 内网穿透工具

推荐使用以下工具进行内网穿透：

```bash
# 使用 ngrok
ngrok http 8080

# 使用 frp
frpc -c frpc.ini

# 使用 natapp
natapp -authtoken=your-token
```

## 🔐 安全配置

### 1. HTTPS配置

生产环境必须使用HTTPS：

```javascript
env: {
  baseUrl: 'https://your-domain.com'
}
```

### 2. 域名配置

在微信公众平台配置合法域名：

1. **开发** → **开发管理** → **开发设置**
2. **服务器域名** → **request合法域名**
3. 添加您的后端域名

### 3. Token安全

确保JWT token的安全性：

```javascript
// 设置token过期时间
const tokenExpireTime = 24 * 60 * 60 * 1000; // 24小时

// 定期刷新token
function refreshToken() {
  // 实现token刷新逻辑
}
```

## 📊 监控和日志

### 1. 网络请求监控

```javascript
// 在request.js中添加监控
console.log('请求开始:', {
  url: fullUrl,
  method: method.toUpperCase(),
  timestamp: new Date().toISOString()
});

console.log('请求完成:', {
  url: fullUrl,
  statusCode: res.statusCode,
  duration: Date.now() - startTime
});
```

### 2. 错误日志收集

```javascript
// 错误处理
function handleError(error) {
  console.error('请求错误:', {
    url: error.url,
    message: error.message,
    timestamp: new Date().toISOString()
  });
  
  // 可以发送到错误收集服务
  // sendErrorToService(error);
}
```

## 🎯 性能优化

### 1. 请求优化

```javascript
// 请求缓存
const requestCache = new Map();

function cachedRequest(options) {
  const cacheKey = JSON.stringify(options);
  if (requestCache.has(cacheKey)) {
    return Promise.resolve(requestCache.get(cacheKey));
  }
  
  return request(options).then(result => {
    requestCache.set(cacheKey, result);
    return result;
  });
}
```

### 2. 图片优化

```javascript
// 验证码图片缓存
function cacheCaptchaImage(imgUrl) {
  wx.getImageInfo({
    src: imgUrl,
    success: (res) => {
      // 缓存图片信息
      wx.setStorageSync('captcha_cache', {
        url: imgUrl,
        timestamp: Date.now()
      });
    }
  });
}
```

## 📞 技术支持

### 1. 调试工具

- **微信开发者工具**: 网络面板查看请求
- **Charles/Fiddler**: 网络代理工具
- **Postman**: API测试工具

### 2. 日志查看

```javascript
// 开启详细日志
console.log('详细请求信息:', {
  url: fullUrl,
  method: method.toUpperCase(),
  data: data,
  headers: header
});
```

### 3. 联系支持

如遇到问题，请提供以下信息：
- 错误日志
- 网络请求详情
- 后端服务状态
- 微信开发者工具版本

---

**配置状态**: ✅ 已完成  
**最后更新**: 2024年7月21日  
**版本**: v1.0.0 