 var Btn = document.querySelector('#btn'),
     game = document.querySelector('#game');
	  Btn.addEventListener('click',function(){
          game.style.background = '#000'
		  this.style.display = 'none';
		  Game.init('#game')
	  })




	  var Game = {
		  enemy : {
              1: { style :'enemy1',blood:1,speed:1,count:1},
			  2: { style :'enemy2',blood:2,speed:2,count:2},
			  3: { style :'enemy3',blood:3,speed:5,count:3}
		  },
		  level:[
			  {		
				map:[
					2,2,2,2,2,2,2,2,2,2,
					2,2,2,2,2,2,2,2,2,2,
                    1,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,1,1,
					  ],
				colnum:10,           
				speedX:10,           			                    
				speedY:10,          
				time:2000           
			  },	
		   {		
				map:[
					2,2,2,2,2,2,2,2,2,2,
					2,2,2,2,2,2,2,2,2,2,
					2,2,2,2,2,2,2,2,2,2,
					3,3,3,3,3,3,3,3,3,3,
					3,3,3,3,3,3,3,3,3,3,
					3,3,3,3,3,3,3,3,3,3,
					  ],
				colnum:10,           //一行10个
				speedX:10,           //x方向速度			                    
				speedY:10,          //Y方向速度
				time:2000           //下落时间间隔
			  }
		  ],		
		  airr : {   //飞机的数据
		     style : 'air1',
		     bulletStyle : 'bullet'
	},	


		  init:function(id){ 
			  this.Parent = document.querySelector(id);
			  this.Creatcount()   
			  this.CreatEnemy(0)     //关卡1
			  this.creatAir()
		  },
		  Creatcount:function(){                 //创建游戏积分
			  var count = document.createElement('div')
			  count.id = 'count'
			  count.innerHTML = '积分<span>0</span>'
              this.Parent.appendChild(count)
			  this.num = document.querySelector('span')
		  },
		  CreatEnemy:function(lev){   
			  
			  if(this.ul){

				  clearInterval(this.ul)
				  this.Parent.removeChild(this.ul)
			  }
			                                       //创建下落物
                 var Level = this.level[lev];      //关卡
				 var arr = [];
				 var ul = document.createElement('ul')
				 ul.id = 'bee'
				 ul.style.width = Level.colnum*40+'px'
				 this.Parent.appendChild(ul);
				 ul.style.left = (this.Parent.offsetWidth-ul.offsetWidth)/2+'px'
				 this.ul = ul;
                  for(var i=0;i<Level.map.length;i++){
                           var Li = document.createElement('li') ;
						   Li.className = this.enemy[Level.map[i]].style;
						   Li.blood = this.enemy[Level.map[i]].blood
						   Li.count = this.enemy[Level.map[i]].count
						   Li.speed = this.enemy[Level.map[i]].speed
						   ul.appendChild(Li)
				  };
					//  this.Li = document.querySelectorAll('li');  //!!!     querySelectorAll选择器返回的是NodeList是静态的 遍历时做dom操作不会及时反应在集合中 以至于下面出错
					  this.Li = ul.getElementsByTagName('li');

				   for(var i =0;i<this.Li.length;i++){                          // 重新布局 float布局在物体消失后会导致移动
                         arr.push([this.Li[i].offsetLeft,this.Li[i].offsetTop])
				   }
				   for(var i=0;i<this.Li.length;i++){
					   this.Li[i].style.position = 'absolute'
					   this.Li[i].style.left = arr[i][0] +'px'
					   this.Li[i].style.top = arr[i][1] +'px'
				   }
				   
		
				   this.moveAll(Level)
		
		  },	  	
			moveAll:function(Lev){                //移动整体
				var _this = this
				var leftDistance = this.Parent.offsetWidth-this.ul.offsetWidth
			this.ul.time  = setInterval(function(){
					if(_this.ul.offsetLeft>=leftDistance){
						Lev.speedX *= -1
					}else if(_this.ul.offsetLeft<=0){
						Lev.speedX *= -1
						
					}
                     _this.ul.style.left = _this.ul.offsetLeft+Lev.speedX+'px'
				},100)
				setInterval(function(){             //移动单个
					_this.onemove()
				},Lev.time)
		  },
          onemove:function(){
                  var moveLi = this.Li[Math.floor(Math.random()*this.Li.length)],
				  _this = this;
                  
				moveLi.time =  setInterval(function(){
					    var a = (_this.air.offsetWidth/2+_this.air.offsetLeft) - (moveLi.offsetLeft + moveLi.parentNode.offsetLeft+moveLi.offsetWidth/2) ,
				      b =   (_this.air.offsetHeight/2+_this.air.offsetTop) - (moveLi.offsetTop + moveLi.parentNode.offsetTop+moveLi.offsetHeight/2) 
					  c = Math.sqrt(a*a+b*b),
					  speedX = moveLi.speed*a/c,
					  speedY = moveLi.speed*b/c;
 
                  moveLi.style.left =  moveLi.offsetLeft + speedX + 'px'
				  moveLi.style.top =  moveLi.offsetTop + speedY + 'px'
				  if(_this.impact(_this.air,moveLi)){
                         alert('游戏结束')
						 window.location.reload();      
				  }

				  },10)
		  },

		  creatAir:function(){                            //创建飞机
			  var air = document.createElement('div')
			  this.air = air
			  air.className = 'air'
			  this.Parent.appendChild(air)
			  air.style.left = (this.Parent.offsetWidth-air.offsetWidth)/2+'px'
			  air.style.top = this.Parent.offsetHeight-air.offsetHeight+'px'
			    this.moveAir()
		  },
		  moveAir:function(){  
			    var _this =this,
				time = null;                                      //操作飞机
                document.addEventListener('keydown',function(e){
					if(e.keyCode === 37 && !time){
						 time = setInterval(function(){
								 _this.air.style.left = _this.air.offsetLeft - 5+'px'
						},10)
                       

					}else if(e.keyCode === 39 && !time){
						 time  = setInterval(function(){
								 _this.air.style.left = _this.air.offsetLeft + 5+'px'
						},10)
                       
					}
				})
				 document.addEventListener('keyup',function(e){
					 	
					 clearInterval(time)
					 time = null
					 if(e.keyCode === 32){
						 _this.createBullet()
					 }
				 
				 })
		  },
		  createBullet:function(){                                  //创建子弹
                  var bul = document.createElement('div');
				  bul.className = this.airr.bulletStyle;
				  this.Parent.appendChild(bul);
				  bul.style.left = this.air.offsetLeft +  this.air.offsetWidth/2 +'px'
				  bul.style.top = this.air.offsetTop - 10 +'px'
				  this.moveBullet(bul)
		  },
		  moveBullet:function(bul){                     //移动子弹
			  var _this = this;
		    bul.time =  setInterval(function(){
				
				if(bul.offsetTop<-10){
					clearInterval(bul.time);
					_this.Parent.removeChild(bul)
				}else{
                     bul.style.top = bul.offsetTop - 10 +'px' 
				}
				for(var i=0;i<_this.Li.length;i++){
				    if( _this.impact(bul,_this.Li[i]) ){
					
					if( _this.Li[i].blood == 1 ){
						clearInterval(_this.Li[i].time)
						_this.num.innerHTML = parseInt(_this.num.innerHTML) + _this.Li[i].count;
						_this.ul.removeChild(_this.Li[i]);
						
					}
					else{
						_this.Li[i].blood--;
					}
					
					clearInterval(bul.time);
					_this.Parent.removeChild(bul);
				}
			}
			              if(!_this.Li.length){
						      _this.CreatEnemy(1)
						   }
			  },20)	  
		 },
		 impact:function(obj1,obj2){                   //物体碰撞检测
		 		var L1 = obj1.offsetLeft,
				    R1 = obj1.offsetLeft + obj1.offsetWidth,
                    T1 = obj1.offsetTop,
		            B1 = obj1.offsetTop + obj1.offsetHeight,

					L2 = obj2.offsetLeft + obj2.parentNode.offsetLeft,
				    R2 = obj2.offsetLeft + obj2.offsetWidth + obj2.parentNode.offsetLeft,
                    T2 = obj2.offsetTop + obj2.parentNode.offsetTop,
		            B2 = obj2.offsetTop + obj2.offsetHeight +obj2.parentNode.offsetTop;

					if(L1>R2 || R1<L2 || T1>B2 || B1<T2){
                            return false
					}else{
						return true
					}
						
					
	        },
		playPause:	function() {     
   				 var music = document.getElementById('music')  
    		  music.volume = 0.1
         if (music.paused){     
               music.play();     
       
             }     
                 else{     
                  music.pause();     
          
              }     
         }
	  }