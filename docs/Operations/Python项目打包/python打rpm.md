---
title: Python项目打RPM包
order: 1

group:
  title: 打包
  order: 21
---

# python 打 rpm 包

## 1. 环境

`rpm` 从 `4.5x` 以上的版本将 **rpmbuild** 默认工作路径移动到 `/root/rpmbuild` 目录

```
$HOME/rpmbuild
```

推荐打包时尽量不用 `root` 账户操作（防止执行些不可挽回的命令）

环境：

- **CentOS Linux release 7.5.1804** (`Core`)
- **RPM** `version 4.11.3`

如果想发布 `rpm` 格式的源码包或者是二进制包，就要使用 `rpm` 最新打包工具: **rpmbuild**

### 1.1 安装工具

- 安装 `rpmbuild`

  ```shell
  yum install -y rpm-build
  ```

- 也可以安装 `rpmdevtools`

  ```shell
  yum install -y rpmdevtools
  ```

- `Python` 的编译打包工具是 **setuptools**

### 1.2 建立环境

建立一个打包环境，也就是目录树的建立，一般是在 `~/rpmbuild` 目录下建立 `5` 个目录。分别是：（_不用自己创建，下文有命令_）

- `BUILD`：目录用来存放打包过程中的源文件，就是来源于 `SOURCE`

- `SOURCE` ：用来存放打包是要用到的源文件和 `patch`，主要是一些 `tar` 包

- `SPEC`：用来存放 `spec` 文件

- `SRPM`：存放打包生成的 `rpm` 格式的源文件

- `RPM`：二进制文件

## 2. 打包入门

### 2.1 SPEC 阶段与目录的对应关系

阶段 读取的目录 写入的目录 具体动作

%prep %\_sourcedir %\_builddir 读取位于 %\_sourcedir 目录的源代码和 patch 。之后，解压源代码至 %\_builddir 的子目录并应用所有 patch。

%build %\_builddir %\_builddir 编译位于 %\_builddir 构建目录下的文件。通过执行类似 ./configure && make 的命令实现。

%install %\_builddir %\_buildrootdir 读取位于 %\_builddir 构建目录下的文件并将其安装至 %\_buildrootdir 目录。这些文件就是用户安装 RPM 后，最终得到的文件。注意一个奇怪的地方: 最终安装目录 不是 构建目录。通过执行类似 make install 的命令实现。

%check %\_builddir %\_builddir 检查软件是否正常运行。通过执行类似 make test 的命令实现。很多软件包都不需要此步。

bin %\_buildrootdir %\_rpmdir 读取位于 %\_buildrootdir 最终安装目录下的文件，以便最终在 %\_rpmdir 目录下创建 RPM 包。在该目录下，不同架构的 RPM 包会分别保存至不同子目录， noarch 目录保存适用于所有架构的 RPM 包。这些 RPM 文件就是用户最终安装的 RPM 包。

src %\_sourcedir %\_srcrpmdir 创建源码 RPM 包（简称 SRPM，以.src.rpm 作为后缀名），并保存至 %\_srcrpmdir 目录。SRPM 包通常用于审核和升级软件包。

### 2.2 工具使用

rpmbuild 命令使用一套标准化的「工作空间」 ，生成 %\_topdir 工作目录 ~/rpmbuild，以及配置文件 ~/.rpmmacros：

    rpmdev-setuptree

rpmdev-setuptree 这个命令就是安装 rpmdevtools 带来的。可以看到运行了这个命令之后，在 $HOME 家目录下多了一个叫做 rpmbuild 的文件夹，
里边内容如下：

    tree rpmbuild
    rpmbuild
    ├── BUILD
    ├── RPMS
    ├── SOURCES
    ├── SPECS
    └── SRPMS

rpmdev-setuptree 命令在当前用户 home/rpmbuild 目录里自动建立上述目录。（省着自己创建了）

