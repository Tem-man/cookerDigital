// components/xr-start/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fog:String,
    temperature:{
      type:Number,
      value:-1.232
    },
    controlState:{
      type:Number,
      value:0
    },
    btnY:Number,
    isShowParticle:Boolean,
    isStart:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
      scene:'',
      newTexture:'',
      move:0,
      btnFlag:true,
      rate:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setTime(){
        console.log("触发拖动");
        this.setData({
          move:this.data.move+1
        })
        console.log(this.data.move);
    },
    handleAssetsProgress: function ({detail}) {
      // console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function ({detail}) {
    
     
    },
  
    handleTouchModel: function ({detail}) {
   
      console.log("okokok");
    },
    handleBtn: function ({detail}) {
      console.log("btn被触发");
    
      this.triggerEvent('send');
      console.log("sensor:",this.data.temperature);
    },
    handleReady:function({detail}) {
      this.data.scene=detail.value;
      //  let camera = this.scene.getElementById('camera').getComponent(xrFrameSystem.Camera);
      //  console.log("camera:" ,camera);
      
    },
    
    handleGLTFLoaded ({detail}){
        console.log("detail:",detail.value.target);
        const el=detail.value.target;
        const gltf = el.getComponent("gltf");
     
    }
    
  }
})
