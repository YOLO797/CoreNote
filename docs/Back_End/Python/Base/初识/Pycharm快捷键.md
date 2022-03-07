---
title: Pycharm 快捷键
order: 7
---

快捷键：
Help - Keymap Reference
注意热键占用

    shift + F6 可以批量的快速重命名（不会影响上下函数同名的命名，只把调用此变量的地方进行修改）
    shift + ctrl + N 快速查找文件名

如何用 SFTP 将项目导入 linux 虚拟机并自动更新：
工具 -> Deployment -> configuration -> 配置 host 虚拟机地址 -> port 端口默认 22 -> 输入用户名和密码 -> path 则为项目路径
-> Mappings 中配置/ -> 测试连接（通了即可，不通看是否配错，防火墙等） -> 最后勾选 Automatic 自动上传。

    注：若出现 Permission denied 许可被拒绝 则应该是文件所属者不对，需要chown -R ubuntu:ubuntu 项目地址 递归修改所有所属组
        若本地项目是直接上传的（原来linux中没有）需要 git init 初始化.git 之后复制其他项目下的.git config文件 修改 url。

子类继承抽象类生成方法快捷键：
Ctrl + o
