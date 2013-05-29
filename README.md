# Pa

Pa是一个轻量级前端类库，核心由一个Loader和Watcher构造器组成

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
	this.sayAge();
});
lilei.set(15,age);
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
		
	console.log(_has(color,"red");//true
	console.log(_has(color,"black");//false
	
	console.log(_has(books,"name","book1"));//true
	console.log(_has(books,"price",18));//false
```

## Release History

### Initial Version 1.0.0 (2013.5.29)
*Pa的第一个版本就这么破壳而出了(●'◡'●)，hello world！
