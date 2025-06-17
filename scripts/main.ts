import { serve as v } from "https://deno.land/std@0.208.0/http/server.ts";
import { extname as x, join as j } from "https://deno.land/std@0.208.0/path/mod.ts";

const LOL = new URL(".", import.meta.url).pathname;

const ABC = j(LOL, "wave");

const door = 8000;

const bag: { [z: string]: string } = {
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

console.log(`Serving local files from ${ABC} on http://localhost:${door}`);

v(async (r: Request) => {
  const u = new URL(r.url);
  let pp = u.pathname;

  if (pp === "/baidu_verify_codeva-ocVBwmPkny.html") {
    return new Response("9ac3e638e043cfa318e90de62d1ec326", { status: 200 });
  }

  if (pp.startsWith("/wave/")) {
    pp = pp.substring("/wave".length);
  }

  if (pp === "" || pp === "/") {
    pp = "/index.html";
  }

  let dd = decodeURIComponent(pp);

  let F = j(ABC, dd);

  console.log("pathname: " + u.pathname + ", local file: " + F);

  if (!F.startsWith(ABC)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const s = await Deno.stat(F);
    if (s.isDirectory) {
      const Z = j(F, "index.html");
      try {
        const ii = await Deno.stat(Z);
        if (ii.isFile) {
          const o = await Deno.open(Z, { read: true });
          const rh = new Headers({
            "content-type": "text/html",
          });
          return new Response(o.readable, { headers: rh });
        } else {
          return new Response("Directory Listing Not Supported", { status: 404 });
        }
      } catch (e) {
        if (e instanceof Deno.errors.NotFound) {
          return new Response("Directory Listing Not Supported", { status: 404 });
        }
        console.error("Error serving directory index:", e);
        return new Response("Internal Server Error", { status: 500 });
      }

    } else if (s.isFile) {
      const ex = x(F).toLowerCase();
      const ct = bag[ex] || "application/octet-stream";

      const fh = await Deno.open(F, { read: true });
      const hh = new Headers({
        "content-type": ct,
      });
      return new Response(fh.readable, { headers: hh });
    } else {
      return new Response("Not Found", { status: 404 });
    }

  } catch (ek) {
    if (ek instanceof Deno.errors.NotFound) {
      const hp = F + ".html";
      try {
        const H = await Deno.stat(hp);
        if (H.isFile) {
          const hf = await Deno.open(hp, { read: true });
          const hhd = new Headers({
            "content-type": "text/html",
          });
          return new Response(hf.readable, { headers: hhd });
        }
      } catch (he) {
        if (!(he instanceof Deno.errors.NotFound)) {
          console.error("Error serving potential .html file:", he);
          return new Response("Internal Server Error", { status: 500 });
        }
      }

      return new Response("Not Found", { status: 404 });
    }
    console.error("Error serving file:", ek);
    return new Response("Internal Server Error", { status: 500 });
  }
}, { port: door });
