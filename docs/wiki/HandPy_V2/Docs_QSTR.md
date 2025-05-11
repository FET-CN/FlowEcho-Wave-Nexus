# MicroPython 1.12 QSTR 文档翻译

!!! note
	由 {{Frez79.name}} 撰写

> 原文 `interning`本意为 实习 此处译为驻留.

---
mPy使用字符串驻留来节省ram/rom.

它能够避免同一字符串多个副本存储造成的空间浪费

它主要适用于代码中的标识符 因为函数/变量名极有可能在代码中多次出现

在mPy中 驻留的字符串被称为QSTR(uniQue STRing 即唯一字符串)

QSTR 值（类型为 `qstr`）是 QSTR 池链表的索引。

QSTR 存储其长度和内容的哈希值，以便在去重过程中进行快速比较。所有使用字符串的字节码操作都使用 QSTR 参数

## 编译时的QSTR生成
---
在 MicroPython 的 C 代码中，任何应在最终固件中驻留的字符串都写为 `MP_QSTR_Foo`。

在编译时，这将被替换成一个 `qstr` 值，指向 QSTR 池中的 `"Foo"` 索引

`Makefile`其中的三步是实现QSTR的关键 三步如下：

1. 查找代码中所有的`MP_QSTR_Foo`标记
2. 生成一个静态 QSTR 池，包含所有字符串数据（包括长度和哈希值）。
3. 将所有 `MP_QSTR_Foo` 替换为相应的索引。

生成时将会从以下两个方面搜索`MP_QSTR_Foo` ：

1. `$(SRC_QSTR)` 中引用的所有文件。这包括所有 C 代码（即 `py`、`extmod`、`ports/stm32`）但不包括第三方代码如 `lib`。
2. 额外的 `$(QSTR_GLOBAL_DEPENDENCIES)`（包括 `mpconfig*.h`）。

*Note:* 由 `mpy-tool.py` 生成的 `frozen_mpy.c` 有自己单独的 QSTR生成内容/池

一些不能用 `MP_QSTR_Foo` 此类语法表达的附加字符串（例如包含非字母数字字符的字符串）通过 `$(QSTR_DEFS)` 变量显式提供在 `qstrdefs.h` 和 `qstrdefsport.h` 中。

处理过程分为以下几个阶段：

1. `qstr.i.last` 是将每个输入文件通过 C 预处理器后连接的结果
	这意味着任何被条件禁用的代码将被移除，宏将被展开。
	这意味着我们不会将不会在最终固件中使用的字符串添加到池中。因为在这个阶段（由于 `QSTR_GEN_EXTRA_CFLAGS` 添加的 `NO_QSTR` 宏）没有 `MP_QSTR_Foo` 的定义，它将不受影响地通过这个阶段。
	此文件还包括预处理器添加的包含行号信息的注释。
	Note: 这一步只使用自上次编译以来已更改的文件，这意味着 `qstr.i.last` 将只包含自上次编译以来已更改的文件的数据。
2. `qstr.split` 是在对 qstr.i.last 运行 `makeqstrdefs.py split` 后创建的空文件。
	它仅用于指示该步骤已运行。
	 `genhdr/qstr/...file.c.qstr`将把每个输入进来的C文件输出到一个文件内，其中仅包含匹配的 QSTR。
	 每个 QSTR 作为 `Q(Foo)` 打印。
	 这一步是必要的，以将现有文件与从 `qstr.i.last` 中的增量更新生成的新数据组合。
3. `qstrdefs.collected.h` 是使用 `makeqstrdefs.py cat` 连接 `genhdr/qstr/*` 的输出。
	此时该输出是代码中找到的所有 `MP_QSTR_Foo` 的完整集合，并格式化为每行一个 `Q(Foo)`，包含重复项。
	仅当 qstr 集合发生变化时，此文件才会更新。
	QSTR 数据的哈希被写入另一个文件（`qstrdefs.collected.h.hash`），以允许跨构建跟踪更改。
4. `qstrdefs.preprocessed.h` 添加了 `qstrdefs*` 中的 QSTR。
	它连接 `qstrdefs.collected.h` 和 `qstrdefs*.h`，然后将每一行从 `Q(Foo)` 转换为 `"Q(Foo)"`，以便它们通过预处理器时不变。
	然后使用C预处理器处理 `qstrdefs*.h` 中的任何条件编译。然后将转换撤销回 `Q(Foo)`，并保存为 `qstrdefs.preprocessed.h`。
5. `qstrdefs.generated.h` 是 `makeqstrdata.py` 的输出。
	对于 qstrdefs.preprocessed.h 中的每个 `Q(Foo)`（以及一些额外的硬编码项），它输出 `QDEF(MP_QSTR_Foo, (const byte*)"hash" "Foo")`。

然后在主编译中，使用 `qstrdefs.generated.h` 发生两件事：

1. 在 qstr.h 中，`QDEF`将被枚举/处理，这使得 `MP_QSTR_Foo` 可用于代码，并等于该字符串在 QSTR 表中的索引。
2. 在 qstr.c 中，实际的 QSTR 数据表作为 `mp_qstr_const_pool->qstrs` 的元素生成。

## 运行时的QSTR生成
---
运行时可以创建额外的QSTR池 以便向其中添加字符串
```python
foo[x]=3
```
这将会为`x`的值创建一个`QSTR` 以便其能被`"load attr" bytecode`使用
> `"load attr" bytecode`原意为`"加载属性" 字节码`

此外 在编译Py代码时 标识符/字面量 都需要创建`QSTR`.

- Note:字面量长度≤10的才会变成`QSTR`
	这是因为堆上的普通字符串总是至少占用16bytes(即1GC block的大小)
	而 QSTR 却使其能够更高效的打包进qstr池中.

QSTR 池（以及底层存储字符串数据“块”）在堆上将会以一个最小的初始大小按需分配