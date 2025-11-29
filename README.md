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
