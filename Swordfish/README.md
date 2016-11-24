#Swordfish 剑鱼
检测网页死链，检测用户被劫持列表

#安装
在书签中添加 “网页监测” ，url中添加如下代码

	javascript:if(!document.getElementById("J_fish_header")){var s= document.createElement("script");s.src=(document.charset === 'UTF-8' ?"http://arenatech.hupu.com/swordfish/badlink.js":"http://arenatech.hupu.com/swordfish/badlink.gbk.js");document.body.appendChild(s)}else{var d = document.querySelector(".fish_main").style.display=='none'?'block':'none';var t= document.querySelector(".fish_main").style.display=d;}