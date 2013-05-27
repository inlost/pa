(function(window,undefined){

var

    version="1.0.1",

    doc=window.document,

    modules=[
        {name:"unitTest",src:"../test/pa_test.js",require:["Qunit"]},

        {name:"Qunit",src:"../libs/qunit/qunit.js",require:["jQuery","Qunit_style"]},
        {name:"Qunit_style",src:"../libs/qunit/qunit.css"},

        {name:"jQuery",src:"../libs/jquery/jQuery.js"}
    ],
    mLoaded=[],mLoading=[],mLoadingActions=[],

    pa=function(anyOne){
        return new pa.fn.init(anyOne);
    };

pa.fn=pa.prototype={

    pa:version,

    constructor:pa,

    init:function(anyOne){
        this[0]=anyOne;
        return this;
    },

    on:function(){
        
    },

    off:function(){
        
    }

};

pa.fn.init.prototype = pa.fn;

pa.each=function(arr,fn){
    if(arr.length===0){return;}
    for(var i in arr){
        fn(arr[i],i);
    }
};

pa.debug=function(what){
    var console=window.console;
    console.log(what);
};

pa.require=function(modList,callBack){
    modList=modList || [];
    callBack=callBack || function(){};

    var isComplete=true,
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

    if(isComplete){callBack();}

    function isLoad(modName){
        var _arr=mLoaded.concat(mLoading),
            _isLoad=false;
        pa.each(_arr,function(mod){
            if(mod===modName){_isLoad=true;return;}
        });
        return _isLoad;
    }
    function loadMod(modName){
        var _mod=getMod(modName),
            _type="",
            _node=null,
            _return=false;

        if(_mod){
            _type=_mod.src.toLowerCase().split(/\./).pop().replace(/[\?#].*/,'');
        }else{
            return;
        }

        _mod.require=_mod.require||[];
        pa.each(_mod.require,function(mod){
            if(!isLoad(mod)){
                pa.require([mod],function(){pa.require([modName],callBack);},1);
                _return=true;
            }
        });
        if(_return){return;}

        mLoading.push(modName);
        pa.each(mLoadingActions,function(action){
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
            pa.each(mLoading,function(mod,i){
                if(modName === mod){
                    mLoading.splice(i,1);
                    if(mLoaded.join("|").indexOf(modName)){
                        mLoaded.push(modName);
                    }
                }
            });
            pa.each(mLoadingActions,function(action,i){
                var _i=i;
                pa.each(action.modules,function(mod,i){
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
    function getMod(modName){
        for(var i in modules){
            if(modName===modules[i].name){return modules[i];}
        }
        return null;
    }
};

window.pa=window._=pa;

})(window);
