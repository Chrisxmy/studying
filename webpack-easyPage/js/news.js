var $ = require('./jquery.js');
var WaterFall = (function(){
    function Waterfall ($ct) {
        this.$ct = $ct;
        this.init();
        this.bind();
        this.render();
    }
    Waterfall.prototype.init = function(){
        this.itemWidth = this.$ct.find('li').outerWidth(true);
        this.columns =parseInt(this.$ct.width() / this.itemWidth);
        this.colHeight = [];
        for (var i = 0; i < this.columns; i++){
            this.colHeight[i] = 0;
        }
    }
    Waterfall.prototype.bind = function(){
        var _this = this;
        $(window).on('resize',function(){
            _this.init();
            _this.render();
        })
    }
    Waterfall.prototype.render = function(){
        var _this = this;
        this.$ct.find('li').each(function(){
            _this.placeItem($(this));
        })

    }
    Waterfall.prototype.placeItem = function($node){

        var min = this.getMinHeight();
        var minInd = min.ind,
            minHeight = min.value;
        $node.css({
            left:minInd * this.itemWidth,
            top:minHeight
        });

        this.colHeight[minInd] = $node.outerHeight(true) + this.colHeight[minInd];
        this.$ct.height(Math.max.apply(null,this.colHeight));
    }
    Waterfall.prototype.getMinHeight = function(){
        var minInd = 0;
        var minHeight = this.colHeight[minInd];
        for (var i = 0; i < this.colHeight.length; i++){
            if (minHeight > this.colHeight[i]) {
                minHeight = this.colHeight[i];
                minInd = i;
            }
        }
        return {ind:minInd,value:minHeight}
    }

    return {
        init:function($ct){
            new Waterfall($ct);
        }
    }
})()
module.exports = WaterFall;


   