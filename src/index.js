'use strict';
(function(window){
    var methods={};
    window.jsNavtiveBridge={
        statics:{
            status:{
                READY:'ready'
            }
        },
        data:{},
        $init:function(callback){
            document.addEventListener('WebViewJavascriptBridgeReady',function(event){
                var bridge = event.bridge;
                bridge.init(function (data,responseCallback) {
                });
                bridge.registerHandler('receiveMessage',window.imeBridge.receiveMessage.bind(this));
                window.imeBridge.data.bridge=bridge;
                this.$sendMessage('setData',JSON.stringify({status:this.statics.status.READY}));
                if(typeof callback=='function')callback();
            }.bind(this),false);
            if(window.JavaScriptInterface!=null){
                this.$sendMessage('setData',JSON.stringify({status:this.statics.status.READY}));
                if(typeof callback=='function')callback();
            }
        },
        receiveMessage:function(param){
            try{
                var data=JSON.parse(param);
                if(data.method!=null){
                    if(typeof methods[data.method]=='function'){
                        methods[data.method](data.data);
                        return;
                    }
                }
                //todo:调用默认处理函数

            }
            catch(e){}
        },
        $sendMessage:function(method,data,callback){
            var param={
                method:method,
                data:data
            };
            var JavaScriptInterface=window.JavaScriptInterface;
            if(JavaScriptInterface!=null&&typeof JavaScriptInterface.send=='function'){
                var result=JavaScriptInterface.send(JSON.stringify(param));
                if(typeof callback=='function')callback(result);
            }
            else{
                var bridge=window.imeBridge.data.bridge;
                if(bridge!=null&&typeof bridge.send=='function'){
                    bridge.send(JSON.stringify(param),function(result){
                        if(typeof callback=='function')callback(result);
                    });
                }
            }
        },
        $addMethod:function(key,func){
            methods[key]=func;
        }
    };
})(window);
