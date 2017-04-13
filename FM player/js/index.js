  function musicPlay(){
	  this.audioObject = document.querySelector('#music')
	  this.channels = ''
	  this.currentTiemSec = 0;
      this.init()

  }
  musicPlay.prototype ={
	  	init:function(){
 			this.controlVolume()
		    this.getChannels()
			this.play()
			this.pause()
		   	this.next()
			this.channelList()
			this.timeUpdate()
			this.clickPresent()
		  },
		  render:function(){                         //渲染歌曲信息
		    $('#music').attr('src',this.url)
            $('.songTitle').text(this.title)
			$('.singer').text(this.artist)
			$('.img').attr('src',this.picture)
		  },

   		 play:function(){                   //播放
			var _this = this
			   $('.icon-play').on('click',function(){
			   $('.icon-play').attr('class','playAndpause iconfont icon-pause')
			   _this.audioObject.play()
			   _this.durationTime()	
			   _this.pause()
			   _this.auto = true
		})
	},
		pause:function(){                            //暂停
			var _this = this
			  $('.icon-pause').on('click',function(){	
			  $(this).attr('class','playAndpause iconfont icon-play')
              _this.audioObject.pause()
			  _this.play()
		})
	},

		next:function(){                             //控制下一首
		    var _this = this
		      $('.icon-fastforward').on('click',function(){
			  $(".lyric").empty();
			  $('#music').attr('src','') 
			  _this.getSong()
		})
	}, 

		  channelList:function(){                       //控制专辑列表
			 var _this = this,
				$channelList = $('.channel-list')
				  $('.meun').on('click',function(){
					  if($channelList.css('left') === '80px'){
					  $('.meun span').attr('class','iconfont icon-jiantou')
							$channelList.animate({
                            left:'1',
					})
					}else{
						$('.meun span').attr('class','iconfont icon-wxmeun')
						$channelList.animate({
                             left:'80px',
					})
					}
			})		
		  },
		  getChannelsItem(){                                   //控制专辑分类
             var _this = this;
	             $('.channel-list').on('click','li',function(){
                    _this.channels = $(this).attr('channel_id')			
			        _this.getSong()
	  })

	}, 
	 	  getChannels:function(){              //获取歌曲专辑
		 	var _this = this
		 $.ajax({
            url: "http://api.jirengu.com/fm/getChannels.php",
            method: "get",
            dataType: "json",
        }).done(function (e) { 
             var html = ''
			   for(var i=0;i<e.channels.length;i++){
                  html += '<li>'+e.channels[i].name+'</li>'
			 } 
			   $('.channel-list').append(html)
			   $('.channel-list li').each(function(index,value){
				   $(this).attr('channel_id',e.channels[index].channel_id)
			})      
			      _this.channels = e.channels[7].channel_id
			      _this.getChannelsItem()
			      _this.getSong()
        })

	},
	      getSong:function(){                    //获取歌曲
		    var _this = this
	      $.ajax({
            url: "http://api.jirengu.com/fm/getSong.php",
            method: "get",
            dataType: "json",
			data:{channel:_this.channels}
        }).done(function (event) {                          
            var ret = event.song[0];
			 _this.url =  ret.url
             _this.lyric = ret.sid
			 _this.title = ret.title
			 _this.picture = ret.picture
			 _this.artist = ret.artist
			 _this.shareWeibo( _this.title,_this.url)
	        _this.render()
			$(".lyric").empty();
			_this.getLyric()
			if(_this.auto){
				  _this.audioObject.play()
			}	
        }).fail(function () {
            
        });

},
		getLyric:function(){                          //获取歌词数据
			var _this =this
		 $.ajax({
            url: "http://api.jirengu.com/fm/getLyric.php",
            method: "get",
            dataType: "json",
			data:{sid:_this.lyric}
        }).done(function (e) {    
            var lyricStr = e.lyric;
            _this.renderLyric(lyricStr)
                      
        }).fail(function(){
			 $('.lyric').append('<li>没有歌词</li>')
		})

	},
	    renderLyric:function(lyricStr){              //处理歌词数据并渲染
		     var lyricArr = lyricStr.split('\n'),
	             html = '';
		         this.lyricTimeArr = [];
		  for(var i=0;i<lyricArr.length;i++){
			var lyric = lyricArr[i].slice(10,48)
			    if(!lyric){
				  lyric = '-'
			  }
			    html +='<li class=lyric'+i+'>'+lyric+'</li>';
				this.getLyricTime(lyricArr[i])
		  }	
		  $('.lyric').append(html)
        
	},
		getLyricTime:function(Lyric){                            //处理数据获取歌词对应时间
            var min = parseFloat(Lyric.slice(1,3))
		    var sec = Math.round(min*60+parseFloat(Lyric.slice(4,9)))
		    this.lyricTimeArr.push(sec)
	},

		timeUpdate:function() {                                    //监听歌曲时间更新事件
             var _this = this;
             this.audioObject.ontimeupdate =  function() {
                 if (_this.currentTiemSec != Math.round(_this.audioObject.currentTime)) {
                     _this.currentTiemSec = Math.round(_this.audioObject.currentTime);
                     _this.lyricBoxMove(_this.currentTiemSec);
			         _this.currentTime()
		             _this.autoPresent()
        }
    }

},
 		lyricBoxMove:function(num) {                                      //控制歌词的移动
             for (var i = 0; i < this.lyricTimeArr.length; i++) {
                if (num === this.lyricTimeArr[i]) {
                var Top = 80 - (i * 20) + 'px';
			    var lightClass = '.lyric' + i;
			$(lightClass).siblings().removeClass('light');
            $(lightClass).addClass('light');
			$('.lyric').animate({
                top: Top
            }, 300);
        }
    }
},
		currentTime:function(){                                  //获取歌曲的实时的时间
		    var current = this.audioObject.currentTime
		    var min = Math.floor(current/60)
		    var sec = Math.round(current - min*60)
			if(min === 0 &&sec<10){
					  $('.current').text('00'+':'+'0'+sec)
			}else if(min === 0 &&sec>=10){
					 $('.current').text('00'+':'+sec)
			}else if(min > 0 && sec<10){
				$('.current').text('0'+min+':'+'0'+sec)
			}
			else if(min > 0 && sec>=10){
				$('.current').text('0'+min+':'+sec)
			}
}, 
    	clickPresent:function(){                                   //点击控制进度条的移动
		    var _this = this
         $('.progress').on('click',function(e){
			var distance = e.clientX -  $(this).offset().left 
			var per = distance / $(this).width()
		  $('.progress .line').css({width: distance})	
			  _this.audioObject.currentTime = _this.audioObject.duration*per
		 })

	},
		autoPresent:function(){                                                         //进度条的移动
            var length = this.audioObject.currentTime/this.audioObject.duration*100
		$('.progress .line').css({width:length+'%'})
		if(length === 100){
			this.getSong()
		}

	},
		durationTime:function(){                                 //歌曲当前时间
		    var duration = this.audioObject.duration
		    var min = Math.floor(duration/60)
		    var sec = Math.round(duration - min*60)
			 if(sec<10){
			 		  $('.duration').text('0'+min+':'+'0'+sec)
			}else if(sec>=10){
					$('.duration').text('0'+min+':'+sec)
			}
				
	},
		controlVolume:function(){
		    var $handle = this.$handle=  $('.volume-ct .handle'),
		        $line= this.$line = $('.volume-ct .line'),
			    $ct = this.$ct= $('.volume-ct'),
			    $icon= this.$icon= $('.volume .iconfont'),
			    _this = this;  	    
		 $ct.on('click',function(e){                                          //控制音量按钮点击
              var dis =_this.dis= e.clientX - $(this).offset().left
			  var per = dis/$(this).width()
			  $handle.css({left:dis})
			  $line.css({width:dis+4})
			  _this.audioObject.volume = per
		})
		 $handle.on('mousedown',function(e){                   //控制音量按钮拖动
			   e.stopPropagation()
                _this.disX = e.clientX -$(this).offset().left	
		$('body').on('mousemove',function(e){
                    var L = _this.L= e.clientX - _this.disX - $ct.offset().left;
					if(L >= 146){
                        L = 146
					}else if(L <=-4 ){
						L = -4
					}			
				    _this.$line.css({width:L+4})
					_this.$handle.css({left:L})
					_this.audioObject.volume = (L+4)/$ct.width()					
		$('body').on('mouseup',function(){
							$handle.unbind('mouseup')
            				$('body').unbind('mousemove')
					 })
				})
				
		})
		$icon.on('click',function(){                                   //控制音量图标
		if(_this.audioObject.volume === 0){		
				_this.$icon.attr('class','iconfont icon-yinliang')
				 _this.$line.css({width:150})
			       _this.$handle.css({left:146})
					_this.audioObject.volume = 1
				
			}else{
				_this.$icon.attr('class','iconfont icon-wusheng')
				_this.audioObject.volume = 0
				_this.$line.css({width:0})
				_this.$handle.css({left:-4 })
			}
		
		})
		this.audioObject.onvolumechange = function(){                 //监听音量改变事件
		if(_this.audioObject.volume ===0){
				_this.$icon.attr('class','iconfont icon-wusheng')
		}else{
				_this.$icon.attr('class','iconfont icon-yinliang')			  
		}			

		}

	},
	shareWeibo:function(title,link){
		$('.icon-share').on('click',function(){
			var href = 'http://v.t.sina.com.cn/share/share.php?title='+'我在私人FM听:'+title+link
			$(this).attr('href',href)
		})
	}
  }
