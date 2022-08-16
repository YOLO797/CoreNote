---
title: webpack
order: 2
---

# webpack

### devServer

```js
// proxyTable 里配置 bypass
devServer: {
      https: false,
      host: "0.0.0.0",
      port: 9090,
      open: true, // opens browser window automatically
      proxy: {
        '/': {
          // target: process.env.API,
          target: 'https://172.16.120.111:443',
          secure: false,
          bypass: (req) => {
            if (req.headers.accept.indexOf('html') !== -1) {
              console.log("Skipping proxy for browser request.");
              return '/index.html'
            }
          }
        }
      }
    },
```
