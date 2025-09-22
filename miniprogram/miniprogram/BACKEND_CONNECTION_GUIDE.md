# 后端连接问题解决指南

## 🚨 当前问题

验证码获取失败，网络请求超时，说明后端服务无法连接。

## 🔍 问题诊断

### 1. 检查后端服务状态

首先确认您的后端服务是否正在运行：

```bash
# 检查端口8080是否被占用
netstat -an | grep 8080

# 检查服务进程
ps aux | grep java
# 或者
ps aux | grep node
# 或者
ps aux | grep python
```

### 2. 测试网络连接

```bash
# 测试本地连接
curl http://localhost:8080/captchaImage

# 测试127.0.0.1连接
curl http://127.0.0.1:8080/captchaImage

# 测试局域网连接
curl http://192.168.1.100:8080/captchaImage
```

## 🔧 解决方案

### 方案1：启动后端服务

如果后端服务没有运行，请启动它：

#### Spring Boot 项目
```bash
# 进入项目目录
cd your-backend-project

# 使用Maven启动
./mvnw spring-boot:run

# 或者使用Gradle
./gradlew bootRun

# 或者直接运行jar文件
java -jar target/your-app.jar
```

#### Node.js 项目
```bash
# 进入项目目录
cd your-backend-project

# 安装依赖
npm install

# 启动服务
npm start
# 或者
node app.js
```

#### Python 项目
```bash
# 进入项目目录
cd your-backend-project

# 安装依赖
pip install -r requirements.txt

# 启动服务
python app.py
# 或者
flask run --host=0.0.0.0 --port=8080
```

### 方案2：修改后端地址

根据您的实际情况，修改 `utils/config.js` 中的后端地址：

```javascript
// 本地开发
baseUrl: 'http://localhost:8080'

// 或者使用127.0.0.1
baseUrl: 'http://127.0.0.1:8080'

// 或者局域网地址
baseUrl: 'http://192.168.1.100:8080'

// 或者您的实际IP地址
baseUrl: 'http://your-actual-ip:8080'
```

### 方案3：使用内网穿透

如果后端服务在局域网内，可以使用内网穿透工具：

#### 使用 ngrok
```bash
# 安装ngrok
# 下载地址: https://ngrok.com/download

# 启动内网穿透
ngrok http 8080

# 使用生成的公网地址，例如：
# https://abc123.ngrok.io
```

#### 使用 frp
```bash
# 配置frpc.ini
[common]
server_addr = your-frp-server.com
server_port = 7000

[web]
type = http
local_port = 8080
custom_domains = your-domain.com
```

#### 使用 natapp
```bash
# 下载natapp
# 启动内网穿透
natapp -authtoken=your-token
```

### 方案4：检查防火墙设置

确保防火墙允许8080端口：

#### Windows
```cmd
# 检查防火墙规则
netsh advfirewall firewall show rule name=all | findstr 8080

# 添加防火墙规则
netsh advfirewall firewall add rule name="Backend Port 8080" dir=in action=allow protocol=TCP localport=8080
```

#### Linux
```bash
# 检查防火墙状态
sudo ufw status

# 允许8080端口
sudo ufw allow 8080

# 或者使用iptables
sudo iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
```

#### macOS
```bash
# 检查防火墙状态
sudo pfctl -s all

# 允许8080端口
sudo pfctl -f /etc/pf.conf
```

## 📱 微信开发者工具设置

### 1. 本地设置
1. 打开微信开发者工具
2. 项目设置 → 本地设置
3. ✅ **不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书检查**
4. ✅ **不校验安全域名、TLS 版本以及 HTTPS 证书检查**

### 2. 真机调试设置
如果需要在真机上测试：
1. 使用内网穿透工具获取HTTPS地址
2. 在微信公众平台配置合法域名
3. 或者使用微信开发者工具的预览功能

## 🧪 测试步骤

### 1. 测试后端接口

使用浏览器或curl测试接口：

```bash
# 测试验证码接口
curl http://localhost:8080/captchaImage

# 测试登录接口
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test","code":"1234","uuid":"test"}'
```

### 2. 测试小程序连接

1. 重新编译小程序
2. 查看连接状态指示器
3. 如果显示"连接正常"，说明配置成功
4. 如果显示"连接失败"，点击"重试连接"按钮

## 🔄 常见问题解决

### 问题1：端口被占用

```bash
# 查看端口占用
netstat -an | grep 8080

# 杀死占用进程
sudo kill -9 <PID>

# 或者使用其他端口
# 修改后端服务端口为8081
# 同时修改小程序配置中的端口
```

### 问题2：CORS错误

在后端添加CORS配置：

#### Spring Boot
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("*")
                .allowedHeaders("*");
    }
}
```

#### Node.js (Express)
```javascript
const cors = require('cors');
app.use(cors());
```

#### Python (Flask)
```python
from flask_cors import CORS
CORS(app)
```

### 问题3：网络超时

增加超时时间：

```javascript
// utils/config.js
network: {
  timeout: 30000, // 增加到30秒
  retryTimes: 5,  // 增加重试次数
  retryDelay: 2000 // 增加重试延迟
}
```

## 📞 获取帮助

### 1. 查看日志
- 后端服务日志
- 微信开发者工具控制台
- 网络请求面板

### 2. 调试工具
- **Postman**: API测试工具
- **Charles/Fiddler**: 网络代理工具
- **浏览器开发者工具**: 网络面板

### 3. 联系支持
如果问题仍然存在，请提供：
- 后端服务日志
- 网络请求详情
- 错误截图
- 系统环境信息

---

**配置状态**: 🔧 需要配置后端服务  
**最后更新**: 2024年7月21日  
**版本**: v1.0.0 