export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 跨域配置
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // === 1. 相册接口 (带密码验证) ===
    if (request.method === "GET" && url.pathname === "/album") {
      const key = url.searchParams.get("key");
      
      // 🚩【修改点 1】在这里设置你的管理员密码
      if (key !== "mypassword") { 
        return new Response(JSON.stringify({ error: "无权访问" }), { status: 403, headers: corsHeaders });
      }

      try {
        const { results } = await env.DB.prepare(
          "SELECT * FROM images ORDER BY created_at DESC LIMIT 100"
        ).all();
        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    // === 2. 上传接口 ===
    if (request.method === "POST") {
      try {
        const formData = await request.formData();
        const file = formData.get("file");
        if (!file) return new Response("No file", { status: 400, headers: corsHeaders });

        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const fileName = `${timestamp}_${randomString}_${file.name}`;
        
        // 写入 R2
        await env.MY_R2.put(fileName, file.stream(), { httpMetadata: { contentType: file.type } });

        // 🚩【修改点 2】在这里填你的 R2 访问域名 (注意保留最后的 /${fileName})
        const publicUrl = `https://r2.你的域名.com/${fileName}`;

        // 写入 D1 数据库
        try {
            await env.DB.prepare(
              "INSERT INTO images (url, filename, created_at) VALUES (?, ?, ?)"
            ).bind(publicUrl, file.name, timestamp).run();
        } catch (e) { console.error(e); }

        return new Response(JSON.stringify({ url: publicUrl }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
};
