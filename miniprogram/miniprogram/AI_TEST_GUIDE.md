# AI功能测试指南

## 🧪 测试步骤

### 1. 重新编译小程序
1. 在微信开发者工具中点击"编译"按钮
2. 等待编译完成
3. 确保没有编译错误

### 2. 检查页面注册
确认 `app.json` 中已添加AI页面：
```json
{
  "pages": [
    "pages/login/login",
    "pages/register/register", 
    "pages/index/index",
    "pages/user/user",
    "pages/payment/payment",
    "pages/bill/bill",
    "pages/statistics/statistics",
    "pages/plusage/plusage",
    "pages/profile/profile",
    "pages/admin/admin",
    "pages/ai/ai"  // 确保这一行存在
  ]
}
```

### 3. 测试导航
1. 登录小程序
2. 在首页点击"AI助手"板块
3. 查看控制台输出，应该看到：
   ```
   === AI Navigation Debug ===
   Navigating to AI page
   AI path from config: /pages/ai/ai
   Config pages object: {...}
   Attempting navigation to: /pages/ai/ai
   ```

### 4. 验证AI页面加载
如果导航成功，应该看到：
```
=== AI Page Loaded ===
AI page loaded successfully
=== AI Page Shown ===
AI page shown
Token found, AI page ready
```

### 5. 测试AI对话功能
1. 在AI页面输入问题，如"帮我分析用电情况"
2. 点击发送按钮
3. 查看控制台输出：
   ```
   === Send Message ===
   Input text: 帮我分析用电情况
   === Mock AI Response ===
   Using mock AI response for: 帮我分析用电情况
   Mock response generated: <b>📊 用电情况分析</b><br><br>...
   === Add Message ===
   Adding message: { sender: 'ai', type: 'html', textLength: 1234 }
   Message added, total messages: 2
   ```

## 🔍 故障排除

### 问题1：点击AI助手显示"功能开发中"
**可能原因**：
- AI页面未在 `app.json` 中注册
- 页面路径配置错误
- 页面文件缺失

**解决方案**：
1. 检查 `app.json` 中的页面注册
2. 确认 `pages/ai/` 目录下有所有文件
3. 重新编译小程序

### 问题2：AI页面加载失败
**可能原因**：
- JavaScript语法错误
- 文件路径错误
- 依赖模块缺失

**解决方案**：
1. 查看控制台错误信息
2. 检查AI页面的JavaScript文件
3. 确认所有依赖模块存在

### 问题3：AI对话无响应
**可能原因**：
- 事件绑定错误
- 数据绑定问题
- 逻辑错误

**解决方案**：
1. 查看控制台日志
2. 检查事件绑定
3. 验证数据流

## 📱 预期结果

### 成功情况
1. **页面导航**：点击AI助手成功跳转到AI页面
2. **界面显示**：看到聊天界面和欢迎消息
3. **交互功能**：可以输入问题并获得AI回复
4. **快捷功能**：底部快捷按钮可以正常使用

### 界面元素
- 顶部标题："AI智能助手"
- 欢迎消息和快捷建议
- 输入框和发送按钮
- 底部快捷功能按钮
- 消息气泡显示

### 功能验证
- ✅ 输入问题并发送
- ✅ 收到AI智能回复
- ✅ 点击快捷建议
- ✅ 使用底部快捷功能
- ✅ 消息自动滚动
- ✅ 加载动画显示

## 🎯 测试用例

### 测试用例1：基本对话
1. 输入："你好"
2. 预期：收到AI欢迎回复

### 测试用例2：用电分析
1. 输入："帮我分析用电情况"
2. 预期：收到详细的用电分析报告

### 测试用例3：节能建议
1. 点击快捷建议："如何节省电费？"
2. 预期：收到节能建议列表

### 测试用例4：快捷功能
1. 点击底部"用电趋势"按钮
2. 预期：自动发送用电趋势分析请求

## 📊 性能检查

### 加载性能
- 页面加载时间 < 2秒
- 消息响应时间 < 1秒
- 滚动流畅无卡顿

### 内存使用
- 消息历史不会无限增长
- 页面切换正常
- 无内存泄漏

### 用户体验
- 输入框响应及时
- 按钮点击有反馈
- 动画流畅自然

## 🚀 部署确认

如果所有测试都通过，说明AI功能已成功部署：

✅ **页面注册** - AI页面已在app.json中注册
✅ **导航功能** - 首页可以正常跳转到AI页面  
✅ **界面显示** - AI聊天界面正常显示
✅ **对话功能** - 可以正常与AI对话
✅ **快捷功能** - 快捷按钮和建议功能正常
✅ **错误处理** - 网络错误时有降级处理

AI功能现在已经完全可用！ 