<template>
  <div class="player trn" 
  :style="{
      'width':roleinfo.erare[0]+'px',
      'height':roleinfo.erare[1]+'px',
      'line-height':roleinfo.erare[1]+'px',
      'top':roleinfo.y+'px',
      'left':roleinfo.x+'px',
      'background':roleinfo.erColor
    }" 
    ref="ers">
    <el-popover placement="top" trigger="manual" :content='sayany' v-model="issay">
        <span  slot="reference">{{roleinfo.playname.substr(0, 1)}}</span>
    </el-popover>
    <!-- 具体生命值 -->
    <div class="live">{{roleinfo.live}}</div>
    <!-- 武器 -->
    <div class="melee-attack trn" :class="roleinfo.direction" :style="{
        'width':roleinfo.meleeAttack.w+'px',
        'height':roleinfo.meleeAttack.h+'px',
        'transform': 'rotateZ('+meleeAttackDistAngle+'deg)',
        'background':roleinfo.meleeAttack.color
        }">
    </div>
    <!-- 子弹 -->
    <div class="attack" 
    v-for="(i,ikey) in roleinfo.att" :key="ikey"   
    :style="{
        'top':i.atty+'px',
        'left':i.attx+'px',
        'width':i.w+'px',
        'height':i.h+'px',
        'transform': 'rotateZ('+attangle+'deg)',
        'background':roleinfo.attColor
    }"
    :class="{'isbui':i.state==1||i.state==3,'isover':i.state==3||i.state==2}"    
    ></div> 
  </div>
</template>

