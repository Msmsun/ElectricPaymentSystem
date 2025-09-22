# 后端接口配置说明

## 当前配置

目前小程序配置的后端接口地址为：
```
http://10.148.11.100:8080
```

## 配置修改步骤

### 1. 确认后端服务地址

请确认您的后端服务是否在 `10.148.11.100:8080` 上运行。如果不是，请修改 `utils/config.js` 文件中的 `baseUrl` 配置。

### 2. 修改配置文件

在 `miniprogram/utils/config.js` 文件中找到以下配置：

```javascript
env: {
  isDev: true, // 开发环境标识
  useMockData: false, // 关闭模拟数据，使用真实接口
  baseUrl: 'http://10.148.11.100:8080', // 修改为您的后端服务地址
  productionUrl: 'https://your-production-domain.com'
}
```

### 3. 常见后端地址配置

#### 本地开发环境
```javascript
baseUrl: 'http://localhost:8080'
// 或者
baseUrl: 'http://127.0.0.1:8080'
```

#### 局域网环境
```javascript
baseUrl: 'http://192.168.1.100:8080' // 替换为您的局域网IP
```

#### 公网环境
```javascript
baseUrl: 'https://your-domain.com'
// 或者
baseUrl: 'http://your-ip:8080'
```

## 接口要求

确保您的后端服务提供以下接口：

### 1. 验证码接口
- **路径**: `/captchaImage`
- **方法**: `GET`
- **返回格式**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "uuid": "验证码UUID",
    "img": "base64编码的图片数据"
  }
}
```

### 2. 登录接口
- **路径**: `/login`
- **方法**: `POST`
- **请求参数**:
```json
{
  "username": "用户名",
  "password": "密码",
  "code": "验证码",
  "uuid": "验证码UUID"
}
```
- **返回格式**:
```json
{
  "code": 200,
  "msg": "登录成功",
  "data": {
    "token": "JWT令牌",
    "user": {
      "userId": 1,
      "username": "用户名",
      "nickName": "昵称"
    }
  }
}
```

### 3. 用户信息接口
- **路径**: `/getInfo`
- **方法**: `GET`
- **请求头**: `Authorization: Bearer {token}`
- **返回格式**:
```json
{
  "user": {
    "id": 1,
    "userId": 1,
    "userName": "用户名",
    "name": "姓名",
    "avatar": "头像URL"
  }
}
```

### 4. 用电记录接口
- **路径**: `/PersonalElectricityUsage/PersonalElectricityUsage`
- **方法**: `GET`
- **请求参数**: `userId`
- **请求头**: `Authorization: Bearer {token}`
- **返回格式**:
```json
{
  "data": [
    {
      "id": 1,
      "userId": 1,
      "usageMonth": "2024-01-01",
      "electricityUsage": 150.5
    }
  ]
}
```

## 测试步骤

### 1. 检查后端服务状态
确保后端服务正在运行，可以通过浏览器访问：
```
http://your-backend-url:port/captchaImage
```

### 2. 测试接口连通性
在浏览器中测试各个接口是否正常响应。

### 3. 小程序测试
1. 修改配置文件中的 `baseUrl`
2. 重新编译小程序
3. 在真机上测试登录功能

## 常见问题

### 1. 网络连接失败
- 检查后端服务是否启动
- 检查IP地址和端口是否正确
- 检查防火墙设置

### 2. 跨域问题
确保后端服务配置了CORS，允许小程序域名访问。

### 3. HTTPS要求
真机调试时，如果使用HTTPS，确保后端服务支持HTTPS。

### 4. 接口路径不匹配
检查接口路径是否与后端服务提供的路径一致。

## 调试建议

### 1. 开启详细日志
在开发阶段，可以在 `config.js` 中设置：
```javascript
error: {
  logLevel: 'debug' // 显示详细日志
}
```

### 2. 使用模拟数据
如果后端服务暂时不可用，可以临时开启模拟数据：
```javascript
env: {
  useMockData: true // 临时使用模拟数据
}
```

### 3. 网络调试
使用微信开发者工具的网络面板查看请求详情。

## 生产环境配置

部署到生产环境时，请：

1. 修改 `baseUrl` 为生产环境地址
2. 确保使用HTTPS协议
3. 关闭模拟数据
4. 配置正确的域名白名单 