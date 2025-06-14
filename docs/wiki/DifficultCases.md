# 疑难杂症

!!! note
    此处会存放团队小伙伴在开发过程中遇到的问题与解决方案

## WSL-usbipd attach错误

> 该部分由 {{Frez79.name}} 提供

### 症状

环境：
```text
> wsl.exe --version
WSL 版本: 2.5.7.0
内核版本: 6.6.87.1-1
WSLg 版本: 1.0.66
MSRDC 版本: 1.2.6074
Direct3D 版本: 1.611.1-81528511
DXCore 版本: 10.0.26100.1-240331-1435.ge-release
Windows: 10.0.19044.5965

> usbipd --version
4.2.0+54.Branch.master.Sha.5b36605535dd52bc3d8a8e4bbaee7f4d480c86ad
```
> WSL已为当时的最新版


在usbipd下 尝试attach设备给WSL时 出现如下内容：
```text
PS **********> usbipd attach --wsl --busid 2-2
usbipd: info: Using WSL distribution 'mpython' to attach; the device will be available in all WSL 2 distributions.
usbipd: error: WSL kernel is not USBIP capable; update with 'wsl --update'.
```
### 解决方法
在WSL内运行：
```bash
modprobe vhci_hcd
```
> 出自：<https://github.com/microsoft/WSL/issues/12984#issuecomment-2915997740>

在此之前 我还尝试过：
- <https://www.kxxt.dev/blog/wsl-and-gpg-card/>