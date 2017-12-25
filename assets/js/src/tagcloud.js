window.onload =function(){
    const cloud = document.getElementsByClassName('tag-cloud-tags')[0],
               R =180,
               _baseAngle = Math.PI/360,
               _screenW = document.body.scrollWidth,
               _screenH = document.body.scrollHeight,
               _focalLength = R * 1.5;
               let tagArr =[],
               speed =2,
               angleX = speed* _baseAngle,
               angleY =-speed*_baseAngle;
               var tag =function(ele,x,y,z){
                   this.ele=ele;
                   this.x =x;
                   this.y =y;
                   this.z =z;
               };
               tag.prototype ={
                   move:function(){
                       let scale = _focalLength /(_focalLength -this.z),
                           alpha = (this.z+R)/(2*R),
                           ele =this.ele;
                        ele.style.fontSize = 14*scale+"px";
                        ele.style.opacity = alpha+0.5;
                        ele.style.zIndex = parseInt(scale*100);
                        ele.style.left = this.x +cloud.offsetWidth /2 - ele.offsetWidth/2 +"px";
                        ele.style.top = this.y +cloud.offsetHeight/2 - ele.offsetHeight/2 +"px";
                   }
               };
               var init = function(){
                   const tags = document.getElementsByClassName('tag');
                   tagLen = tags.length;
                   for(let i=0;i<tagLen;i++){
                       let a = Math.acos((2*(i+1)-1)/tagLen -1),
                            b = a * Math.sqrt(tagLen * Math.PI),  // Φ = θ*sqrt(all * π)
               				x = R * Math.sin(a) * Math.cos(b), // x轴坐标: x=r*sinθ*cosΦ
               				y = R * Math.sin(a) * Math.sin(b), // y轴坐标: x=r*sinθ*cosΦ
               				z = R * Math.cos(a),		// z轴坐标: z=r*cosθ
               				t = new tag(tags[i] , x , y , z);
                           tags[i].style.color = '#'+Math.floor(Math.random()*0xffffff).toString(16);
                           tagArr.push(t);
                           t.move();
                   }
                   animate();
               };
               function rotateX(){
                   let cos = Math.cos(angleX),
                     sin = Math.sin(angleX);
                     tagArr.forEach(function(tag){
                         let y = tag.y*cos-tag.z*sin,
                             z = tag.z*cos+tag.y*sin;
                             tag.y =y;
                             tag.z =z;
                     })
               };
               function rotateY(){
                   let cos = Math.cos(angleY),
                     sin = Math.sin(angleY);
                     tagArr.forEach(function(tag){
                         let x = tag.x *cos -tag.z*sin,
                             z = tag.z*cos+tag.x*sin;
                             tag.x =x;
                             tag.z =z;
                     })
               };
               var timer = null;
               function animate(){
                   timer = setInterval(function(){
                       rotateX();
                       rotateY();
                       tagArr.forEach(function(tag){
                           tag.move();
                       })
                   },100)
               };
               init();
               $('.tag')
               .mouseover(function(){
                 clearInterval(timer);
               })
               .mouseout(function(){
                timer = setInterval(function(){
                       rotateX();
                       rotateY();
                       tagArr.forEach(function(tag){
                           tag.move();
                       })
                   },100)
               })
}