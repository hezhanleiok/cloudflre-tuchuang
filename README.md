# XIAOHE.IMG - Cloudflare 私人图床

基于 Cloudflare Workers + R2 + D1 构建的高性能、免费私人图床。
支持黑金极简 UI、图片拖拽上传、多格式链接生成、本地相册记录及管理员后台查看。

## 🛠️ 准备工作

1.  **Cloudflare R2：** 创建存储桶，并绑定自定义域名。
2.  **Cloudflare D1：** 创建数据库（建议命名 `img_db`）。
3.  **Cloudflare Workers：** 创建一个 Worker 服务。

## 🚀 部署步骤

### 1. 初始化数据库
进入 D1 数据库后台，点击 **Console (控制台)** 标签，直接粘贴并执行以下 SQL 代码：

```sql
CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    filename TEXT,
    created_at INTEGER
);
```

### 2. 部署后端 (Worker)
1.  在 Worker 设置 -> 变量中，添加绑定：
    * 变量名：`MY_R2` -> 选择你的 R2 存储桶
    * 变量名：`DB` -> 选择你的 D1 数据库
2.  将 `worker.js` 的内容复制到 Worker 编辑器。
3.  **🚩 修改代码第 21 行：** 设置你的管理员查看密码。
4.  **🚩 修改代码第 53 行：** 填入你的 R2 访问域名（例如 `https://r2.example.com/`）。
5.  点击部署。

### 3. 部署前端 (Pages)
1.  打开 `index.html`。
2.  **🚩 修改代码第 332 行：** 填入你上一步部署好的 Worker 服务域名。
3.  将 `index.html` 上传到 Cloudflare Pages 或 GitHub Pages。

## ✨ 使用说明
* **普通用户：** 上传后可在“我的相册”查看自己本机的上传记录（基于浏览器缓存）。
* **管理员：** 在“我的相册”页面底部点击“管理员入口”，输入密码即可查看全站所有图片。
