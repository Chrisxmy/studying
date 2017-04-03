var $ = require('./jquery');

     
    var carousel = (function(){
        function _carousel($ct){
            this.$ct = $ct;
            this.init();
            this.bind();
        }
        _carousel.prototype.init = function(){
            var $imgCt = this.$imgCt = this.$ct.find('.img-ct'),
                    $preBtn = this.$preBtn = this.$ct.find('.btn-pre');
            $nextBtn = this.$nextBtn = this.$ct.find('.btn-next');
            $bullet = this.$bullet =this.$ct.find('.bullet');

            var $firstImg =this.$firstImg =$imgCt.find('li').last(),
                    $lastImg =this.$lastImg =$imgCt.find('li').first();

            this.curPageIndex = 0;
            this.imgLength = $imgCt.children().length;
            this.isAnimate = false;
            $imgCt.prepend($firstImg.clone());
            $imgCt.append($lastImg.clone());
            $imgCt.width($firstImg.width()*$imgCt.children().length);
        };
        _carousel.prototype.bind = function(){
            var _this = this;
            this.$imgCt .on('click',function(e){
                e.preventDefault()
            });
            this.$preBtn.on('click',function(e){
                e.preventDefault();
                _this.playPre();
            });
            this.$nextBtn.on('click',function(e){
                e.preventDefault();
                _this.playNext();
            });
            this.$bullet.find('li').on('click',function(){
                var idx = $(this).index();
                _this.bullet(idx);
                _this.play(idx)
            });
        };
        _carousel.prototype.playNext = function(){
            var _this = this;
            if(this.isAnimate) return;
            this.isAnimate = true;
            this.$imgCt.animate({
                left: '-='+2000
            },function(){
                _this.curPageIndex++;
                if(_this.curPageIndex === _this.imgLength){
                    _this.$imgCt.css({left:-2000});
                    _this.curPageIndex = 0;
                }
                _this.isAnimate = false;
                _this.bullet(_this.curPageIndex);
            });
        };
       _carousel.prototype.playPre = function(){
            var _this = this;
            if(this.isAnimate) return;
            this.isAnimate = true;
            this.$imgCt.animate({
                left:'+='+2000
            },function(){
                _this.curPageIndex--;
                if(_this.curPageIndex<0){
                    _this.$imgCt.css({left:-(_this.imgLength*_this.$firstImg.width())});
                    _this.curPageIndex = _this.imgLength-1
                }
                _this.isAnimate = false;
                _this.bullet(_this.curPageIndex);
            })
        };
        _carousel.prototype.play = function(n){
            var _this = this;
            if(this.isAnimate) return;
            this.isAnimate = true;
            this.$imgCt.animate({
                left: '+='+2000*(this.curPageIndex-n)
            },function(){
                _this.curPageIndex = n;
                _this.isAnimate = false;
                _this.bullet(_this.curPageIndex);
            });

        }
        _carousel.prototype.bullet = function(n){
            this.$bullet.children()
                    .removeClass('active')
                    .eq(n)
                    .addClass('active')
        }

        return {
            init:function($ct){
                $ct.each(function(index,node){
                    new _carousel($(node))
                })
            }
        }
    })();
       
module.exports = carousel;