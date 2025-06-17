import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { extname, join } from "https://deno.land/std@0.208.0/path/mod.ts";

const __dirname = new URL(".", import.meta.url).pathname;
const localFileRoot = join(__dirname, "wave");
const port = 8000;

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
};

console.log(`Serving local files from ${localFileRoot} on http://localhost:${port}`);

serve(async (req: Request) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // 百度验证文件处理
  if (pathname === "/baidu_verify_codeva-ocVBwmPkny.html") {
    return new Response("9ac3e638e043cfa318e90de62d1ec326", { status: 200 });
  }

  // 检测并重定向带有 /wave 前缀的请求
  if (pathname.startsWith("/wave")) {
    // 计算新路径：移除/wave前缀
    let newPath = pathname.substring("/wave".length);
    
    // 处理特殊边界情况
    if (newPath === "") newPath = "/"; // /wave -> /
    if (newPath.startsWith("//")) newPath = newPath.substring(1); // 处理双斜杠问题
    
    // 构建新的URL
    const newUrl = new URL(req.url);
    newUrl.pathname = newPath;
    
    // 执行301永久重定向
    return Response.redirect(newUrl, 301);
  }

  // 文件服务处理（无/wave前缀）
  let filePath = decodeURIComponent(pathname);
  
  // 处理根路径
  if (filePath === "" || filePath === "/") {
    filePath = "/index.html";
  }

  // 构建完整文件路径
  let fullPath = join(localFileRoot, filePath);
  
  console.log("Requested path: " + pathname + ", serving file: " + fullPath);

  // 防止路径遍历攻击
  if (!fullPath.startsWith(localFileRoot)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const stat = await Deno.stat(fullPath);
    
    if (stat.isDirectory) {
      // 处理目录请求
      const indexPath = join(fullPath, "index.html");
      try {
        const indexStat = await Deno.stat(indexPath);
        if (indexStat.isFile) {
          const file = await Deno.open(indexPath, { read: true });
          const headers = new Headers({ "content-type": "text/html" });
          return new Response(file.readable, { headers });
        }
      } catch {
        // 忽略错误，继续返回404
      }
      return new Response("Directory Listing Not Supported", { status: 404 });
      
    } else if (stat.isFile) {
      // 处理文件请求
      const ext = extname(fullPath).toLowerCase();
      const contentType = mimeTypes[ext] || "application/octet-stream";

      const file = await Deno.open(fullPath, { read: true });
      const headers = new Headers({ "content-type": contentType });
      return new Response(file.readable, { headers });
    }
    
    return new Response("Not Found", { status: 404 });
    
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      // 尝试查找同名HTML文件
      const htmlPath = fullPath + ".html";
      try {
        const htmlStat = await Deno.stat(htmlPath);
        if (htmlStat.isFile) {
          const file = await Deno.open(htmlPath, { read: true });
          const headers = new Headers({ "content-type": "text/html" });
          return new Response(file.readable, { headers });
        }
      } catch {
        // 忽略错误，继续返回404
      }
      return new Response("Not Found", { status: 404 });
    }
    
    console.error("Error serving file:", e);
    return new Response("Internal Server Error", { status: 500 });
  }
}, { port });