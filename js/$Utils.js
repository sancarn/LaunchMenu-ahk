/*global $*/
loadOnce("/libraries/jQuery")
window.$Utils = (function(){
    var u = {};
    
    u.regexEscape = function(str){
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };
    var lmRoot = $("._lm_._QUERYNODE_");
    u.lm = function(selector){
        var q = $(selector);
        if(q.prevObject){
            return $(selector).filter(function(){
                return $(this).closest("._QUERYNODE_")[0]==lmRoot[0];
            });
        }else
            return q;    
    };
    
    u.fitImageInDiv = function(imgEl, imageData, padding, callback){
        var oldWidth = imgEl.width();
        var oldHeight = imgEl.height();
        
        imgEl.width("100%").height("100%");
        var maxWidth = imgEl.width()-padding*2;
        var maxHeight = imgEl.height()-padding*2;
        var maxRatio = maxHeight/maxWidth;
        imgEl.width(oldWidth).height(oldHeight);
        
        var img = new Image();
        img.src = imageData;
        img.onload = function(){
            var width = img.width;
            var height = img.height;
            
            var ratio = height/width;
            
            if(ratio>maxRatio){
                height = maxHeight;
                width = height/ratio;
            }else{
                width = maxWidth;
                height = width*ratio;
            }
            imgEl.width(width).height(height);	
        	imgEl.attr("src", imageData);
        	callback(img.width, img.height, width, height);
        };
    }
    
    u.dataPath = function(){
    	return process.env.APPDATA+"\\LaunchMenu\\";
    };
    u.rootPath = function(){
    	return process.cwd();
    };
    u.createQueryNode = function(element){
        var root = element;
        root.addClass("_QUERYNODE_");
        return function(selector){
            var q = $(selector);
            if(q.prevObject){
                return root.find(selector).filter(function(){
                    return $(this).parents("._QUERYNODE_")[0]==root[0];
                });
            }else
                return q;
        };
    };
    u.createTemplateElement= function(name, template, UID){
        var c = "_"+name.replace("$","0")+"_"+(UID?" _"+UID+"_":"");
        var el = $("<div class='"+c+"'>"+template.html+"</div>");
        el.find("*").addBack().addClass(c);
        
        var selector = /([^,+~{}:]+)((:[^,+~{}:]+)*)([,+~]|\{([^\{\}]+)\})/g;
        if(UID){
            var styling = template.style.replace(selector, `$1.${c.replace(/ /g,".")}$2$4`);
            el.append("<style>"+styling+"</style>");
        }else{
            if($("body").children("style."+c).length==0){
                var styling = template.style.replace(selector, `$1.${c}$2$4`);
                $("body").append("<style class="+c+">"+styling+"</style>");
            }
        }
        el.addClass("root");
        
        var query = u.createQueryNode(el);
        return {element:el, querier:query, htmlClassName:c};
    };
    
    u.keyboardEventToShortcut = function(keyEvent){
        var specialKeys = {ctrlKey:"ctrl", shiftKey:"shift", altKey:"alt"};
        var keyNames = Object.keys(specialKeys);
        
        var output = "";
        for(var i=0; i<keyNames.length; i++){
            var name = keyNames[i];
            if(keyEvent[name]) 
                output+=specialKeys[name]+"+";
        }
        
        output+=keyEvent.key.toLowerCase();
        return output;
    };
    u.testShorcut = function(keyEvent, shortcut){
        shortcut = shortcut.toLowerCase();
        var specialKeys = {ctrlKey:"ctrl", shiftKey:"shift", altKey:"alt"};
        var keyNames = Object.keys(specialKeys);
        
        //search if all the special keys are pressed
        for(var i=0; i<keyNames.length; i++){
            var name = keyNames[i];
            var index = shortcut.indexOf(specialKeys[name]);
            if(!!keyEvent[name] != (index!=-1)) 
                return false;
        }
        
        //check if the right key is pressed
        var parts = shortcut.split("+");
        if(parts.indexOf(keyEvent.key)==-1) return false;
        
        return true;
    };


    u.copy = function(object){
        if(object instanceof Array){
            return jQuery.extend([], object);
        }else{
            return jQuery.extend({}, object);
        }
    }
    
    u.iterate = function(list, itemFunction, completeFunction, maxTime){
        if(!maxTime) maxTime = 50;
        
        var i = 0;
        var timeoutID;
        var func = function(){
            var startTime = Date.now();
            outer:{
                inner:{
                    while(i<list.length){
                        if(Date.now()-startTime>maxTime) 
                            break inner;
                        var item = list[i++];
                        itemFunction.call(item, item);
                    }      
                    
                    completeFunction();
                    break outer;
                }
                
                timeoutID = setTimeout(func,0);
            }
        };
        func();
        
        return function(){
            clearTimeout(timeoutID);
        };
    };
    
    return u;
})();


