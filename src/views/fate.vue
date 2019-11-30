<template>
  <div class="fate">
    <div class="loading" v-if="loadTime>0">
        {{loadTime}}
    </div>
    <div v-else>
      <!-- 血条和角色信息 -->
      <div class="fate-xt box " :style="{'width':arena.aW+'px'}">
        <div class="ername">{{player.playname}}</div>
        <div class="box-f1">
          <el-progress v-if="player.live&&progress[0]" :text-inside="true" :stroke-width="26" :percentage="player.live/progress[0]<0?0:player.live/progress[0]*100" ></el-progress>
          <div class="eragg"> <span class="pr5">射击攻击力：{{player.aggressivity}}</span> <span>斩击攻击力：{{player.meleeAttack.aggressivity}}</span> </div>
        </div>
        <div class="gametime">{{gametime}}秒</div>
        <div class="box-f1">
          <el-progress v-if="ai.live&&progress[1]" :text-inside="true" :stroke-width="26" :percentage="ai.live/progress[1]<0?0:ai.live/progress[1]*100"  ></el-progress>
          <div class="eragg tr"><span class="pr5">{{ai.meleeAttack.aggressivity}}：斩击攻击力</span><span>{{ai.aggressivity}}:射击攻击力</span></div>
        </div>
        <div class="ername">{{ai.playname}}</div>
      </div>
      <!-- 竞技场 -->
      <div class="arena" :style="{'width':arena.aW+'px','height':arena.aH+'px'}" ref="arena">
        <er :role='player' :foe='ai' :arena='arena'  @erchange='erchange'  @tohit='tohit' @meleehit='meleehit'/>
        <er :role='ai' :foe='player' :arena='arena'  @erchange='aichange' @tohit='aitohit' @meleehit='aimeleehit'/>
      </div>
      <!-- 操作按钮提示 -->
      <div class="manual box box-ac" :style="{'width':arena.aW+'px'}">
        <div class="box-f1">
          <div class="maul-btn">Q <span>上膛</span></div>
          <div class="box box-ac">
            <div class="maul-btn">A <span>射击</span></div>
            <div class="maul-btn">S <span>上旋</span></div>
            <div class="maul-btn">D <span>下旋</span></div>
          </div>
          <div class="maul-btn">Z <span>斩击</span></div>
        </div>
        <div class="move-btn">
          <div class="maul-btn up">上</div>
          <div class="box box-ac">
            <div class="maul-btn">左</div>
            <div class="maul-btn">下</div>
            <div class="maul-btn">右</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import er from "./er.vue"; //引入角色组件
  export default {
    name:"fate",
    components:{er},//把角色组件实例化
    data(){
      return{
        loadTime:3,
        gametime:60,
        gt:"",//游戏时间计时器
        result:0,//游戏胜负结果 0没开始或者正在游戏，1玩家胜利，2玩家失败，3平局
        resultEX:['一决高下','胜利','失败','平局'],
        arena:{
          aW:800,//竞技场宽高
          aH:600,
          isStart:false //是否开始游戏
        },//竞技场的其他信息 目前只有距离屏幕顶部和距离左边的距离
        progress:[],//血条总量
        progressone:0,//变化的血条量
        progresstwo:0,//变化的血条量

        /**玩家数据 */
        player:{
          erare:[42,42],//竞技人身躯大小  //需要随机生成
          erColor:"#000",
          isai:false,//是否机器人
          isAttack:false,//是否发射攻击
          x:100,//起始位置坐标
          y:100,//起始位置坐标
          playname:this.$route.query.playname?this.$route.query.playname:'ZZZ', //玩家名字
          speed:22,//移速
          att:[//子弹
            {attx:0,atty:0,w:10,h:4,state:0},//子弹起始位置，大小，状态（0为待发射，1为飞行中，2为击中目标，3为飞出边界）
            {attx:0,atty:6,w:10,h:4,state:0},
            {attx:0,atty:12,w:10,h:4,state:0},
            {attx:0,atty:18,w:10,h:4,state:0},
            {attx:0,atty:24,w:10,h:4,state:0}
          ],
          attColor:"#ee790c",
          attSpeed:2,//射速(越小射速越快)
          aggressivity:1000,//远距离攻击力
          direction:'right',//初始攻击方向,尖刀指向的方向
          meleeAttack:{//近身攻击
            aggressivity:20,//斩击攻击力
            w:20,//大刀宽度
            h:8,//大刀高度
            
            state:0,//攻击状态
            color:"#ee2f2f"
          },
          live:1000//生命值
        },

        /**电脑数据 */
        ai:{
          erare:[100,100],//竞技人的占地
          erColor:"#14d2eb",
          isai:true,//是否机器人
          isAttack:false,//是否发射攻击
          x:400,//位置坐标
          y:300,//位置坐标
          playname:'命',
          speed:100,//移速
          att:[//子弹
            {attx:0,atty:0,w:10,h:4,state:0},//子弹起始位置，大小，状态（0为待发射，1为飞行中，2为击中目标，3为飞出边界）
            {attx:0,atty:6,w:10,h:4,state:0},
            {attx:0,atty:12,w:10,h:4,state:0},
            {attx:0,atty:18,w:10,h:4,state:0},
            {attx:0,atty:24,w:10,h:4,state:0}
          ],
          attColor:"#ecdd0b",
          attSpeed:5,//射速(越小射速越快)
          aggressivity:1000,//射击攻击力
          direction:'left',
          meleeAttack:{//近身攻击
            aggressivity:500,
            w:60,
            h:20,
            state:0,
            color:"#ddd"
          },
          live:1000//生命值
        }
      }
    },
    created(){
      this.init()
    },
     watch:{
       loadTime(lt){
         if(lt<=0){
            this.$nextTick(()=>{
              this.arena=Object.assign({},this.arena,{
                ol:this.$refs.arena.offsetLeft,
                ot:this.$refs.arena.offsetTop
              });
              setTimeout(()=>{
                this.arena.isStart=this.result==0;
                //游戏开始后就开始倒计时60秒
                this.gt=setInterval(() => {
                  if(this.gametime<=0){
                    clearInterval(this.gt);
                    this.winAndFailovertime()
                  }else{
                    this.gametime--;
                  }
                }, 1000);
              },20)
            })
         }
       },
       gametime(gtt){
         if(gtt<=0){
           this.arena.isStart=false;
         } 
       }

     },
    methods:{
      init(){//主入口
        this.player=Object.assign({},this.player,this.romer())
        this.ai=Object.assign({},this.ai,this.romer())
        this.progress[0]=this.player.live
        this.progress[1]=this.ai.live
        this.countdown();
      },
      countdown(){//加载倒计时
        var loadsi=setInterval(()=>{
          if (this.loadTime<=0) {
            clearInterval(loadsi)
          }else{
            this.loadTime--;
          }
        },1000)
      },
      //随机生成角色数据
      romer(){
        var erwh=this.$U.randomNum(40,100) //角色大小，40-100
        var erx=this.$U.randomNum(erwh,this.arena.aW-erwh) //角色初始位置在场地范围内随机
        var ery=this.$U.randomNum(erwh,this.arena.aH-erwh)
        var speed=this.$U.randomNum(30,130)//移速随机
        var attSpeed=this.$U.randomNum(1,5)//射速随机
        var live=this.$U.randomNum(1000,10000)//生命值在1000到10000直接随机
        var aggressivity=this.$U.randomNum(Math.ceil(live/7),Math.ceil(live/3))//远程攻击力在自身生命值的7分1到3分1之间
        var mettaggressivity=aggressivity/this.$U.randomNum(1,5)//近程攻击力在远程攻击力的5分一到1
        var att=[]//子弹数从5-10个随机
        for(var i=0;i<this.$U.randomNum(5,10);i++){
          att.push({attx:0,atty:(Math.ceil(erwh/25)+2)*i,w:Math.ceil(erwh/10),h:Math.ceil(erwh/25),state:0});
        }
        var mw=erwh/2//武器长是角色大小的一半
        var mh=mw/3//武器高是长的3分一
        return {
          erare:[erwh,erwh],//竞技人身躯大小  //需要随机生成
          x:erx,//起始位置坐标
          y:ery,//起始位置坐标
          speed:speed,//移速
          att:att,
          attSpeed:attSpeed,//射速(越小射速越快)
          aggressivity:aggressivity,//远距离攻击力
          meleeAttack:{//近身攻击
            aggressivity:mettaggressivity,//斩击攻击力
            w:mw,//大刀宽度
            h:mh,//大刀高度
            state:0,
            color:"#ddd"
          },
          live:live//生命值
        }

      },
      //玩家数据变化回调
      erchange(v){
        this.player=v;
        //console.log(v.att[0].attx,v.att[0].atty);
      },
      //玩家远程攻击击中回调
      tohit(){
        this.ai.live=this.ai.live-this.player.aggressivity
         this.winAndFail()
      },
      //玩家近攻击击中回调
      meleehit(){
        this.ai.live=this.ai.live-this.player.meleeAttack.aggressivity
         this.winAndFail()
      },

      //电脑数据变化回调
      aichange(v){
        this.ai=v;
        
      },
      //电脑远程攻击击中回调
      aitohit(){
        this.player.live=this.player.live-this.ai.aggressivity
        this.winAndFail()
      },
      //电脑近攻击击中回调
      aimeleehit(){
        this.player.live=this.player.live-this.ai.meleeAttack.aggressivity
        this.winAndFail()
      },

      //判断输赢
      winAndFail(){
        var txt=""
        if(this.player.live<=0){
          this.result=2
          txt="您被"+this.ai.playname +'迷失了心智'
        }
        if(this.ai.live<=0){
          this.result=1
          txt="您战胜了"+this.ai.playname 
        }
        if(this.ai.live<=0&&this.player.live<=0){
          this.result=3
          txt="您与"+this.ai.playname +'已经和解'
        }

        this.wfalert(0,txt)
      },
      //游戏时间结束后判断输赢
      winAndFailovertime(){
        var txt=""
        if(this.player.live<this.ai.live){
          this.result=2
          txt="您被"+this.ai.playname +'迷失了心智'
        }
        if(this.ai.live<this.player.live){
          this.result=1
          txt="您战胜了"+this.ai.playname 
        }
        if(this.ai.live==this.player.live){
          this.result=3
          txt="您与"+this.ai.playname +'已经和解'
        }
        this.wfalert(1,txt)
      },
      //游戏结果弹窗 it调用的时间状态 （0为血条为0时调用，1为游戏时间结束时调用） txt游戏结果文字
      wfalert(it,txt){
        if(this.result>0){
          clearInterval(this.gt)
          this.arena.isStart=false;
          var  altxt=it?'游戏时间到，'+txt:'用时'+(60-this.gametime)+'秒，'+txt
          this.$alert(altxt, this.resultEX[this.result], {
            confirmButtonText: '再来一局',
            showClose:false,
            type:this.result==1?'success':this.result==2?'error':'info',
            center: true
          }).then(()=>{
            this.loadTime=3;
            this.gametime=60;
            this.result=0;
            this.init()
          })
          
        }
      }
    }
  }
