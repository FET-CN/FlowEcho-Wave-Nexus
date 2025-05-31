# 关于LVGL.set_align/align

!!! note
    由{{Frez79.name}}编写 是掺入了个人理解的文档汉化

    随手一记 希望能帮到后来者。

## How2Use

> 此处align参数为对齐选项 详见下一栏目:`对齐选项`

假设你通过`lv.label()`等方式创建了一个命名为`lv_obj`的对象：
```python
lv_obj.set_align(align)
```
如果要更改对齐方式并设置对齐后的偏移值 可使用：
```python
lv_obj.align(align, offset_x, offset_y)
```
由于将子对象(此处为`obj2`)与其父对象的中心对齐是常用方式，因此存在一个专用函数：
```python
lv_obj.center(obj2)
```
上述代码等同于：
```python
lv_obj.align(lv.ALIGN_CENTER, 0, 0)
```
如果父对象的大小更改，则子对象的设置对齐方式和位置将自动更新。

上面介绍的函数将对象与其父对象对齐。


但也可以将对象与任意引用对象对齐:
```python
lv_obj.align_to(reference_obj, align, x, y)
```
除了上面的对齐选项外，还可以使用以下选项对齐外部的对象：


例如，要对齐按钮(`假设此处命名为btn`)上方的标签(`假设此处命名为label`)并使标签水平居中，请执行以下操作：
```python
label.align_to(btn, lv.ALIGN.OUT_TOP_MID, 0, -10)
```
与`lv_obj_align()`不同，`lv_obj_align_to()`不能在对象坐标或参考对象坐标发生变化时重新对齐对象。


## 对齐选项
![](https://lvgl.100ask.net/9.2/_images/align.png)
> via 100ask-百问网 <https://lvgl.100ask.net/9.2/widgets/obj.html>

实际对应对象为：`lv.ALIGN.[图中对应对象]`