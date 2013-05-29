# Pa

Pa是一个轻量级前端类库，核心由一个加载器和watcher组成

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
//Reg modlule without require
Pa.reg([{name:"modules",src:"../src/modules.js"}]);
//Reg modlule with require
Pa.reg([{name:"modules",src:"../src/modules.js" ,require["require1","require2"……]}]);
```
### Watcher
```javascript
var lilei={
	age:14,
	sayAge:function(){
		alert(this.age);
	}
}
_(lilei).on("change",function(){
	this.sayAge();
});
lilei.set(15,age);
```

## Release History
_(Nothing yet)_
