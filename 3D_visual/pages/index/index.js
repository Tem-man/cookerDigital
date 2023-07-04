// index.js
// 获取应用实例
const app = getApp()
var mqtt=require('../../utils/mqtt.min.js');
var client=null;
Page({
  data:{
    turnState:0,
    temperature:'',
    fog:'',
    btnY:0,
    isShowParticle:false,
    isStart:true,
   
  },
  
  recieve:function({detail}){
      console.log("e",detail);
      this.setData({
        btnY:this.data.btnY==0? -20 :this.data.btnY==-20? 20:-20,
        isShowParticle:this.data.isShowParticle?false:true,
        isStart:false,
        turnState:this.data.turnState == 0 ? 1 :0,
      })
    
      client.publish("ele-cooker", this.data.turnState.toString(), (err) => {
        console.log(err || "发布成功");
        console.log("发布：", this.data.turnState);
      });
  },
  panelControl:function({detail}){
    console.log("skd:",detail);
    this.setData({
      btnY:this.data.btnY==0? -20 :this.data.btnY==-20? 20:-20,
      isShowParticle:this.data.isShowParticle?false:true,
      isStart:false,
      turnState:this.data.turnState == 0 ? 1 :0,
    });
    client.publish("ele-cooker", this.data.turnState.toString(), (err) => {
      console.log(err || "发布成功");
      console.log("发布：", this.data.turnState);
    });
  },
  onLoad() {
    this.connectMqtt();
    const info = wx.getSystemInfoSync();
    const width = info.windowWidth;
    const height = info.windowHeight;
    const dpi = info.pixelRatio;
    this.setData({
      width, height,
      renderWidth: width * dpi,
      renderHeight: height * dpi
    });


  },
  onReady(){
    let that=this;
    client.on('message',function(topic,message){
      console.log('收到'+message.toString());
      let temp=message.toString().slice(0,2);
      let fog=message.toString().slice(2);
      temp=0.5725*temp-134.65;
      that.setData({
        temperature:temp/100,
        fog:fog,
      })
    })
   

  },
  getMsg:async function (){
    let result = await new Promise(function(resolve, reject){
      client.on('message',function(topic,message){
        console.log('收到'+message.toString());
         resolve(message.toString());
      });
    });
    this.setData({
      msgSensor:result
    })
  },
  connectMqtt:function(){
    const options={
      connectTimeout:1000,
      // clientId:'mp'+Math.ceil(Math.random()*10),
      clientId:'mp',
      port:8084,
      // username:'23c9d0d3b1cb48ac9b3d487e26d33e06',
      // password:'123456jm'
    }
    // broker.emqx.io/mqtt
    // www.lioneyy.top
    // t.yoyolife.fun
    client=mqtt.connect('wxs://broker.emqx.io/mqtt',options);
    client.on('connect',(e)=>{
      console.log('服务链接成功');
      client.subscribe('cookerState',{
        qos:1
      },function(err){
        if(!err){
          console.log('订阅成功');
        }
      })
    });
    client.publish("ele-cooker", this.data.turnState, (err) => {
      console.log(err || "发布成功");
    });
    
  
    client.on('reconnect',(error)=>{
      console.log('正在重连',error);
    });
    client.on('error',(error)=>{
      console.log('连接失败',error);
    })

  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
 
})
