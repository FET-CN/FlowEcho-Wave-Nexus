# 快速上手

!!! note
    此文档仍在施工中...

让我们从一个官方示例开始:
```python
import lvgl as lv
import lv_displayer # 屏幕驱动

scr = lv.obj() # 屏幕对象
btn = lv.button(scr) # 创建按钮
btn.align(lv.ALIGN.CENTER, 0, 0) # 使按钮居中
label = lv.label(btn)
label.set_text('Hello World!')
lv.screen_load(scr) # 设置Active Screen

lv.task_handler() # 刷新屏幕
```


