"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const ROOT = __dirname;
const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const TYPES = {".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".webp":"image/webp",".ico":"image/x-icon",".json":"application/json; charset=utf-8"};
const server = http.createServer((req,res)=>{
  const url = new URL(req.url || "/", "http://localhost");
  if(req.method!=="GET"&&req.method!=="HEAD"){res.writeHead(405,{"Content-Type":"text/plain; charset=utf-8","Allow":"GET, HEAD"});return res.end("Method not allowed");}
  if(url.pathname==="/ready"||url.pathname==="/health"){res.writeHead(200,{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-store"});return res.end("ok");}
  let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{res.writeHead(400);return res.end("Bad request");}
  if(pathname==="/")pathname="/index.html";
  const target=path.resolve(ROOT,"."+pathname);
  if(target!==ROOT&&!target.startsWith(ROOT+path.sep)){res.writeHead(403);return res.end("Forbidden");}
  fs.stat(target,(err,stat)=>{
    if(err||!stat.isFile()){res.writeHead(404,{"Content-Type":"text/plain; charset=utf-8"});return res.end("Not found");}
    const ext=path.extname(target).toLowerCase();
    res.writeHead(200,{"Content-Type":TYPES[ext]||"application/octet-stream","X-Content-Type-Options":"nosniff","Referrer-Policy":"strict-origin-when-cross-origin","Cache-Control":ext===".html"?"no-cache":"public, max-age=3600"});
    if(req.method==="HEAD")return res.end();
    fs.createReadStream(target).pipe(res);
  });
});
server.listen(PORT,"0.0.0.0",()=>console.log(`STURN site listening on ${PORT}`));
