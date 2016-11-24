void function(){
	var allLinksData = {};
	var allLinks = [];
	var allCount = 0;
	var server = "http://192.168.9.29:9000";
	var origin = {
		w1: '//w1.hoopchina.com.cn/hybrid/static/bbs/detail/img/good_1_3767477.png',
		w2: '//w2.hoopchina.com.cn/hybrid/static/bbs/detail/img/good_1_3767477.png',
		w3: '//w3.hoopchina.com.cn/hybrid/static/bbs/detail/img/good_1_3767477.png',
		w4: '//w4.hoopchina.com.cn/hybrid/static/bbs/detail/img/good_1_3767477.png',
		w10: '//w10.hoopchina.com.cn/hybrid/static/bbs/detail/img/good_1_3767477.png',
		b1: '//b1.hoopchina.com.cn/image/post/smile/crazy.gif',
		b2: '//b2.hoopchina.com.cn/image/post/smile/crazy.gif',
		b3: '//b3.hoopchina.com.cn/image/post/smile/crazy.gif',
		b4: '//b4.hoopchina.com.cn/image/post/smile/crazy.gif',
		b10: '//b10.hoopchina.com.cn/image/post/smile/crazy.gif'
	};
	var hiReport = {};

	var badLink = {
		reset: function(){
			this.showFinish = false
			this.badIndex = 0;
			var self = this;
			var allAElements = document.querySelectorAll("a");
			//获得全部a的合法href
			allAElements.forEach(function(item, idx){
				var href = item.getAttribute("href");
				if(self.checkLink(href)){
					allLinks.push({url: self.withURL(href), index: idx});
					allLinksData[`href${idx}`] = {
						status: 200,
						href: self.withURL(href),
						ele: item,
						index: idx
					}
				}
			});
			allCount = allLinks.length;
		},
		init: function(){
			if(document.getElementById("J_fish_header")) return;
			this.reset();
			this.render();
			this.bindEvent();
		},
		bindEvent: function(){
			var self = this;

			this.$btnUse.addEventListener("click", this.start.bind(this));
			this.$btnHijack.addEventListener("click", this.startHijack.bind(this));

			this.$404Link.addEventListener("click", function(e){
				var evt = e || window.event;
				var target = evt.target || evt.srcElement;

				if(target.tagName == 'SPAN' && target.getAttribute("data-index")){
					var index = target.getAttribute("data-index");
					var ele = allLinksData[`href${index}`].ele;
					ele.scrollIntoView(true);
					ele.className += " flash_red"
					target.parentNode.removeChild(target);
				}
			});

			this.$302Link.addEventListener("click", function(e){
				var evt = e || window.event;
				var target = evt.target || evt.srcElement;

				if(target.tagName == 'SPAN' && target.getAttribute("data-index")){
					var index = target.getAttribute("data-index");
					var ele = allLinksData[`href${index}`].ele;
					ele.className += " flash_yellow";
					ele.scrollIntoView(true);
					target.parentNode.removeChild(target);
				}
			});

			this.$404Num.addEventListener("click", function(e){
				var childs = self.$404Link.querySelectorAll("span");
				childs.forEach(function(child){
					var index = child.getAttribute("data-index");
					var ele = allLinksData[`href${index}`].ele;
					ele.className += " flash_red";
					child.parentNode.removeChild(child);
				});
				self.$errorShow404.style.display = 'none';
			});

			this.$302Num.addEventListener("click", function(e){
				var childs = self.$302Link.querySelectorAll("span");
				childs.forEach(function(child){
					var index = child.getAttribute("data-index");
					var ele = allLinksData[`href${index}`].ele;
					ele.className += " flash_yellow";
					child.parentNode.removeChild(child);
				});
				self.$errorShow302.style.display = 'none';
			});
		},
		startHijack: function(){
			var protocol = location.protocol === "https:" ? "https:" : "http:"
			var self = this;
			hiReport = {};
			this.hiIndex = 0;
			this.hiMax = 0;

			this.$fishTip.style.display = "none";
			this.showLoading();
			for(var key in origin){
				this.hiMax ++

				(function(point){
					self.loadRes(protocol + origin[point], function(){
						hiReport[point] = "pass";
						self.listenFinish();
					}, function(){
						hiReport[point] = "fail";
						self.listenFinish();
					})
				})(key)
			}

		},
		listenFinish: function(){
			this.hiIndex ++;
			this.updateLoading( (this.hiIndex / this.hiMax).toFixed(2) * 100 );
			if(this.hiIndex === this.hiMax){
				this.hideLoading();
				this.showReport("hijack");
			}
		},
		loadRes: function(src, suc, fail){
			var img = document.createElement("img");
			img.onload = suc;
			img.onerror = fail;
			img.src = `${src}?t=${Date.now()}`;
		},
		start: function(){
			if(!allLinks.length){
				this.reset();
			}
			this.showLoading();
			this.$fishTip.style.display = "block";

			var step = 20;
			while(step > 0){
				this.checkQueue();
				step--
			}
		},
		withURL: function(url){
			if(url.indexOf("/") === 0){
				return window.location.origin + url
			}
			return url
		},
		createStyle: function(){
			var style = `.fish_main{width:300px;position:fixed;top:20px;right:20px;z-index:100000;background:rgba(0,0,0,.7);border:1px solid #ccc;padding:10px;border-radius:5px;border-width:1px;border-style:solid;border-color:rgba(0,0,0,.8);border-image:initial;text-align:left !important;}
.fish_header{height:35px;text-align:right}
.fish_btn{height:26px;font-size:12px;cursor:pointer;box-shadow:#272727 0 1px 1px;text-shadow:#000 0 1px 1px;padding:0 10px;background:-webkit-linear-gradient(top,#606060 1%,#424242 100%);border-radius:5px;border-width:1px;border-style:solid;border-color:#151515;border-image:initial;color:#aaa;white-space:nowrap;margin:0 5px}
.fish_loading_container{display:none;overflow:hidden;margin:30px 20px;border-radius:9px;}
.fish_loading{height:18px;border-radius:14px;background:#ccc}
.fish_progress-bar{position:relative;overflow:hidden;margin-top: -1px;height: 20px;width:30%;border-radius:inherit;background:#27ae60;display:inline-block;background-color:#777;border-radius:9px;box-shadow:0 1px 0 hsla(0,0%,100%,.5) inset;-webkit-transition:width .4s ease-in-out;transition:width .4s ease-in-out;background-size:30px 30px;background-image:-webkit-gradient(linear,left top,right bottom,color-stop(.25,rgba(255,255,255,.15)),color-stop(.25,transparent),color-stop(.5,transparent),color-stop(.5,rgba(255,255,255,.15)),color-stop(.75,rgba(255,255,255,.15)),color-stop(.75,transparent),to(transparent));background-image:-webkit-linear-gradient(135deg,hsla(0,0%,100%,.15) 25%,transparent 25%,transparent 50%,hsla(0,0%,100%,.15) 50%,hsla(0,0%,100%,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(135deg,hsla(0,0%,100%,.15) 25%,transparent 25%,transparent 50%,hsla(0,0%,100%,.15) 50%,hsla(0,0%,100%,.15) 75%,transparent 75%,transparent);-webkit-animation:animate-stripes 3s linear infinite;-moz-animation:animate-stripes 3s linear infinite}
@-webkit-keyframes animate-stripes{0%{background-position:0 0}
to{background-position:60px 0}
}
.fish_progress-stripes{margin-top:-50px;width:inherit;height:inherit;letter-spacing:-14px;font-weight:700;font-size:180px}
.fish_percentage{position:absolute;top:4px;right:5px;font-weight:700;font-size:12px}
.fish_loading_text{text-align:center;color:#fff;line-height:30px;margin-top:8px}.fish_content{color:#fff;font-size:14px;display:none;}.fish_content b{color: #a41f24;}
.fish_error_list{height: 60px;line-height:20px;overflow:hidden;}
.fish_error_list span{text-decoration:underline;color:#fff;display:block;line-height: 20px;padding-left:20px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
#fish_hijack_content span{padding:4px;}
.flash_red{-webkit-animation:flash_red .2s infinite ease-in-out}
.flash_yellow{-webkit-animation:flash_yellow .2s infinite ease-in-out}
@-webkit-keyframes flash_red{0%{background-color:rgba(255,0,0,0)}
100%{background-color:rgba(255,0,0,1)}
}
@keyframes flash_red{0%{background-color:rgba(255,0,0,0)}
100%{background-color:rgba(255,0,0,1)}
}
@-webkit-keyframes flash_yellow{0%{background-color:rgba(255,255,0,0)}
100%{background-color:rgba(255,255,0,1)}
}
@keyframes flash_yellow{0%{background-color:rgba(255,255,0,0)}
100%{background-color:rgba(255,255,0,1)}
}`;
				var eleStyle = document.createElement("style");
				eleStyle.innerHTML = style;
				document.body.appendChild(eleStyle);
		},
		createHtml: function(){
			var html = `<div class="fish_header" id="J_fish_header">
							<button id="J_fish_no_use" class="fish_btn">死链检测</button>
							<button id="J_fish_hijack" class="fish_btn">检查劫持</button>
						</div>
						<div class="fish_loading_container" id="J_loading">
							<div class="fish_loading">
								<div class="fish_progress-bar" style="width: 0%">
									<div class="fish_progress-stripes"></div>
									<div class="fish_percentage">0%</div>
								</div>

							</div>
							<div class="fish_loading_text"></div>
						</div>
						<div id="fish_tip" style="border:1px solid #666;padding:5px;color:#fff;font-size:14px;display:none;">
							<span style="background-color:rgba(205, 237, 139, .6);">绿色</span> :可以正常访问的链接<br />
							<span style="background-color:rgba(255, 26, 0, .9)">红色</span> :链接不可访问或链接已更改<br />
							<span style="background-color:yellow;color: #000;">黄色</span> :点击链接会有跳转
						</div>
						<div id="fish_hijack_content" style="display:none;">
							<div class="fish_error">
								<p style="color:#d4d4d4" class="fish_hijack_link"></p>
							</div>
						</div>
						<div class="fish_content" id="J_fish_list">
							<div class="fish_error fish_error_404_container">
								<p>404错误链接数：<b class="fish_404_num">0</b>个</p>
								<div class="fish_error_list fish_error_404">
								</div>
							</div>
							<div class="fish_error fish_error_302_container">
								<p>302跳转链接: <b class="fish_302_num">0</b>个</p>
								<div class="fish_error_list fish_error_302">
								</div>
							</div>
						</div>`;
			 var fish = document.createElement("div");
			 fish.className = "fish_main";
			 fish.innerHTML = html;
			 document.body.appendChild(fish);
		},
		render: function(){
			this.createStyle();
			this.createHtml();

			this.$btnUse = document.getElementById("J_fish_no_use");
			this.$btnHijack = document.getElementById("J_fish_hijack");
			this.$loading = document.getElementById("J_loading");
			this.$List = document.getElementById("J_fish_list");
			this.$fishTip = document.getElementById("fish_tip");
			this.$hijackContent = document.getElementById("fish_hijack_content");
			this.$processBar = this.$loading.querySelector(".fish_progress-bar");
			this.$process = this.$loading.querySelector(".fish_percentage");
			this.$processText = this.$loading.querySelector(".fish_loading_text");

			this.$errorShow404 = this.$List.querySelector(".fish_error_404_container");
			this.$errorShow302 = this.$List.querySelector(".fish_error_302_container");
			this.$404Num = this.$List.querySelector(".fish_404_num");
			this.$302Num = this.$List.querySelector(".fish_302_num");
			this.$404Link = this.$List.querySelector(".fish_error_404");
			this.$302Link = this.$List.querySelector(".fish_error_302");

			this.$hijackLink = this.$hijackContent.querySelector(".fish_hijack_link");
		},
		//校验链接合法性
		checkLink: function(url){
			if (/^(javas|#)/.test(url) || !url) return false
			return true
		},
		//检测链接是否死链
		serverCheck: function(url){
			return fetch(`${server}?url=${url}&t=${Date.now()}`, {
		          mode: 'cors',
		          redirect: 'follow'
		      }).then(function(res){
		      	 return res.json()
		      })
		},
		checkQueue: function(){
			var current = allLinks.shift();
			var self = this;
			if(current && current.url){
				this.updateLoading();
				this.serverCheck(encodeURIComponent(current.url)).then(function(res){
					if(res.code != 200){
						allLinksData[`href${current.index}`].status = res.code;
					}
					self.badIndex ++;
					self.checkQueue();
					self.showColor(allLinksData[`href${current.index}`])
				})
			} else{
				if(!this.showFinish && this.badIndex === allCount) this.finish();
			}
		},
		getProcess: function(){
			return ((allCount - allLinks.length) / allCount).toFixed(2);
		},
		showLoading: function(){
			this.$btnUse.style.display = "none";
			this.$btnHijack.style.display = "none";
			this.$loading.style.display = "block";

			this.$List.style.display = "none";
			this.$404Link.textContent = "";
			this.$302Link.textContent = "";
			this.$hijackContent.style.cssText = "display:none";
		},
		updateLoading: function( pro ){
			var process = pro || this.getProcess() * 100 | 0;

			this.$processBar.style.width = process + "%";
			this.$process.textContent = process + "%";

			if(process < 20){
				this.$process.textContent = "";
				this.$processText.textContent = "正在扫描问题..."
			}
			if(process > 20 && process <= 80){
				this.$processText.textContent = "问题检测中..."
			}
			if(process > 80 && process < 100){
				this.$processText.textContent = "检测完成！正在生成报告..."
			}
			if(process == 100){
				this.$processText.textContent = "报告生成完毕！稍后自动跳转报告."
			}
		},
		hideLoading: function(){
			this.$btnUse.style.display = "";
			this.$btnHijack.style.display = "";
			this.$loading.style.display = "none";

			this.updateLoading("0");
		},
		finish: function(){
			this.showFinish = true;
			this.hideLoading();
			this.showReport("badlink");
		},
		showColor: function(item){
			if(item.status == 200){
				item.ele.style.cssText = "background-color:rgba(205, 237, 139, .6)"
			} else if(item.status == 302 || item.status == 301){
				item.ele.style.cssText = "background-color:yellow"
			} else if(item.status == 404){
				item.ele.style.cssText = "background-color:rgba(255, 26, 0, .9)"
			}
		},
		//检测报告
		showReport: function(type){
			if(type === "badlink"){
				var   eroor404 = 0,
					  eroor302 = 0,
				    linkAdd404 = [],
				    linkAdd302 = [];

				this.$List.style.display = "block";

				for(var item in allLinksData) {
					if(allLinksData[item].status == 404) {
						eroor404 += 1;
					  linkAdd404.push(allLinksData[item]);
					}
					if(allLinksData[item].status == 302 || allLinksData[item].status == 301) {
						eroor302 += 1;
					  linkAdd302.push(allLinksData[item]);
					}
				}

				//存在404链接
				if(linkAdd404.length) {
					this.$errorShow404.style.display = "block";
					for(var i=0;i<linkAdd404.length;i++) {
						var span = document.createElement("span");
						  span.setAttribute("data-index", linkAdd404[i].index);
						  span.innerText = linkAdd404[i].href;
						  this.$404Link.appendChild(span);
					}
				}else{
					this.$errorShow404.style.display = "none";
				}

				//存在302跳转链接
				if(linkAdd302.length) {
					this.$errorShow302.style.display = "block";
					for(var i=0;i<linkAdd302.length;i++) {
						var span = document.createElement("span");
						span.setAttribute("data-index", linkAdd302[i].index);
					    span.innerText = linkAdd302[i].href;
					    this.$302Link.appendChild(span);
					}
				}else{
					this.$errorShow302.style.display = "none";
				}

				//没有错误链接
				if(!linkAdd404.length && !linkAdd302.length) {
					var p = document.createElement("p");
					p.innerText = "恭喜，您要检测的网页很健康，没有发现错误链接";
					this.$List.appendChild(p);
				}
				this.$404Num.textContent = eroor404;
				this.$302Num.textContent = eroor302;

			} else{
				//劫持报告
				this.$hijackLink.textContent = "";
				this.$hijackContent.style.display = "block";
				var arr = [];
				for(var item in hiReport) {
					if(hiReport[item] == "fail") {
						arr.push(item);
					}
				}

				if(arr.length){
					this.$hijackLink.textContent = "您的网络可能被劫持，请切换网络再访问";
				}else{
					this.$hijackLink.textContent = "恭喜，暂时没有发现您被劫持!";
				}
			}
		}
	}

	badLink.init();
}()
