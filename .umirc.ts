import { defineConfig } from 'dumi';
import { join } from 'path';

export default defineConfig({
  title: 'CoreNote',
  mode: 'site',
  favicon: 'http://www.deadly-exception.icu:8999/img/arknights_logo.png',
  logo: 'http://www.deadly-exception.icu:8999/img/arknights_logo.png',
  outputPath: 'docs-dist',
  locales: [
    ['zh-CN', '中文'],
    ['en-US', 'English'],
  ],
  publicPath: process.env.NODE_ENV === 'production' ? '/note/' : '/note/',
  base: process.env.NODE_ENV === 'production' ? '/note/' : '/note/',
  navs: {
    'en-US': [
      null, // null 值代表保留约定式生成的导航，只做增量配置
      { title: 'GitHub', path: 'https://github.com/Igarashi-Chiduru' },
      { title: 'Gitee', path: 'https://gitee.com/igarashi/core-note' },
    ],
    'zh-CN': [
      null,
      { title: 'GitHub', path: 'https://github.com/Igarashi-Chiduru' },
      { title: 'Gitee', path: 'https://gitee.com/igarashi/core-note' },
    ],
  },
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      },
    ],
  ],
  scripts: ['https://v1.cnzz.com/z_stat.php?id=1278653578&web_id=1278653578'],
  analytics: {
    ga: 'google analytics code',
  },
  styles: ['a[title=站长统计] { display: none; }'],
  exportStatic: {},
  sitemap: {
    hostname: 'https://d.umijs.org',
  },
  metas: [
    {
      name: 'description',
      content: '有人出生在罗马，而我出生是牛马',
    },
  ],
  alias: {
    'cp-ui': join(__dirname, 'src'),
  },
  // more config: https://d.umijs.org/config
});
