## ⚡ ElectricPaymentSystem - 智能电力缴费系统

https://img.shields.io/badge/License-MIT-yellow.svg

https://img.shields.io/badge/Frontend-Vue.js-4fc08d.svg

https://img.shields.io/badge/Backend-Spring%2520Boot-6db33f.svg

https://img.shields.io/badge/WeChat-Mini%2520Program-07c160.svg

ElectricPaymentSystem 是一个现代化的、全栈式的电力缴费解决方案。它包含一个功能完善的管理网站和一个便捷的微信小程序，旨在为用户提供无缝、安全、高效的电力服务体验。

https://via.placeholder.com/800x400.png?text=System+Architecture+Diagram+Here
![Uploading 85f5afb4-1553-49c3-8cc3-5f5c0fcbf891.png…]()


✨ 核心特性
🌐 管理网站 (Web Portal)
仪表盘总览: 数据可视化大屏，实时显示用户增长、交易总额、缴费趋势等关键指标。

用户管理: 完善的用户CRUD操作，支持账户状态管理、用电档案查询。

账单管理: 自动生成月度账单，支持手动调整、发布和通知。

财务管理: 清晰的收入流水、对账报表，支持数据导出。

二级侧边栏导航: 采用清晰直观的多级导航设计，帮助管理员高效地在复杂的功能模块间切换。

💚 微信小程序 (WeChat Mini Program)
一键缴费: 绑定户号后，可快速查看当前欠费并安全支付（集成微信支付）。

账单历史: 按月查询历史用电量和缴费记录，数据图表化展示。

用电分析: 提供用电量趋势分析，帮助用户节能降耗。

消息推送: 账单提醒、缴费成功通知等通过微信服务消息即时送达。

在线客服: 集成客服功能，为用户提供及时帮助。

⚙️ 技术特色
RESTful API 设计: 前后端分离，接口规范清晰，易于扩展。

JWT 身份认证: 安全可靠的用户认证与授权机制。

数据加密: 敏感信息（如支付数据）全程加密传输与存储。

响应式设计: 管理网站适配PC、平板等多种设备。

🛠️ 技术栈
部分	技术选型
前端 (Web)	Vue 3 / Element-Plus / Pinia / ECharts / Axios
微信小程序	微信小程序原生框架 / WeUI / Vant Weapp
后端	Spring Boot 2.x / Spring Security / JWT
数据持久化	MySQL / MyBatis-Plus / Redis (缓存)
第三方服务	微信支付API / 微信消息推送
开发与部署	Docker / Nginx / Maven / Webpack
🚀 快速开始
前提条件
确保您的开发环境中已安装：

JDK 8+

Node.js 14+

MySQL 5.7+

Redis

Maven

微信开发者工具

安装与部署
克隆项目

bash
git clone https://github.com/your-username/ElectricPaymentSystem.git
cd ElectricPaymentSystem
后端配置与启动

bash
# 进入后端目录
cd backend

# 导入数据库脚本 (位于 `/backend/sql` 目录)
 修改 `application.yml` 中的数据库和Redis连接配置

# 打包并运行
mvn clean package
java -jar target/eps-backend-0.0.1-SNAPSHOT.jar
后端服务将在 http://localhost:8080 启动。

前端网站配置与启动

bash
# 进入前端网站目录
cd frontend-web

# 安装依赖
npm install

# 修改 `src/config/api.js` 中的后端API地址

# 启动开发服务器
npm run serve
管理网站将在 http://localhost:3000 启动。

微信小程序配置与启动

使用微信开发者工具打开 miniprogram 目录。

在开发者工具中，配置项目的 AppID（需要是小程序类目）。

修改 utils/config.js 文件中的后端API主机地址。

点击“编译”，即可在模拟器中预览小程序。

详细部署文档 (可链接到项目的Wiki页)
关于生产环境部署（Docker容器化、Nginx配置、HTTPS），请参阅 DEPLOYMENT.md。

📁 项目结构
text
ElectricPaymentSystem/
├── backend/                 # Spring Boot 后端项目
│   ├── src/
│   ├── sql/                # 数据库初始化脚本
│   └── pom.xml
├── frontend-web/            # Vue 管理后台项目
│   ├── public/
│   ├── src/
│   └── package.json
├── miniprogram/             # 微信小程序项目
│   ├── pages/
│   ├── utils/
│   └── app.json
└── docs/                    # 额外文档
🔧 配置说明
主要的配置文件位于各子项目的根目录下，启动前请务必根据您的环境进行修改：

后端: backend/src/main/resources/application.yml (数据库、Redis、JWT密钥、微信支付配置)

前端网站: frontend-web/.env.development 和 .env.production

小程序: miniprogram/utils/config.js

🤝 如何贡献
我们热烈欢迎任何形式的贡献！

Fork 本仓库

创建您的特性分支 (git checkout -b feature/AmazingFeature)

提交您的更改 (git commit -m 'Add some AmazingFeature')

推送到分支 (git push origin feature/AmazingFeature)

打开一个 Pull Request

贡献指南请参阅 CONTRIBUTING.md。

📄 许可证
本项目采用 MIT 许可证 - 查看 LICENSE 文件了解详情。

🧩 第三方许可
本项目使用了诸多优秀的开源库，感谢它们的作者。

Vue.js

Spring Boot

Element Plus



❓ 常见问题
Q: 如何获取微信小程序的 AppID 和支付配置？

A: 需要在微信公众平台注册小程序并申请微信支付商户号。详细流程请参考官方文档。

Q: 启动后端时报数据库连接错误？

A: 请确保您的MySQL服务已启动，并且 application.yml 中的用户名、密码和数据库名配置正确。

更多问题，请查看 FAQ.md 或提交 Issue。

📞 联系我们
项目负责人: 马诗敏

邮箱: 3130004661@example.com

项目链接: https://github.com/Msmsun/ElectricPaymentSystem

如果这个项目对您有帮助，请给我们一个 ⭐️ Star ！您的支持是我们持续更新的最大动力！

