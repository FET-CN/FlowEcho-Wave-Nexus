# 集成调试器

!!! note
	由 {{Frez79.name}} 撰写

## 前置
掌握hPy v2固件编译技能.
建议使用VSCode编辑器
对应教程：[hPy v2 固件编译教程](./FirmwareCompile.md)
## 注
- 由于microPython的特殊性 此处将使用[Github@bobveringa/mpdb](https://github.com/bobveringa/mpdb/)作为调试器
- 如配置文件中未定义需要开关的项 那么请直接略过该项
## 启用settrace
在`micropython/py/mpconfig.h`/`micropython/mpy-cross/mpconfigport.h`中

- 启用以下项目：
	- **MICROPY_PY_SYS_SETTRACE**
	- **MICROPY_PERSISTENT_CODE_SAVE**
- 禁用以下项目：
	- MICROPY_COMP_CONST
## 移除MICROPY_PERSISTENT_CODE_SAVE平台限制
在`micropython/py/persisentcode.c`中

- 替换`defined(__i386__) || defined(__x86_64__) || defined(_WIN32) || defined(__unix__)`为`1`
## 修改分区表
在`port/partitions.cdv`中

- 修改`factory`的大小为`0x190000`
## 集成调试器
在`port/boards/mpython/modules`下

- 将`https://github.com/bobveringa/mpdb/blob/master/src/mpdb.py`的内容下载至该文件夹的`mpdb.py`文件内
## 完整编译
```bash
cd micropython/mpy-cross
make clean
make
cd ../../port
make clean
make
```