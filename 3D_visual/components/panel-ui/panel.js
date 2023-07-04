// components/panel-ui/panel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    allTime:0,
    seconds:'00',
    minutes:'00',
    timeOut:0,
    mode:0,
    outAllTime:0,
    outMinutes:'00',
    outSeconds:'00',
    isStart:false,
    islimit:false,
    imgScr:'/images/close.png',
    isImg:true,
    isPanel:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toggle() {
      if(this.data.isImg){
        this.setData({
          imgScr:'/images/open.png',
          isPanel:true
        })
        this.data.isImg=false
      }else {
        this.setData({
          imgScr:'/images/close.png',
          isPanel:false
        })
        this.data.isImg=true
      }
    },
    seletMode({target}){
      console.log("mode",target.dataset.mode);
        this.setData({
          mode:target.dataset.mode
        })
     },
    //  设置时间
     format(t) {
      return t < 10 ? "0" + t : t;
    },
     addHandle({target}){
       console.log("time:",target.dataset);
       this.setData({
         isStart:true,
      
       })
       if(this.data.mode=="0"){
         console.log("mode:",1);
         this.setData({
          allTime:this.data.allTime + target.dataset.addone*1,
        })
        this.setData({
          minutes:this.format(parseInt(this.data.allTime*60/60)),
          seconds:this.format(parseInt(this.data.allTime*60 % 60))
        })
       } else {
        this.setData({
          timeOut:this.data.timeOut+target.dataset.addone*1,
        });
        this.setData({
          outMinutes:this.format(parseInt(this.data.timeOut*60/60)),
          outSeconds:this.format(parseInt(this.data.timeOut*60 % 60))
        })
        console.log("timeOut:",this.data.timeOut);
       }
       
     },
     countTime (timeLoopx,timeOutx,outMinutesx,outSecondsx,anyx){
      function format(t) {
        return t < 10 ? "0" + t : t;
      }
      this.setData({
        [timeOutx]:this.data[timeOutx]*60-1,
     
      });
        timeLoopx = setInterval(()=>{
          this.setData({
            [timeOutx]:this.data[timeOutx]-1,
            [outMinutesx]:format(parseInt(this.data[timeOutx] / 60)),
            [outSecondsx]:format(parseInt(this.data[timeOutx] % 60))
          });
         
          if(this.data[timeOutx] <=-1){
            if(anyx==undefined){
              this.setData({
                mode:"0"
              });
              console.log(this.data.allTime);
          
             clearInterval(timeLoopx);
             this.setData({
              islimit:false
             })
             let mytime= null;
             this.triggerEvent('panelevent',1);
             this.countTime(mytime,'allTime','minutes','minutes',0)
              clearInterval(mytime);
              console.log("aaa");
            }else {
              console.log(anyx);
              this.triggerEvent('panelevent',0);
              clearInterval(timeLoopx);
              this.setData({
                islimit:false
               })
            }
           
           
          }
        },1000);
     },
     start(){
      let timeLoop=null;
      let loop=null;
      if(!this.data.isStart || this.data.islimit) return;
      if(this.data.mode=="0") {
      this.setData({
      islimit:true
       })
       this.triggerEvent('panelevent',1);
      this.countTime(loop,'allTime','minutes','seconds',-20)
    
      }else {

      this.setData({
          islimit:true
      })

        this.countTime(timeLoop,'timeOut','outMinutes','outSeconds')
        
      }
      
     },
  }


})
