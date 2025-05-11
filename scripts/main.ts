import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { extname, join, dirname } from "https://deno.land/std@0.208.0/path/mod.ts"; // 导入 dirname

// 获取当前文件所在的目录
const __dirname = new URL(".", import.meta.url).pathname;

// 本地文件服务的根目录
const localFileRoot = join(__dirname, "site", "wave");

// 端口号
const port = 8000;

// MIME 类型映射表
const mimeTypes: { [key: string]: string } = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".webp": "image/webp",
  // 添加更多你需要的 MIME 类型
};

console.log(`Serving local files from ${localFileRoot} or proxying to flowecho-site.deno.dev on http://localhost:${port}`);

serve(async (req: Request) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  console.log("pathname: " + pathname)

  // 检查路径是否以 "/wave/" 开头
  if (pathname.startsWith("/wave/")) {
    // 如果以 "/wave/" 开头，则提供本地文件
    let filePath = decodeURIComponent(pathname.substring("/wave".length)); // 移除 /wave 前缀

    // 处理根路径 "/" 的情况，默认提供 index.html
    if (filePath === "" || filePath === "/") {
      filePath = "/index.html";
    }

    // 构建完整的文件路径，相对于 localFileRoot
    let fullPath = join(localFileRoot, filePath);

    // 防止路径遍历攻击
    if (!fullPath.startsWith(localFileRoot)) {
      return new Response("Forbidden", { status: 403 });
    }

    try {
      // 尝试获取文件信息
      const stat = await Deno.stat(fullPath);

      if (stat.isDirectory) {
        // 如果请求的是一个目录，尝试提供目录下的 index.html
        const indexPath = join(fullPath, "index.html");
        try {
          const indexStat = await Deno.stat(indexPath);
          if (indexStat.isFile) {
            const file = await Deno.open(indexPath, { read: true });
            const headers = new Headers({
              "content-type": "text/html",
            });
            return new Response(file.readable, { headers });
          } else {
            // 如果目录中没有 index.html，返回 404
            return new Response("Directory Listing Not Supported", { status: 404 });
          }
        } catch (e) {
          // 如果获取 index.html 失败，返回 404
          if (e instanceof Deno.errors.NotFound) {
             return new Response("Directory Listing Not Supported", { status: 404 });
          }
          // 其他错误则返回 500
          console.error("Error serving directory index:", e);
          return new Response("Internal Server Error", { status: 500 });
        }

      } else if (stat.isFile) {
        // 如果请求的是一个文件
        const ext = extname(fullPath).toLowerCase();
        const contentType = mimeTypes[ext] || "application/octet-stream"; // 默认为二进制流

        const file = await Deno.open(fullPath, { read: true });
        const headers = new Headers({
          "content-type": contentType,
        });
        return new Response(file.readable, { headers });
      } else {
        // 如果既不是文件也不是目录（例如 symlink 但目标不存在）
        return new Response("Not Found", { status: 404 });
      }

    } catch (e) {
      // 捕获文件未找到的错误
      if (e instanceof Deno.errors.NotFound) {
        // 如果原始路径未找到，尝试查找同名的 .html 文件
        const htmlPath = fullPath + ".html";
        try {
          const htmlStat = await Deno.stat(htmlPath);
          if (htmlStat.isFile) {
            const file = await Deno.open(htmlPath, { read: true });
            const headers = new Headers({
              "content-type": "text/html", // 明确设置为 text/html
            });
            return new Response(file.readable, { headers });
          }
        } catch (eHtml) {
          // 如果查找 .html 文件也失败，继续返回 404
          if (!(eHtml instanceof Deno.errors.NotFound)) {
             console.error("Error serving potential .html file:", eHtml);
             return new Response("Internal Server Error", { status: 500 });
          }
        }

        // 如果原始路径和 .html 路径都未找到
        return new Response("Not Found", { status: 404 });
      }
      // 捕获其他可能的错误 (例如权限问题)
      console.error("Error serving file:", e);
      return new Response("Internal Server Error", { status: 500 });
    }
  } else {
    // 如果不以 "/wave/" 开头，则反向代理到 flowecho-site.deno.dev
    const proxyUrl = new URL(req.url);
    proxyUrl.host = "website-sage-two-36.vercel.app";
    proxyUrl.protocol = "https"; // 或者根据目标网站的协议设置

    // 复制原始请求的所有头部信息
    const headers = new Headers(req.headers);
    // 移除可能导致问题的头部，例如 host，fetch 会自动设置正确的 host
    headers.delete("host");

    try {
      const response = await fetch(proxyUrl.toString(), {
        method: req.method,
        headers: headers,
        body: req.body, // 传递请求体
        redirect: "manual", // 处理重定向，或者让 fetch 自动处理
      });

      // 复制代理响应的所有头部信息
      const responseHeaders = new Headers(response.headers);

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (e) {
      console.error("Error proxying request:", e);
      return new Response("Error communicating with the proxy target", { status: 500 });
    }
  }
}, { port });