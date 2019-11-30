<template>
  <div class="fate-index">
    <div class="fate-login-box">
      <img src="../assets/FATE.png" alt="" srcset="">
      <input type="text" v-model="playname" class="fate-login-box-input" maxlength="4" placeholder="创建游戏名称,最多4个字">
      <img src="../assets/gobtn.png" alt="" srcset="" @click="gofate">
    </div>
    <div class="fate-foot">
      <div>The conditions for winning the game depend entirely on fate</div>
      <div>游戏胜利的条件完全靠命运</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data(){
    return{
      playname:""
    }
  },
  methods:{
    gofate(){
      if(this.playname){
        this.$router.push({
          path:'/fate',
          query:{
            playname:this.playname
          }
        })
      }else{
         this.$alert('请先给你的命运安一个名称把', '命运提示', {
          confirmButtonText: '确定'
        });
      }
    }
  }
}
</script>
<style>
  .fate-index{ width: 100%; height: 100%; background: url('../assets/bg.png') no-repeat 50% 50%; background-size: cover; position: relative;}
  .fate-login-box{ position: fixed; z-index: 33; top: 40%; left: 50%; transform: translate(-50%,-50%)}
  .fate-login-box-input{ font-weight: bold; outline: none; padding:0  20px; width: 400px;line-height: 70px; height: 70px; color:#a61046;font-size: 1.4rem; background: #fff; border: none; border-radius: 40px; margin: 40px 0 20px; }
  .fate-login-box img{ display: block; margin: auto; max-width: 400px;}
  .fate-foot{ text-align: center; color: #fff; opacity: 0.6; font-size: 1rem; font-weight: 200; position: fixed; z-index: 22; bottom: 0; left: 0; width: 100%; padding: 0.5rem;}
</style>
