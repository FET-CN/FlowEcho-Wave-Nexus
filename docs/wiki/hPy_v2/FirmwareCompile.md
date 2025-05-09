# hPy v2固件编译教程
## 环境信息
笔者所用环境为：

- Windows10 LTSC 21H2 x64
- WSL2(Ubuntu22.04)
- \[WSL内\]Python3(pip使用镜像源)
## 换源
### pypi
```bash
pip config set global.index-url https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple
```
### git
```bash
git config --global url."https://bgithub.xyz".insteadOf "https://github.com"
```
> 不可对Git镜像源进行push. 如需push 请恢复原有设置：
>
> `git config --global --unset url.https://bgithub.xyz.insteadof`
## 初次构建
1. 进入WSL clone hpy v2 固件仓库
```bash
git clone https://github.com/labplus-cn/mpython.git --recursive
```
2. 初始化espidf
> 如提示`/usr/bin/env: ‘python’: No such file or directory` 请安装`python`、`python-is-python3`与`python3-pip`
```bash
cd esp-idf
./install.sh
source ./export.sh
cd ..
```
3. 编译mpy-cross
```bash
cd micropython/mpy-cross
make
cd ../..
```
4. 编译固件
```bash
cd port
make
python ./release.py ./build/mpython/bootloader.bin ./build/mpython/partitions.bin ./build/mpython/application.bin Noto_Sans_CJK_SC_Light16.bin ./firmware.bin
```
5. 此时目录下的firmware.bin即为固件文件.

## 小技巧
### makeimg一步到位

在`/port/Makefile`中：
查找关键字`makeimg.py`定位到906line左右 替换此行为以下内容：
```bash
$(Q)$(PYTHON) release.py $^ Noto_Sans_CJK_SC_Light16.bin $@
```
此后make完成后的`/port/build/mpython/firmware.bin`可直接刷入hPy v2.(已嵌入字体)