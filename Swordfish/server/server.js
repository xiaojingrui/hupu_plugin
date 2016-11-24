var url = require("url"),
	http = require("http"),
	https = require("https"),
	whites = {
		'bbs.hupu.com':'class="t_tips"',
		'voice.hupu.com':'errorText',
	        'www.kaluli.com':'aw-404-wrap'
	},
	port = 9000;

function isHupuDomain(address){
	var options = url.parse(address);
	var inWhite = false;
	for(var host in whites){
		if(~options.host.indexOf(host)){
			inWhite = true
		}
	}
	return inWhite
}

function getURLStatus(address, callback){
	var handler = /^http:/.test(address) ? http : https;

	if(isHupuDomain(address)){
		var host = url.parse(address).host
		if(~host.indexOf(":")){
			host = host.substr(0, host.indexOf(":"))
		}
		var kw = whites[host];

		handler.get(address, function(res){
		  //论坛404不返回404status
		  if(res.statusCode ==  200){
		  	var body = '';

		  	res.on("data", function(chunk){ body += chunk })
		  	res.on("end", function(){
		  		if(~body.indexOf(kw)){
		  			callback(404);
		  		} else{
		  			callback(res.statusCode);
		  		}
		  	})
		  } else{
		  	callback(res.statusCode);
		  }
		}).on('error', function(e){
		  callback(e)
		});
	} else{
		handler.get(address, function(res){
		  callback(res.statusCode);
		}).on('error', function(e){
		  callback(e)
		});
	}
}

function isURL(url){
	return /^(http:|https:)\/\//i.test(url);
}

function paramUrl(address, key){
	var query = url.parse(address).query + '';
	var params = {};
	query.split("&").forEach(function(item){
		var data = item.split("=")
		params[data[0]] = data[1]
	})
	return params
}

http.createServer(function(req, res){
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
   res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
   res.setHeader("Content-Type", "application/json;charset=utf-8");

   if(req.url != '/favicon.ico'){
	   var params = paramUrl(req.url);
	   var address = decodeURIComponent(params["url"])
	   console.log(address)
           
           if(isURL(address)){
	     getURLStatus(address, function(statusCode){
	   		var body = {};
	   		if(typeof statusCode == 'number'){
		   		body.code = statusCode;
		   	}else{
		   		body.code = 404
		   	}
		   	res.end(JSON.stringify(body, null, 2));
	     });
           } else{
              res.end('{"code":404}');
           }
	   //超时自动返回
	   //setTimeout(function(){
   	   //  res.end('{"code":404}');
	   //}, 20000);
   } else{
   	  res.end('{}');
   }

}).listen(port, function(){
	console.log("server listen at : " + port);
});