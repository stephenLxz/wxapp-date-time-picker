# wxapp-date-time-picker

## 仿照微信小程序日期选择器，实现【日期时间选择器】

### 原理

通过半屏弹窗（mp-half-screen-dialog）结合picker_view进行日期、时间的选择，在选择时间后，【确定】按钮触发返回一个change事件，其中参数值为毫秒级时间戳。


### 组件参数
**1.弹窗的显隐：**
在组件的 *properties* 中传入一个 *show* 字段，用于控制弹窗的显隐；默认值为 **false**。
**2.开始时间，时间戳：**
毫秒级时间戳，非必填，默认为，距现在一年前的时间。
**3.结束时间，时间戳：**
毫秒级时间戳，非必填，默认为，距现在一年后的时间。

### 效果图

![在这里插入图片描述](https://img-blog.csdnimg.cn/903bf38e8b1c45f0b8d225885a184e88.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCx5piv5pyJ54K55oCV5oCV,size_10,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/3f3b148e260646fcb1d46088b0845000.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCx5piv5pyJ54K55oCV5oCV,size_10,color_FFFFFF,t_70,g_se,x_16)