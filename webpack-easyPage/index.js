var $ =require('./js/jquery.js');
var GoTop = require('./js/GOTop.js');
var carousel = require('./js/carousel.js');
var Jsonp = require('./js/jsonp.js');


GoTop.init($('body'));
carousel.init($('.solider'));
new Jsonp($('.waterfall-ct'));
$('.loadmore').on('click',function(){
    new Jsonp($('.waterfall-ct'));
})