如果没有安装 rpmdevtools 的话，其实用 mkdir 命令创建这些文件夹也是可以的:

    mkdir -p /root/rpmbuild/{BUILD,RPMS,SOURCES,SPECS,SRPMS}

### 2.3 生成 SPEC 文件

最最最重要的 SPEC 文件，命名格式一般是“软件名-版本.spec”的形式，将其拷贝到 SPECS 目录下。

可以将 SPEC 文件理解为 rpmbuild 实用程序用来构建 RPM 的配方。通过在一系列部分中定义指令来向构建系统提供必要的信息。

如果系统有 rpmdevtools 工具，可以用 rpmdev-newspec -o name.spec 命令来生成 SPEC 文件的模板，然后进行修改：

### 2.4 示例文件：

```shell
Name:       hello-world
Version:    1
Release:    1
Summary:    Most simple RPM package
License:    FIXME

%description
This is my first RPM package, which does nothing.

%prep
# we have no source, so nothing here

%build
cat > hello-world.sh <<EOF
#!/usr/bin/bash
echo Hello world
EOF

%install
mkdir -p %{buildroot}/usr/bin/
install -m 755 hello-world.sh %{buildroot}/usr/bin/hello-world.sh

%files
/usr/bin/hello-world.sh

%changelog
# let's skip this for now
```

### 2.5 打包命令 rpmbuild

用于生成包

```shell
-bp 只解压源码及应用补丁
-bc 只进行编译
-bi 只进行安装到%{buildroot}
-bb 只生成二进制 rpm 包
-bs 只生成源码 rpm 包
-ba 生成二进制 rpm 包和源码 rpm 包
--target 指定生成 rpm 包的平台，默认会生成 i686 和 x86_64 的 rpm 包，但一般我只需要 x86_64 的 rpm 包
```

这里执行 - [完全打包]：

```shell
rpmbuild -ba hello-world.spec   // rpmbuild -ba 软件名-版本.spec
```

软件包制作完成后可用 rpm 命令查询，看看效果。如果不满意的话可以再次修改软件包描述文件，重新运行以上命令产生新的 RPM 软件包。

```shell
rpmbuild tree *RPMS
```

[注]：将所有用于生成 rpm 包的源代码、 shell 脚本、配置文件都拷贝到 SOURCES 目录里，注意通常情况下源码的压缩格式都为 \*.tar.gz 格式。

## 3. 准备用来打包的软件

### 3.1 准备打包的源代码

开发人员通常将软件作为源代码的压缩存档进行分发，然后将其用于创建软件包。RPM 打包程序可使用现成的源代码存档。

软件应随软件许可证一起分发

创建一个 **LICENSE** 文件，并确保它包含以下内容

```shell
cat /tmp/LICENSE
```

将源代码和许可放到 /root/rpmbuild/SOURCES/ 目录下， 然后执行压缩命令

    tar -cvzf 项目名-版本号.tar.gz 文件名（目录）

    如：
        tar -cvzf pello-0.1.2.tar.gz pello-0.1.2
        pello-0.1.2 /
        pello-0.1.2 / LICENSE
        pello-0.1.2 / pello.py

## 4. 打包软件

### 4.1 什么是 RPM

RPM 软件包是一个包含其他文件及其元数据（有关系统所需文件的信息）的文件。

具体来说，RPM 软件包由 cpio 归档文件组成。

该 cpio 压缩文件包含：

- Files # 档案
- RPM header # RPM 标头（程序包元数据）

该 rpm 软件包管理器使用这种元数据来确定的依赖，在那里安装文件和其他信息。

### 4.2 RPM 类型

- 源码包 - `SRPM`：包含源代码和 `SPEC` 文件，该文件描述了如何将源代码构建为二进制的 `RPM`，可选，包括对源代码的补丁

- 二进制 - `RPM`：二进制 `RPM` 包含从源代码和补丁构建的二进制文件

- 列出 `RPM` 打包工具的实用程序

  ```shell
  rpm -ql rpmdevtools | grep bin
  ```
