title: 网页检查工具
speaker: 余鸿飞<yuhongfei@hupu.com>
url: #
transition: move
theme: colors

[slide]
# 网页检查工具 {:&.flexbox.vleft}
#### 部门：arena-研发部
#### 演讲者：余鸿飞<yuhongfei@hupu.com>

[slide]
# 演讲大纲
----
* 工具介绍
* 工具实现
* 市面工具对比

[slide data-transition="vertical3d"]
# 工具介绍 {:&.flexbox.vleft}
* 死链检测工具
	* 检查页面404链接
	* 原理爬虫抓取网页链接，获取http状态码
	* 展示提醒用户
* 域名劫持

[slide data-transition="vertical3d"]
![工具效果图](/1.png "工具效果图") 

[slide]
# 工具安装
* 在chrome书签中添加 “网页监测” ，url中添加如下代码

<pre><code class="javascript">javascript:if(!document.getElementById("J_fish_header")){var s= document.createElement("script");s.src=(document.charset === 'UTF-8' ?"http://arenatech.hupu.com/swordfish/badlink.js":"http://arenatech.hupu.com/swordfish/badlink.gbk.js");document.body.appendChild(s)}else{var d = document.querySelector(".fish_main").style.display=='none'?'block':'none';var t= document.querySelector(".fish_main").style.display=d;}</code></pre>

[slide]
# 工具实现 {:&.flexbox.vleft}
* 前端页面注入JS, 有较好的用户体验
* 测试机部署爬虫JS, node服务，轻量稳定

[slide]
# 与其他死链工具对比 {:&.flexbox.vleft}
* 特殊404页面，可定制
* 提升检查死链的体验, 马上安装，马上使用, 所见即所得.
* 独立服务，轻松定制（后续可以定制扫描全站死链. 生成页面死链报告.）

[slide]
# 域名劫持工具
* 原理为检测特定域名下的资源是否可以访问
* 隐藏上报，提示用户

[slide data-transition="vertical3d"]
# 谢谢大家
# Q & A


