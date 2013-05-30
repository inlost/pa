# Pa

Pa是一个前端模块依赖管理和加载,数据驱动开发的前端类库，压缩后仅2.6k。可能灵活的组织开发中的JS/CSS模块文件和他们之间的依赖关系。核心由Loader和Watcher组成。

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/inlost/pa/master/dist/Pa.min.js
[max]: https://raw.github.com/inlost/pa/master/dist/Pa.js

In your web page:

```html
<script src="dist/Pa.min.js"></script>
<script>
Pa.reg([{name:"modules",src:"../src/modules.js"}]);
Pa.require(["modules"],function(){
	Pa.require(["jQuery","testStyle"],function(){
		console.log("everything loaded!");
	});
});
</script>
```

## Documentation
_(Coming soon)_

## Examples

### Loader

```javascript
//reg module without require
Pa.reg([{name:"modules",src:"../src/modules.js"}]);
//reg module with require
Pa.reg([{name:"modules",src:"../src/modules.js" ,require["require1","require2"……]}]);
//or like this
Pa.reg([ 
	{name:"jQuery",src:"../libs/jquery/jQuery-1.9.1.js"},
	{name:"testStyle",src:"pa_test.css",require:["jQuery"]} 
]);
//load modules
_.require(["modules","testStyle"],function(){
	console.log("all ready!");
});
```

### Watcher

```javascript
var lilei=_({
	age:14,
	sayAge:function(){
		alert(this.age);
	}
});
lilei.on("change",function(){
	this[0].sayAge();
});
lilei.set(15,"age");
```

### Others

#### each:
```javascript
var arr=["a","c","e"];
_.each(arr,function(item,i){
	console.log(i+":"+item);
});
//0:a   1:c   2:e
```
#### has:
```javascript
var color=["red","white","orange"],
	books=[
		{name:"book1",price:10},
		{name:"book2",price:14},
	];
	
console.log(_.has(color,"red");//true
console.log(_.has(color,"black");//false

console.log(_.has(books,"name","book1"));//true
console.log(_.has(books,"price",18));//false
```

## Release History

### Initial Version 1.0.0 (2013.5.29)
* Pa的第一个版本就这么破壳而出了(●'◡'●)，hello world！
