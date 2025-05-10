# 如何为该站点添砖加瓦？

## 1. 环境配置

> 本教程默认读者使用Win10及以上系统且有充足的 存储/ram空间

### 1.0 网络配置

> 如果你不受GFW的限制 可以畅通无阻地访问Github/pypi等站点 请跳过此部分

在中国大陆内 通过非国外渠道接入中国网络的用户上网都会受到一定程度的 来自GFW 的干扰

因此 我们需要配置一些工具来绕过GFW的干扰

#### 1.0.1 Dev-SideCar

下载链接：<https://github.com/docmirror/dev-sidecar/releases>
卸载与恢复：<https://github.com/docmirror/dev-sidecar/blob/master/doc/recover.md>

#### 1.0.2 使用镜像源

```bash
git config --global url."https://bgithub.xyz".insteadOf "https://github.com"
```
> 不可对Git镜像源进行push. 如需push 请恢复原有设置：
>
> `git config --global --unset url.https://bgithub.xyz.insteadof`

#### 1.0.3 科学上网

此方法不便描述 请自行搜索.
> Gxxk(笔者)留：是的 这一块只是为了让你知道有这么一个方法在这

### 1.1 Git/Github配置

#### 1.1.1 Github注册

请参考官方文档：<https://docs.github.com/zh/get-started/start-your-journey/creating-an-account-on-github>

### 1.1.2 安装Github Desktop

> GitHub Desktop 是一个图形化界面工具 它整合了Git 可以帮助我们更方便地管理Github仓库

> 笔者不太建议新手直接使用Git 除非你十分熟悉命令行操作

1. 访问<https://desktop.github.com/download/> 点击图中包含`Download`字样的白色按钮以下载
2. 运行下载下来的文件 在经过非常短的安装后将会弹出如下界面：
    ![](/images/how2contribute/ghdesktop_welcomeui.webp)
3. 点击`Sign in to Github.com` 在新打开的浏览器网页中 点击`Continue`
    ![](/images/how2contribute/gh_selectuser.webp)
4. 在跳转到的授权页面中 点击`Authorize desktop`按钮
    ![](/images/how2contribute/gh_auth.webp)
5. 此时授权完成 回到`Github Desktop` 会进入如下图所示的界面 勾选`Use my`开头的选项后再点击蓝色`Finish`按钮即可
    ![](/images/how2contribute/ghdesktop_config.webp)

### 1.2 Python/mkdocs环境配置

> Python 是一个跨平台的开源编程语言 它的官方版本是免费的

> 笔者建议使用工具uv配置Python

1. 打开Powershell 执行以下命令：
    ```powershell
    powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    ```
    - 当然 你也可以这么做:
    ```powershell
    winget install --id=astral-sh.uv  -e
    ```
2. 打开Github Desktop 点击左侧`Clone`开头的按钮 在新弹出的窗口中选择`URL`
    第一栏输入`https://github.com/FET-CN/FlowEcho-Wave-Nexus.git`
    第二栏点击右侧`Choose`按钮以选择一个你希望存放仓库的文件夹
    ![](/images/how2contribute/ghdesktop_clone.webp)
    最后点击Clone 等待下图界面出现
    ![](/images/how2contribute/ghdesktop_repo_main.webp)
3. 在上一步最后显示的窗口里按下 <kbd>Ctrl</kbd>+<kbd>`</kbd> 打开终端 输入以下命令：
    ```powershell
    uv venv
    .venv\Scripts\activate
    uv sync
    ```
## 2. 文档编写

### 2.1 文档格式

该站点内容采用Markdown格式编写 学习Markdown可参考：

- <https://markdown.com.cn/>
- <https://www.runoob.com/markdown/md-tutorial.html>

### 2.2 文档分类

- `wiki` 知识库: 位于`docs/wiki`目录下 多带有教程性质
- `blog` 博客: 位于`docs/blog`目录下 多带有记录/随笔性质

> 目前其余分类暂不对外开放贡献权限.

### 2.3 放置图片

除不可抗因素 该站点所有图片应均使用webp/svg格式存储于`docs/images`

每篇文章如有包含图片的 都应在`docs/images`内创建文件夹并将图片放入其中

文件夹/文件 的命名非必要不使用 非ASCII字符/特殊字符/汉语拼音
### 2.4 [wiki]将文章加入导航栏

> 请先学习YAML(.yml文件格式)：<https://www.runoob.com/w3cnote/yaml-intro.html>

打开根目录下的`mkdocs.yml`文件 搜索`nav:` 定位到导航栏部分.

找到`知识库`一栏 在最后方追加你希望加入的文章 例：
```yaml
  - 知识库:
      - wiki/index.md
      - HandPy V2:
        - 固件编译: "wiki/HandPy_V2/FirmwareCompile.md"
        - MicroPython 1.12 QSTR 文档翻译: "wiki/HandPy_V2/Docs_QSTR.md"
        - 集成调试器: "wiki/HandPy_V2/IntegratedDebugger.md"
      - 如何为该站点添砖加瓦？: "wiki/How2Contribute.md"
      - 你需要添加的文章在导航栏内的标题: "wiki/你需要添加的文章在导航栏内的路径.md"
      - "wiki/不指定标题也是可以的.md"
```

创建分类同理.

> 需要注意的是 所有填写的路径均以`/docs`为根目录 也就是说 路径内应省去`/docs/`

### 2.5 [blog]创建作者信息

> 请先学习YAML(.yml文件格式)：<https://www.runoob.com/w3cnote/yaml-intro.html>

打开`/docs/blog/.authors.yml` 在最后方追加内容 格式如下：
```yaml
    作者名(ID标记):
        name: 作者名字
        description: 作者介绍
        avatar: 作者头像(这里填URL)
        url: https://can1425.flowecho.org   # Author website URL
```
如该项不填写 请注释该项(或删掉)

> 目前笔者(Gxxk)还没读懂字段`slug`的作用 有知道的可以在评论区说说吗