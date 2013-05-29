(function(window,undefined){

var

    version="1.0.0",

    doc=window.document,

    strundefinded=typeof undefined,

    modules=[],//已注册的模块
    mLoaded=[],//已经加载完成的模块
    mLoading=[],//正在加载的模块
    mLoadingActions=[],//回调列表

    Pa=function(anyOne){
        return new Pa.fn.init(anyOne);
    };

Pa.fn=Pa.prototype={

    pa:version,

    constructor:Pa,

    init:function(anyOne){
        this[0]=anyOne;//保存原始对象
        this.handler=[];//保存观察者
        return this;
    },

    //更新原始对象的方法
    // @val 要写入的新值
    // @i 可选，更新引用对象时用到的访问索引
    set:function(val,i){
        if(arguments.length===0){return this[0];}

        if(typeof i === strundefinded){
            this[0]=val;
        }else{
            this[0][i]=val;
        }

        this.fire("change");
    },

    //获取原始对象的一个深层副本
    get:function(){
        if (this[0] instanceof Object){
            var O=function(){};
            O.prototype=this[0];
            return new O();
        }else{
            return this[0];
        }
    },

    //注册观察者
    // @type 观察的事件类型
    // @fn 接受到通知时的回调函数
    on:function(type,fn){
        this.handler.push({type:type,fn:fn});
    },

    //注销观察者
    // @type 注销观察的事件类型
    // @fn 可选，要注销的特定的一个观察的回调函数
    off:function(type,fn){
        type=type||"change";

        var isOff=false,
            isSimple=typeof fn === strundefinded,
            _this=this;

        Pa.each(this.handler,function(handle,i){

            isOff = isSimple ?
                handle.type === type :
                (handle.type === type && handle.fn === fn);

            if(isOff){
                _this.handler.splice(i,1);
            }
        });
    },

    //发布事件
    // @type 发布事件的类型
    fire:function(type){
        var _this=this;

        Pa.each(this.handler,function(handle){
            if(handle.type === type){
                Pa.bind(handle.fn,_this)();
            }
        });
    }

};

Pa.fn.init.prototype = Pa.fn;

//遍历数组
// @arr 数组
// @fn 处理函数
//  | @arr[i] 当前遍历的元素
//  | @i 当前索引值
Pa.each=function(arr,fn){
    if(arr.length===0){return;}

    for(var i in arr){
        if(fn(arr[i],i)){return true;}
    }
};

//判断对象或数组中是否存在指定
//元素或属性
// @check 被检查的对象或数组
// @elm 指定的元素或属性名称
// @val 可选，指定属性的值
Pa.has=function(check,elm,val){
    if(check.constructor === Object){

        return (elm in check && check[elm] === val)?
            true:false;

    }else if(check.constructor === Array){

        var _rst=false;
        Pa.each(check,function(member){
            if(typeof val === strundefinded){
                if(member === elm){_rst=true;return true;}
            }else{
                if(Pa.has(member,elm,val)){_rst=true;return true;}
            }
        });
        return _rst;

    }
};

//将函数的执行环境绑定到给定的上下文
// @fn 要被绑定执行环境的函数
// @context 要绑定到的执行上下文
Pa.bind=function(fn,context){
    return function(){
        return fn.apply(context,arguments);
    };
};

Pa.log=function(what){
    var console=window.console;
    console.log(what);
};

//模块加载器
// @modList 数组，要加载的模块列表
// @callba 全部加载完成的回调函数
Pa.require=function(modList,callBack){
    modList=modList || [];
    callBack=callBack || function(){};

    var isComplete=true,//是否已经记载完成
        jsSelf = (function() {
            var files = doc.getElementsByTagName('script');
            return files[files.length - 1];
        })();

    this.each(modList,function(mod){
        if(!isLoad(mod)){
            loadMod(mod);
            isComplete=false;
        }
    });

    //如果已经加载完成则直接执行回调函数
    if(isComplete){callBack();return;}

    //检查模块是否已经加载或正在加载
    function isLoad(modName){
        var _arr=mLoaded.concat(mLoading);

        return Pa.has(_arr,modName);
    }

    function loadMod(modName){
            //获取模块对象
        var _mod=getMod(modName),
            //是js还是css
            _type="",
            //此模块依赖的模块
            _node=null,
            //是否可以加载主模块
            _return=false;

        //确定模块类型，如果模块未注册则返回
        if(_mod){
            _type=_mod.src.toLowerCase().split(/\./).pop().replace(/[\?#].*/,'');
        }else{
            return;
        }

        //判断依赖的模块是否都已加载
        //如果未加载则先并行加载依赖的模块
        _mod.require=_mod.require||[];
        Pa.each(_mod.require,function(mod){
            if(!isLoad(mod)){
                Pa.require([mod],function(){Pa.require([modName],callBack);},1);
                _return=true;
            }
        });
        if(_return){return;}

        //依赖模块已全部加载,设置加载状态
        mLoading.push(modName);
        Pa.each(mLoadingActions,function(action){
            //TODO
            //去重
            action=action;
        });
        mLoadingActions.push({ modules:modList,fn:callBack});

        if(_type==="css"){
            _node=doc.createElement('link');
            _node.setAttribute('type', 'text/css');
            _node.setAttribute('rel', 'stylesheet');
            _node.setAttribute('href', _mod.src);
        }else{
            _node = doc.createElement('script');
            _node.setAttribute('type', 'text/javascript');
            _node.setAttribute('src', _mod.src);
            _node.setAttribute('async', true);
        }
        _node.onload=_node.onReadyStateChange=function(){
            if(!this.readyState ||
                'loaded' === this.readyState ||
                'complete' === this.readyState){
                done();
                this.onload=this.onReadyStateChange=null;
            }
        };
        jsSelf.parentNode.insertBefore(_node, jsSelf);

        function done(){
            Pa.each(mLoading,function(mod,i){
                if(modName === mod){
                    mLoading.splice(i,1);
                    if(mLoaded.join("|").indexOf(modName)<0){
                        mLoaded.push(modName);
                    }
                    return true;
                }
            });
            Pa.each(mLoadingActions,function(action,i){
                var _i=i;
                Pa.each(action.modules,function(mod,i){
                    if(mod===modName){
                        action.modules.splice(i,1);
                        if(!action.modules.length){
                            mLoadingActions.splice(_i,1);
                            callBack();
                        }
                    }
                });
            });
        }

    }
    //通过模块名获得模块对象
    function getMod(modName){
        for(var i in modules){
            if(modName===modules[i].name){return modules[i];}
        }
        return null;
    }
};

//注册模块
//@mods  数组
//  |name:模块名称，区分大小写
//  |src:文件路径
//  |require:  数组，此模块依赖的模块
//  |   |模块名称
Pa.reg=function(mods){
    Pa.each(mods,function(mod){
        if(!Pa.has(modules,"name",mod.name)){
            modules.push(mod);
        }
    });
};

window.Pa=window._=Pa;

})(window);
