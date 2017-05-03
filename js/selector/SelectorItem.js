/*global Class createTemplateElement*/
var SelectorItem = Class("SelectorItem", {
    const: function(){
        //create element out of template
        this.template = copy(this.template); //make a local copy of the class' template
        this.template.style += ".selected{"+this.selectedStyle+"}"; //add styling for if the item is selected
        var UID = Math.floor(Math.random()*Math.pow(10,7)); //add UID to element because there will be many instances of this class
        var n = createTemplateElement(this.className, this.template);
        
        this.element = n.element;
        this.element.css({width:"100%","min-height":"40px"});
        this.htmlClassName = n.htmlClassName;
        this.$ = n.querier;
        
        this.element[0].selectorItem = this; //used to retrieve the SelectorItem when navigating
        this.eventSetup();
    },
    eventSetup: function(){ //setup the element evemt listeners
        var t = this;
        this.element.click(function(){
            t.execute();
        });
        this.element.mousemove(function(){
            if(!t.selector.scrolling) //disable selection while scrolling
                if(!t.element.is(".selected")){
                    t.select();
                }
        });
    },
    setSelector: function(selector){
        this.selector = selector;
    },
    select: function(){
        this.element.addClass("selected");
        this.selector.selectItem(this);
        this.selected = true;
    },
    deselect: function(){
        this.element.removeClass("selected");
        this.selected = false;
    },
    execute: function(){ //execute the items function
        console.log("hi", this.element);
    },
    keyboardEvent: function(event){ //listens to any keypresses on the page
        //return true if you use the keypress event
    },
    destroy: function(){
        //remove the element from the page
        this.element.remove();  
    },
    selectedStyle: `background-color: purple;`,
    template:{
        html:   ``,
        style:  ``
    }
});