</script>

<style>
  .fate{ width: 100%; height: 100%; background: url('../assets/bg.png') no-repeat 50% 50% #000; background-size: cover; position: relative; padding-top: 20px;}
  .fate-xt{margin: 0 auto 10px; }
  .fate-xt .ername{ color: #fff; padding: 0 10px; font-size: 16px; font-weight: bold}
  .fate-xt .gametime{ color: #fff; padding: 0 10px;font-size: 18px; font-weight: bold}
  .fate-xt .eragg{ color: #fff; font-size: 12px; font-weight: bold; padding-left: 5px;}
  .fate-xt .eragg.tr{ text-align: right; padding-left: 0; padding-right: 5px;}
  .fate-xt .eragg .pr5{ padding-right: 10px;}
  .arena{ background: #fff;  position: relative; margin:0 auto; border: 10px solid #dfdfdf; border-radius: 16px;  color: #14d2eb}
  .loading{ z-index: 3; position: absolute; font-weight: bold; width: 120px; height: 120px; top: 50%;left: 50%; transform: translate(-50%,-50%); text-align: center; line-height: 100px; font-size: 100px; color: #fff;}
  .manual{ color: #FFF; margin: auto; padding: 10px ;}
  .maul-btn{ margin-bottom: 30px; margin-right: 10px; background: url('../assets/btnbg.png') no-repeat 50% 50%; text-align: center; font-size: 18px; line-height: 35px; font-weight: bold; background-size: cover; width: 40px; height: 40px; position: relative}
  .maul-btn span{ position: absolute; top: 100%; left: 0; width: 100%; text-align: center; font-size: 14px; line-height: 20px}
  .move-btn .maul-btn{ width: 60px; height: 60px; line-height: 55px; font-size: 20px;margin-bottom:0;}
  .maul-btn.up{ margin-left:70px;margin-bottom:0;}
</style>
