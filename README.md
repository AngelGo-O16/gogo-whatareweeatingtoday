# gogo今天吃什么 🌟

一只帮你做选择的美食推荐小天使！

## 项目简介

这是一个完整的"gogo今天吃什么"美食推荐网站，包含：

- 🐕 **可爱的前端界面** - 基于HTML/CSS/JavaScript的响应式设计
- 🧠 **智能记忆系统** - C++后端实现用户偏好学习
- 🔍 **图片爬虫** - 自动获取美食图片
- 🤖 **DeepSeek AI** - 智能推荐算法

## 项目结构

```
gogo今天吃什么/
├── index.html              # 主页面
├── style.css                # 样式文件
├── script.js                # 前端交互逻辑
├── gogo-backend/            # C++后端
│   ├── include/             # 头文件
│   ├── src/                 # 源代码
│   ├── data/                # 数据存储
│   ├── CMakeLists.txt       # CMake构建文件
│   └── README.md            # 后端说明文档
└── README.md                # 项目说明文档
```

## 快速开始

### 1. 启动后端服务

#### Windows系统

```bash
cd gogo-backend
mkdir build
cd build
cmake ..
cmake --build . --config Release
Release\gogo-backend.exe
```

#### Linux/Mac系统

```bash
cd gogo-backend
mkdir build
cd build
cmake ..
make
./gogo-backend
```

后端服务将在 `http://localhost:8080` 启动。

### 2. 启动前端

直接用浏览器打开 `index.html` 文件即可。

**注意**：如果后端未启动，前端会自动使用本地推荐数据作为备用。

## 功能特性

### ✅ 已实现

1. **美食推荐** - 输入想吃的食物，获取推荐
2. **记忆功能** - 记住用户的偏好和历史
3. **图片爬虫** - 自动获取美食图片
4. **智能上下文** - 根据历史对话提供个性化推荐
5. **本地备用** - 后端不可用时自动切换到本地数据

### 🔧 API接口

#### 获取推荐

```bash
POST http://localhost:8080/api/recommend
Content-Type: application/json

{
  "user_input": "火锅",
  "user_id": "user_123"
}
```

#### 获取用户记忆

```bash
GET http://localhost:8080/api/memory/{user_id}
```

#### 学习偏好

```bash
POST http://localhost:8080/api/learn
Content-Type: application/json

{
  "user_id": "user_123",
  "food": "火锅",
  "liked": true
}
```

#### 清除记忆

```bash
DELETE http://localhost:8080/api/memory/{user_id}
```

#### 健康检查

```bash
GET http://localhost:8080/api/health
```

## 配置说明

### DeepSeek API

后端已配置您的API Key：
- Key: `sk-60caee5f2f6148aabd968d24ac6b5e7b`
- 模型: `deepseek-chat`

### 图片API

推荐申请免费的Unsplash API Key：
1. 访问 https://unsplash.com/developers
2. 注册并创建应用
3. 获取Access Key
4. 修改 `gogo-backend/config.h` 中的 `UNSPLASH_ACCESS_KEY`

## 技术栈

### 前端
- HTML5
- CSS3 (响应式设计)
- JavaScript (ES6+)
- Google Fonts (马善政字体)

### 后端
- C++17
- CMake
- libcurl (HTTP请求)
- Windows Sockets / POSIX Sockets

### 数据存储
- JSON文件存储
- 内存缓存

## 开发说明

### 编译依赖

#### Windows
- Visual Studio 2017+ 或 MinGW
- CMake 3.10+
- Windows SDK

#### Linux
- GCC 7+ 或 Clang 5+
- CMake 3.10+
- libcurl开发包

#### 安装libcurl (Linux)

```bash
sudo apt-get install libcurl4-openssl-dev
```

#### 安装libcurl (macOS)

```bash
brew install curl
```

## 使用示例

1. **第一次使用**
   - 输入"火锅"
   - gogo会给出推荐并记住这次对话

2. **后续使用**
   - 输入"不知道吃什么"
   - gogo会根据记忆推荐类似"火锅"的食物

3. **查看记忆**
   - gogo会记住你喜欢的食物类型
   - 自动调整推荐策略

## 注意事项

⚠️ **重要提示**：
- 后端需要监听8080端口，确保端口未被占用
- API Key已硬编码，建议使用环境变量
- 图片爬虫遵守各网站的robots.txt规则
- 请勿过度请求API，避免触发限制

## 故障排查

### 问题1：后端启动失败

**检查项**：
- 端口8080是否被占用
- 是否安装了必要的编译工具

**解决方法**：
```bash
# Windows查看端口占用
netstat -ano | findstr 8080

# Linux查看端口占用
lsof -i :8080
```

### 问题2：API调用失败

**检查项**：
- DeepSeek API Key是否有效
- 网络连接是否正常

**解决方法**：
- 检查API Key配额
- 查看后端日志输出

### 问题3：图片无法加载

**检查项**：
- Unsplash API Key是否配置
- 网络连接是否正常

**解决方法**：
- 使用本地备用图片
- 配置有效的API Key

## 贡献指南

欢迎提交Issue和Pull Request！

## 许可证

MIT License

## 联系方式

如有问题，请联系开发者。

---

🐾 *gogo - 你的美食推荐小天使* 🐾