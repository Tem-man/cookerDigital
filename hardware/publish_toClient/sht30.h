//********sht30 温湿度传感器***************

#include <Wire.h>
#include "ClosedCube_SHT31D.h"
ClosedCube_SHT31D sht3xd;

// 配置引脚
const int SHT_SCL = D4; 
const int SHT_SDA = D3;

const int SHT_ADDRESS = 0x44;

//配置读取频率

struct SHT_DATA{
  int8_t temperature = -99;
  int8_t humidity = -99;
  unsigned long sht30_last = 0;
const long sht30_interval = 3000; //每秒读取一次

} sht_data;

//开机函数
void sht30_setup() {
  
  //定义I2C通讯的引脚
  Wire.begin(SHT_SDA, SHT_SCL);
  
  //准备读取sht3x传感器
  sht3xd.begin(SHT_ADDRESS);
  if (sht3xd.periodicStart(SHT3XD_REPEATABILITY_HIGH, SHT3XD_FREQUENCY_10HZ) != SHT3XD_NO_ERROR){
    Serial.println("[ERROR] 读取sht30数据失败，可能是传感器没插好");
  }
}

//保存结果到指定的数据结构，如果传感器断开，则尝试重载
void saveResult(SHT31D result) {
  if (result.error == SHT3XD_NO_ERROR) {
    sht_data.temperature = result.t;
    sht_data.humidity = result.rh;
  } else {  
    sht_data.temperature = -99;
    sht_data.humidity = -99;
    sht30_setup();
  }
}

//循环体函数，放在loop中
void sht30() {
  unsigned long currentMillis = millis();
  if (currentMillis - sht_data.sht30_last >= sht_data.sht30_interval) {
    sht_data.sht30_last = currentMillis;
    saveResult(sht3xd.periodicFetchData());
//    Serial.print("T:");
//    Serial.print(sht_data.temperature);
//    Serial.print(" H:");
//    Serial.println(sht_data.humidity);
    
  }

}
