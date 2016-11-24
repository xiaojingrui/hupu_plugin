void function(){
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
	}

	var hijack = {
		init: function(){
			var protocol = location.protocol === "https:" ? "https:" : "http:"
			var self = this;

			this.report = {};
			this.index = 0;
			this.max = 0;

			for(var key in origin){
				this.max ++

				(function(point){
					self.loadRes(protocol + origin[point], function(){
						self.report[point] = "pass";
						self.listenFinish();
					}, function(){
						self.report[point] = "fail";
						self.listenFinish();
					})
				})(key)
			}

		},
		listenFinish: function(){
			this.index ++;
			console.log(this.report)
			if(this.index === this.max){
				this.showReport();
			}
		},
		loadRes: function(src, suc, fail){
			var img = document.createElement("img");
			img.onload = suc;
			img.onerror = fail;
			img.src = `${src}?t=${Date.now()}`;
		},
		showReport: function(){
		//	console.log(this.report)
		}
	}

	hijack.init();
}()