<script>
export default {
    name:'er',
    props:{
        role:Object,//角色信息
        arena:Object,//竞技场信息
        foe:Object//对手信息
    },
    data(){
        return{
            issay:false,//角色是否说话
            sayany:'',//角色说话内容
            roleinfo:this.role,//角色信息
            attcount:0,//记录按攻击次数
            attgo:this.role.att.map(item=>{return ''}),//记录攻击路径的动画
            addatty:0,//y的移动量要根据子弹旋转角度进行计算
            attangle:0,//子弹旋转角度
            fulldeg:360,//子弹的满旋转角度
            meleeAttackDistAngle:this.role.direction=='left'?60:-60,//武器的初始旋转角度
            oper:this.$U.operation(),//获取操作手册
            aifd:'' //记录电脑疯癫状态的计时
        }
    },
    //深度监听角色信息
    watch:{
        role:{//一进来监听父类传来的角色信息进行给本地角色信息赋值，这样好在本组件内随意改变角色信息
            handler(newVal,oldVal){
                this.roleinfo=newVal;
            },
            deep:true
        },
        roleinfo:{//监听本组件的角色信息，监听到变化立马回抛给父类，好让父类同步角色信息
            handler(newVal,oldVal){
                if(newVal.live<=0){
                    this.erSay('我已经死亡')
                }
                if(this.role.x>this.foe.x){
                    this.roleinfo.direction='left'
                }else{
                    this.roleinfo.direction='right'
                }
                this.$emit('erchange',newVal)
            },
            deep:true
        },
        arena:{
            handler(newVal,oldVal){//监听竞技场信息，好同步父类传进来对操作的释放与赋予的指令
                if(newVal.isStart){//收到游戏开始的指令，赋予角色操作
                    if(!this.roleinfo.isai){//玩家给与操控权限
                        console.log('游戏开始，玩家可操控角色');
                        window.addEventListener("keydown",this.opers,true)
                    }else{
                        this.aiLevel1() //ai随机移动，无限射击和斩击
                    }
                }else{//收到游戏结束，释放一切操作，包括子弹运动
                    if(!this.roleinfo.isai){
                        console.log('游戏结束，玩家不可操控角色');
                        window.removeEventListener("keydown", this.opers, true);
                    }
                    clearInterval(this.aifd) //游戏结束，电脑停止疯癫
                    clearInterval(this.attgo[this.attcount])//停止所有还在飞的子弹
                    clearInterval();//停止当前组件的所有计时器
                }
            },
            deep:true
        }
    },
    methods:{
        //玩家操作赋予
        opers(e){
            this.moveplay(e.code);
            this.toAttack(e.code)
        },
        //电脑随机操作算法
        aiLevel1(){
            var movecodes=[this.oper.moveLEFT[0],this.oper.moveRIGHT[0],this.oper.moveDOWN[0],this.oper.moveUP[0]]
            var attcodes=[this.oper.TOPSPIN[0],this.oper.BOTTOMSPIN[0]]
            this.aifd=setInterval(()=>{//电脑随机操作计时器
                if(this.arena.isStart){//在游戏开始状态下进行随机操作
                    var mi=this.$U.randomNum(0,3)//随机生成移动方向
                    var aii=this.$U.randomNum(0,1)//随机生成子弹旋转方向
                    this.moveplay(movecodes[mi]);//移动
                    this.toAttack(attcodes[aii])//子弹轨迹旋转
                    this.toAttack(this.oper.FIRE[0])//无限射击
                    this.toAttack(this.oper.CUT[0])//无限挥砍
                    if(this.attcount>=this.roleinfo.att.length){//子弹用完自动上膛
                        this.toAttack(this.oper.LOADGUN[0])
                    }
                }else{
                    clearInterval(this.aifd)
                }
            },100)
        },
      //角色移动
      moveplay(code){
        switch (code) {
          case this.oper.moveLEFT[0]:this.roleinfo.x=this.roleinfo.x-this.roleinfo.speed>0?this.roleinfo.x-this.roleinfo.speed:0;
          break;
          case this.oper.moveRIGHT[0]:this.roleinfo.x=this.roleinfo.x+this.roleinfo.speed<this.arena.aW-this.roleinfo.erare[0]?this.roleinfo.x=this.roleinfo.x+this.roleinfo.speed:this.arena.aW-this.roleinfo.erare[0];
          break;
          case this.oper.moveDOWN[0]:this.roleinfo.y=this.roleinfo.y+this.roleinfo.speed<this.arena.aH-this.roleinfo.erare[1]?this.roleinfo.y=this.roleinfo.y+this.roleinfo.speed:this.arena.aH-this.roleinfo.erare[1];
          break;
          case this.oper.moveUP[0]:this.roleinfo.y=this.roleinfo.y-this.roleinfo.speed>0?this.roleinfo.y-this.roleinfo.speed:0;
          break;
          default:
            break;
        }
      },
      //角色攻击
      toAttack(code){
        if(code==this.oper.CUT[0]){//近击，武器攻击
            if(this.roleinfo.meleeAttack.state==0){
                this.roleinfo.meleeAttack.state=1;
                
                if(this.roleinfo.direction=='left'){
                    this.meleeAttackDistAngle=-60;
                    this.roleinfo.meleeAttack.attx=this.roleinfo.x-(this.roleinfo.erare[0]*0.1)-this.roleinfo.meleeAttack.w
                }else{
                    this.meleeAttackDistAngle=60;
                    this.roleinfo.meleeAttack.attx=this.roleinfo.x+(this.roleinfo.erare[0]*0.9)
                }
                this.roleinfo.meleeAttack.atty=this.roleinfo.y+10

                if(this.ishit(this.roleinfo.meleeAttack,'melee')){//判断是否击中
                    this.roleinfo.meleeAttack.state=2//设置当前子弹打中目标
                    this.$emit('meleehit')//砍到回调
                    this.erSay('砍你')
                }
                setTimeout(()=>{
                    this.meleeAttackDistAngle=this.roleinfo.direction=='left'?60:-60;
                    setTimeout(()=>{this.roleinfo.meleeAttack.state=0},100)
                },100)
            }
        }
        //旋转枪口/控制子弹路线    
        if(code==this.oper.TOPSPIN[0]){//顺时
            this.attangle=this.attangle+10>=360?0:this.attangle+10;
            this.addatty=Math.tan(this.attangle * Math.PI / 180)
        }
        if(code==this.oper.BOTTOMSPIN[0]){//逆时
            if(this.attangle!=0){this.fulldeg=this.attangle}
            this.attangle=this.fulldeg-10<0?360:this.fulldeg-10;
            this.fulldeg=this.attangle
            this.addatty=Math.tan(this.attangle * Math.PI / 180)
        }
        //远程攻击，子弹攻击
        if (code==this.oper.FIRE[0]) {
            var l=this.$refs.ers.offsetLeft
            var t=this.$refs.ers.offsetTop;
            if(this.attcount<this.roleinfo.att.length){//在子弹数内才能发射
                if(this.roleinfo.att[this.attcount].state==0){//判断当前子弹是否待发射
                    this.roleinfo.att[this.attcount].state=1//设置当前子弹为飞行状态
                    //设置为飞行后，改为fixed层级，得初始化子弹的起点
                    this.roleinfo.att[this.attcount].attx=this.arena.ol+l;
                    this.roleinfo.att[this.attcount].atty=t+this.arena.ot
                    this.attgo[this.attcount]= setInterval(()=>{
                        if ( 
                            this.roleinfo.att[this.attcount].attx>this.arena.aW+this.arena.ol
                            ||
                            (this.roleinfo.att[this.attcount].attx-this.arena.ol)<0
                            ||
                            this.roleinfo.att[this.attcount].atty>this.arena.aH+this.arena.ot
                            ||
                            (this.roleinfo.att[this.attcount].atty-this.arena.ot)<0
                        ) {//判断子弹已经超过竞技场
                            this.roleinfo.att[this.attcount].state=3//设置当前子弹用完了
                            clearInterval(this.attgo[this.attcount])//停掉当前计时
                            this.attcount++;
                        }else{
                            if(this.ishit(this.roleinfo.att[this.attcount],'remote')){//判断是否击中
                                this.roleinfo.att[this.attcount].state=2//设置当前子弹打中目标
                                this.$emit('tohit')
                                this.erSay('击中目标')
                                clearInterval(this.attgo[this.attcount])//停掉当前计时
                                this.attcount++;
                            }else{
                                if(this.attangle==270){
                                    this.roleinfo.att[this.attcount].atty-=1
                                }else if(this.attangle==90){
                                    this.roleinfo.att[this.attcount].atty+=1
                                }else if(this.attangle==0||this.attangle==360){
                                    this.roleinfo.att[this.attcount].attx+=1 //让子弹飞
                                }else if(this.attangle==180){
                                    this.roleinfo.att[this.attcount].attx-=1 //让子弹飞
                                }else if(this.attangle>0&&this.attangle<90){
                                    this.roleinfo.att[this.attcount].attx+=1 //让子弹飞
                                    this.roleinfo.att[this.attcount].atty+=this.addatty
                                }else if(this.attangle>90&&this.attangle<180){
                                    this.roleinfo.att[this.attcount].attx-=1 //让子弹飞
                                    this.roleinfo.att[this.attcount].atty-=this.addatty
                                }else if(this.attangle>180&&this.attangle<270){
                                    this.roleinfo.att[this.attcount].attx-=1 //让子弹飞
                                    this.roleinfo.att[this.attcount].atty-=this.addatty
                                }else{
                                    this.roleinfo.att[this.attcount].attx+=1 //让子弹飞
                                    this.roleinfo.att[this.attcount].atty+=this.addatty
                                }
                            }
                        }
                    },this.roleinfo.attSpeed)
                }
                // else{
                //     this.erSay('子弹还在发射,一次只能发射一枚子弹')
                // }
            }else{
                this.erSay('子弹用完，按Q重新上膛')
            }
        }
        //上膛
        if (code==this.oper.LOADGUN[0]) {
            if(this.attcount>=this.roleinfo.att.length) {
                this.attcount=0;
                this.roleinfo.att.map((item,i)=>{
                    item.state=0;
                    item.attx=0;
                    item.atty=i*6;
                })
                this.attgo=this.role.att.map(item=>{return ''})
                this.erSay('子弹上膛完成，再干一波')
            }else{
                this.erSay('还有子弹，打完再上膛')
            }
        }
      },
      //角色说话
        erSay(txt){
            this.sayany=txt;
            this.issay=true;
            setTimeout(()=>{this.issay=false;},1000)
        },
        ishit(att,type){//是否击中 传攻击的坐标和宽高四个参数，xywh  然后制作四边的四个点，进行去判断是否在目标坐标范围内
            var fd=[
                [att.attx,att.atty],
                [att.attx+att.w,att.atty],
                [att.attx,att.atty+att.h],
                [att.attx+att.w,att.atty+att.h]
            ]
            var kk=false;
            fd.map(f=>{
                var tfx=f[0]
                var tfy=f[1]
                if(type=='remote'){
                    tfx=f[0]-this.arena.ol
                    tfy=f[1]-this.arena.ot
                }
                if(
                    (tfx>=this.foe.x&&tfx<=(this.foe.x+this.foe.erare[0]))
                    &&
                    (tfy>=this.foe.y&&tfy<=(this.foe.y+this.foe.erare[1]))
                ){
                    
                    kk=true;
                }
            })
            return kk
        }
    },
    //销毁的时候，注销监听
    destroyed(){
        if(!this.roleinfo.isai){
        window.removeEventListener("keydown", this.opers, true);
        }
    }
    
}
</script>

<style>
.player{ position: absolute; font-size: 1rem; z-index: 33;  border-radius: 50%; color: #fff; text-align: center;}
.live{ position: absolute;bottom: 100%; left: 0; z-index: 333; color: #333; line-height: 20px; font-weight: bold; font-size: 12px;}
.attack{ position: absolute; z-index: 6666; border-radius:0  10px 10px 0; transform-origin: left center;  }
.isbui{position: fixed;}
.isover{ display: none;}
.melee-attack{position: absolute;left:90%; top: 10px; z-index: 666; border-radius: 0  0  2rem 0;  transform-origin: left center;transform: rotateZ(330deg)}
.melee-attack.left{left:auto; right: 90%; transform-origin: right center; border-radius: 0  0 0 2rem; transform: rotateZ(30deg)}
</style>