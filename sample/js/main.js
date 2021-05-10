

'use strict';

         window.onload = function(){	
            myGame.init();
         }

         var myGame = {

            data : {  //Flying objects data
                ENEMY : {
                    blood : 1,
                    bullet : true,
                },
			
				PLANE:{
					goto_fire:false,
					p_blood : 100
				},

            },

            init : function(){ //initialization

                var layout = document.getElementById('layout'),
                    mystart = document.getElementById('start'),
                    bloods = document.getElementById('rec'),
                    That = this;

				bloods.style.width = '300px';
				bloods.style.height = '40px';
				bloods.style.left = '0px';
				bloods.style.top = '0px';
				bloods.style.background = 'green';
				bloods.style.display = 'block';	
                this.layout = layout;
                this.mystart = mystart;
                this.bloods = bloods;

                document.getElementById('startBtn').onclick = function() {
                    mystart.style.display = 'none';
                    That.createPlane();
                    document.getElementsByClassName('bloods')[0].style.display = 'block';
                };

            },

            createPlane : function(){  //Create my tank/plane

                var That = this;

                var plane = document.createElement('div');
                plane.className = 'plane';
                plane.style.width = '137px';
				plane.setAttribute('p_blood',100);
                plane.style.left = (this.layout.offsetWidth - plane.offsetWidth) / 2 + 'px';
                this.layout.append( plane );

                this.plane = plane;
				
				var eng = document.createElement('div');
				var tim = 0;
				
			   
                plane.itimer2 = setInterval(function(){
                    That.createEnemy();
                },~~(Math.random() * (2500-400 + 1) + 400));
				
				this.runPlane(plane);	
            },
			
			runPlane:function(p){
				var obj = p;
				var That = this;
				var codeType = {
					"up":false,
					"down":false,
					"left":false,
					"right":false,
					"fire":false
				}
				setInterval(Move,50);
				
				var go_speed = 10;
				
				window.onkeydown = function(event){//Control my plane
					var e = event || window.event || arguments.callee.caller.arguments[0];
					 
					if(event.keyCode == 38){
						codeType.up = true;
					}
					if(event.keyCode == 40){
						codeType.down = true;
					}
					if(event.keyCode == 37){
						codeType.left = true;
					}
					if(event.keyCode == 39){
						codeType.right = true;
					}
					if(event.keyCode == 32){ //space fire
						That.createBullet('b1',obj,0,1);
						document.getElementById("fire").play();
					}
				}
				
				window.onkeyup = function(event){
					if(event.keyCode == 38){
						codeType.up = false;
					}
					if(event.keyCode == 40){
						codeType.down = false;
					}
					if(event.keyCode == 37){
						codeType.left = false;
					}
					if(event.keyCode == 39){
						codeType.right = false;
					}

				}
				
				function Move(){
					if(codeType.up){
						if(parseInt(obj.style.top)<=30)
						{
							return;
						}
						obj.style.top = obj.offsetTop - go_speed +'px';
					}
					if(codeType.down){
						if(parseInt(obj.style.top)<800)
						{
							obj.style.top = obj.offsetTop + go_speed +'px';
						}
					}
					if(codeType.left){
						if(parseInt(obj.style.left)>-10){
							obj.style.left = obj.offsetLeft - go_speed +'px';
						}
					}
					if(codeType.right){
						if(parseInt(obj.style.left) <= 1800){
							obj.style.left = obj.offsetLeft + go_speed +'px';
						}
					}
				}
			},

            createEnemy : function(){   //create enemy
                var ey = document.createElement('div');
                ey.className = 'enemy';

                ey.style.cssText = 'width:' + 100 + 'px; height:' + 75 + 'px';
				
				ey.style.top = ~~(Math.random()*(0 + 3000 + 1) -3000);
                ey.style.left = ~~(Math.random()*(this.layout.offsetWidth - 100)) + 'px';
                ey.setAttribute('blood', 1);
                ey.setAttribute('bullet', true);
				ey.setAttribute('down_speed',~~(Math.random()*(9-4)+4));
				ey.setAttribute('leri_speed',~~(Math.random()*(5-(-5))+(-5)));

                this.layout.append(ey);

                //Bullet collision
                if(this.data.ENEMY.bullet){
                    var That = this;
                    ey.timer1  = setInterval(function(){
                        That.createBullet('b2',ey, ey.offsetHeight, -1);
                    },~~(Math.random()*(3000-1000+1) + 1000	));

                }

                this.runEnemy(ey);
            },

            runEnemy : function(obj){   //Enemy movement

                var That = this;
				var ene_down_speed = parseInt(obj.getAttribute('down_speed'));
				var ene_leri_speed = parseInt(obj.getAttribute('leri_speed'));
                obj.timer = setInterval(function(){

                    obj.style.top = (obj.offsetTop + ene_down_speed) + 'px';
					obj.style.left = (obj.offsetLeft + ene_leri_speed) + 'px';

                    if(obj.offsetTop > That.layout.offsetHeight){
                        clearInterval(obj.timer);
                        obj.parentNode.removeChild(obj);
                    };
                },30)
            },

            createBullet : function(name, obj, h, direction){  //Create bullet

                var bt = document.createElement('div');
                bt.className = name;

                var _p = obj;

                bt.style.top = (_p.offsetTop + h - bt.offsetHeight * direction) + 'px';
                if(name == 'b1'){
					this.data.PLANE.goto_fire = !(this.data.PLANE.goto_fire);
					if(this.data.PLANE.goto_fire){
						bt.style.left = (_p.offsetLeft + _p.offsetWidth/2) -70 + 'px';
					}else{
						bt.style.left = (_p.offsetLeft + _p.offsetWidth/2) -22	 + 'px';
					}
					//player bullet
				}else{
					bt.style.left = (_p.offsetLeft + _p.offsetWidth/2) -20 + 'px';//enemy bullet
				}
                this.layout.append(bt);

                if(bt.classList.contains('b1')){
                   this.runBullet(bt,0,-30);
                }else{
                    this.runBullet(bt,0,10);

                }
            },


            runBullet : function(b,x,y){   //Bullet movement

                var That = this;
				var b_div = That.bloods;

                b.timer = setInterval(function(){

                    if(b.offsetTop <= 0 || b.offsetTop >= That.layout.offsetHeight || b.offsetLeft <= 0 || b.offsetLeft >= That.layout.offsetWidth){   //�߽��ж�

                        clearInterval(b.timer);
                        That.layout.removeChild(b);

                    }else{

                       b.style.cssText = 'top : ' + (b.offsetTop + y) + 'px; left : ' + (b.offsetLeft + x) + 'px';

                    }

                    for(var i = 0, EN = document.getElementsByClassName('enemy'), len = EN.length ; i < len ; i++ ){

                        if(That.TC(EN[i],b) && b.classList.contains('b1')){
                            clearInterval(b.timer);
                            That.layout.removeChild(b);
                            var Blood = EN[i].getAttribute('blood') - 1;
							
                            if(Blood){
                                EN[i].setAttribute('blood',Blood);
                            }else{
								That.boom(EN[i].style.top,EN[i].style.left);
                                var pare = EN[i];
                                EN[i].classList.remove("enemy");
                                EN[i].timer = setTimeout(function(){That.layout.removeChild(pare)},400);
                            }

                        }

                    }

                    if(That.TC(That.plane,b) && b.classList.contains('b2')){
                        clearInterval(b.timer);
                        That.layout.removeChild(b);
						var Plane_blood = That.plane.getAttribute('p_blood') - 20;
						
						
						if(Plane_blood){
							//b_div.style.width -= '100px';
							b_div.style.width = (parseInt(Plane_blood)) + "%";
							console.log(b_div);
							That.bloods.innerHTML = (parseInt(Plane_blood)) + '%';
							
							if(Plane_blood <= 40){
								b_div.style.background = 'red';
							}
							
							That.plane.setAttribute('p_blood',Plane_blood);
						}else{
							That.layout.removeChild(That.plane);
							That.gameOver();
							b_div.style.width = '100%';
							b_div.style.background = 'green';
						}
                    }


                },30)
            },
			
			boom: function(l,h){
				var names = document.getElementById("show");
				document.getElementById("boom").play();
				names.style.top = l;
				names.style.left = h;
				names.style.position = 'absolute';
				names.style.display = 'block';
				window.setTimeout(function(){
					names.style.display = 'none';
				},800);
			},
			

            gameOver : function(){

                document.getElementById("fire").pause();
                document.getElementById('bigboom').play();

                clearInterval(this.plane.itimer2);
                clearInterval(this.plane.itimer1);

                this.mystart.style.display = 'block';
                document.getElementsByClassName('bloods')[0].style.display = 'none';
                document.getElementById('name-over').getElementsByTagName('i')[0].innerHTML = 'GAME OVER!';
                document.getElementById('startBtn').value = 'AGAIN';

                while(this.layout.hasChildNodes()){
                    this.layout.removeChild(this.layout.firstChild);
                };

                this.bloods.innerHTML = '100%';
            },

            TC : function(obj1,obj2){   //collision detection

                var t1 = obj1.offsetTop,                      //up
                    r1 = obj1.offsetLeft + obj1.offsetWidth,  //right	
                    b1 = obj1.offsetTop + obj1.offsetHeight,  //down
                    l1 = obj1.offsetLeft,                     //left

                    t2 = obj2.offsetTop,                      //up
                    r2 = obj2.offsetLeft + obj2.offsetWidth,  //right
                    b2 = obj2.offsetTop + obj2.offsetHeight,  //down
                    l2 = obj2.offsetLeft;                     //left

                if(t1 > b2 || b1 < t2 || r1 < l2 || l1 > r2){
                    return false;
                }else{
                    return true;
                }
            },
         }