// function regexEscape(str){
//     return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
// }
// var lmRoot = $("._lm_._QUERYNODE_");
// // var lmRoot = $("._lm_._QUERYNODE_");
// function lm(selector){
//     var q = $(selector);
//     if(q.selector){
//         return $(selector).filter(function(){
//             return $(this).closest("._QUERYNODE_")[0]==lmRoot[0];
//         });
//     }else
//         return q;
// }
// function fitImageInDiv(imgEl, imageData, padding){
//     var oldWidth = imgEl.width();
//     var oldHeight = imgEl.height();
    
//     imgEl.width("100%").height("100%");
//     var maxWidth = imgEl.width()-padding*2;
//     var maxHeight = imgEl.height()-padding*2;
//     var maxRatio = maxHeight/maxWidth;
//     imgEl.width(oldWidth).height(oldHeight);
    
//     var img = new Image();
//     img.src = imageData;
//     img.onload = function(){
//         var width = img.width;
//         var height = img.height;
        
//     	imgEl.attr("src", imageData);
//         var ratio = height/width;
        
//         if(ratio>maxRatio){
//             height = maxHeight;
//             width = height/ratio;
//         }else{
//             width = maxWidth;
//             height = width*ratio;
//         }
//         imgEl.width(width).height(height);	
//     };
// }

// function createQueryNode(name, element){
//     var root = element;
//     return function(selector){
//         var q = $(selector);
//         if(q.selector){
//             return root.find(selector).filter(function(){
//                 return $(this).parents("._QUERYNODE_")[0]==root[0];
//             });
//         }else
//             return q;
//     };
// }
// function createTemplateElement(name, template, UID){
//     var c = "_"+name+"_"+(UID?" _"+UID+"_":"");
//     var el = $("<div class='"+c+" _QUERYNODE_'>"+template.html+"</div>");
//     el.find("*").addBack().addClass(c);
    
//     var selector = /([^,+~{}:]+)((:[^,+~{}:]+)*)([,+~]|\{([^\{\}]+)\})/g;
//     if(UID){
//         var styling = template.style.replace(selector, `$1.${c.replace(/ /g,".")}$2$4`);
//         el.append("<style>"+styling+"</style>");
//     }else{
//         if($("body").children("style."+c).length==0){
//             var styling = template.style.replace(selector, `$1.${c}$2$4`);
//             $("body").append("<style class="+c+">"+styling+"</style>");
//         }
//     }
//     el.addClass("root");
    
//     var query = createQueryNode(name, el);
//     return {element:el, querier:query, htmlClassName:c};
// }

// function resetCall(resetFunc, delay){
//     var id = setTimeout(function(){
//         id = null;
//         resetFunc();
//     }, delay);
//     return {cancel:function(){clearTimeout(id)}};
// }

// function keyboardEventToShortcut(keyEvent){
//     var specialKeys = {ctrlKey:"ctrl", shiftKey:"shift", altKey:"alt"};
//     var keyNames = Object.keys(specialKeys);
    
//     var output = "";
//     for(var i=0; i<keyNames.length; i++){
//         var name = keyNames[i];
//         if(keyEvent[name]) 
//             output+=specialKeys[name]+"+";
//     }
    
//     output+=keyEvent.key.toLowerCase();
//     return output;
// }

// function testShorcut(keyEvent, shortcut){
//     shortcut = shortcut.toLowerCase();
//     var specialKeys = {ctrlKey:"ctrl", shiftKey:"shift", altKey:"alt"};
//     var keyNames = Object.keys(specialKeys);
    
//     //search if all the special keys are pressed
//     for(var i=0; i<keyNames.length; i++){
//         var name = keyNames[i];
//         var index = shortcut.indexOf(specialKeys[name]);
//         if(!!keyEvent[name] != (index!=-1)) 
//             return false;
//     }
    
