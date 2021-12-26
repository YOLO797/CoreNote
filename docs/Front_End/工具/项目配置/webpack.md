---
title: webpack
order: 2
---

# webpack 打包

##

## devServer

### proxy

proxyTable 里配置 bypass

    proxy: {
      "/api": {
        target: "http://localhost:3000",
        bypass: function(req, res, proxyOptions) {
          if (req.headers.accept.indexOf("html") !== -1) {
            console.log("Skipping proxy for browser request.");
            return "/index.html";
          }
        }
      }
    }
