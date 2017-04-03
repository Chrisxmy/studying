var $ = require('./jquery');


var GoTop = (function(){
    function _GoTop(ct,target){
        this.ct = ct;
        this.target = $('<button class="target">回到顶部</button>');
        this.target.css({
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            border: '1px solid black',
            'border-radius': '3px',
            background: 'black',
            color: 'white',
            cursor: 'pointer',
            padding: '5px 8px'
        });
        this.createNode();
        this.bindEvent();
    }
    _GoTop.prototype.createNode = function(){
        this.ct.append(this.target);
        this.target.hide();
    };
    _GoTop.prototype.bindEvent = function() {
        var btn = this.target;
        btn.on('click',function(){
            $(window).scrollTop(0);
        });
        $(window).on('scroll', function(){
            var $scrollTop = $(this).scrollTop();
            if( $scrollTop > 100 ) {
                btn.css({display:'block'});
            }else{
                btn.css({display:'none'});
            }
        });
    };
    return {
        init:function(ct){
            new _GoTop(ct);
        }
    }
    
})();
  
 



    module.exports = GoTop;