//     //check if the right key is pressed
//     var parts = shortcut.split("+");
//     if(parts.indexOf(keyEvent.key)==-1) return false;
    
//     return true;
// }

// function copy(object){
//     if(object instanceof Array){
//         return jQuery.extend([], object);
//     }else{
//         return jQuery.extend({}, object);
//     }
// }
// function logableFunc(func, name, help){
// 	var match = /^[^\(]*\(([^\{\}]*)\)\{/.exec(func+"");
// 	var argNames = match[1].split(/,\s*/);
    
//     func.definition = {name:name, args:[], ret:null, description: null};
//     for(var i=0; i<argNames.length; i++){
//         func.definition.args.push({name:argNames[i]});
//     }
    
//     var style = "color:red, color:purple, color:orange";
//     func.inspect = {
    	
//     };
    
//     var setHelp = function(help){
//     	if(help instanceof Object){
//     		if(help.name)		func.definition.name		= help.name;
//     		if(help.args)		func.definition.args		= help.args;
//     		if(help.ret)		func.definition.ret 		= help.ret;
//     		if(help.description)func.definition.description = help.description;
//     	}else if(help instanceof Array){
//     		if(help.length>0){
//     			var n = help[0].split(" > ");
//     			var args = n[0].split(/ /g);
//     			for(var i=0; i<args.length; i++){
//     				func.definition.args[i].type = args[i];
//     			}
//     			var ret  = n[1].split(" ");
//     			func.definition.ret = {name:ret[0]};
//     			if(ret.length>1){
//     				func.definition.ret.type = ret[1];	
//     			}
//     		}
//     		if(help.length>1){
//     			func.definition.description = help[1];
//     		}
//     	}else if(typeof help=="string"){
//     		func.inspect = {text:help, style:style};
//     		func.definition = null;	
//     	}
    	
//     	if(func.definition){
// 	    	func.inspect = {text:"", style:style};
// 	    	func.inspect.text += "@0"+name+"(";
// 	    	for(var i=0; i<func.inspect.args.length; i++){
// 	    		var arg = func.inspect.args[i];
// 	    		if()
// 	    	}
    		
//     	}
    	
//     };
//     if(help==null){
//     	return new Proxy(func, {
//     		set: function(target, name, value){
//     		    if(name=="help"){
//     		    	setHelp(value);
//     		    }else
//     		    	target[name] = value;
//     		}
//         });
//     }else{
//     	setHelp(help);
//     	return func;
//     }
// }
// (function(log){window.console.log = function(){
//     var args = [].slice.call(arguments);
// 	for(var i=0; i<args.length; i++){
// 		var arg = args[i];
// 		var inspect;
		
// 		if(Object.keys(arg).length==2 && arg.text!=null && arg.style!=null)
// 			inspect = arg;
// 		if(arg instanceof Object && args[i].inspect){
// 			if((arg.inspect) instanceof Function){
// 				inspect = arg.inspect();
// 			}else
// 				inspect = arg.inspect;
// 		}		
// 		if(inspect && inspect.style && inspect.text){
// 			var styles = [];
// 			if(typeof (inspect.style) == "string") 
// 				inspect.style = inspect.style.split(",");
// 			var text = inspect.text.replace(/@([0-9]+)([^@]+)/g, function(mTotal, m1, m2){
// 				var st = inspect.style[Number(m1)];
// 				if(!/:/.test(st)) st = "color:"+st;
// 				styles.push(st);
// 				return "%c"+m2;
// 			});
			
// 			if(styles.length==0){
// 				text = "%c"+text;
// 				styles.push(inspect.style[0]);
// 			}
// 			styles.unshift(text);
			
// 			args.splice(i, 1);
// 			if(i==0){
// 				args = args.slice(0,i).concat(styles.concat(args.slice(i)));
// 				i+=styles.length-1;
// 			}else{
// 				setTimeout(function(){
// 					console.log.apply(console, styles);	
// 				});
// 				i--;
// 			}
// 		}
//     }
// 	log.apply(window, args);
// }})(console.log);
//
//function dedent(input){
//	var lines = input.split("\n");
//	var min = Infinity;
//	for(var i=1; i<lines.length; i++)
//		min = Math.min(min, lines[i].match(/\s+/)[0].length);
//	for(var i=1; i<lines.length; i++)
//		lines[i] = lines[i].substring(min);
//	return lines.join("\n");
//}
