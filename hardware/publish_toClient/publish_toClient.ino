#include "mqtt_fun.h"
#include "sht30.h"
unsigned int sensorValue = 0;
String temperature;
String fog;
void setup(){
  pinMode(A0, INPUT);
  Serial.begin(115200);
  mqtt_setup();
  sht30_setup();
}

void loop (){
 
  sht30();
  Serial.print("温度 = ");
  Serial.println(sht_data.temperature);
  sensorValue = analogRead(A0);
  Serial.print("烟雾 = ");
  Serial.println(sensorValue);
  temperature=String(sht_data.temperature);
  fog=String(sensorValue);
  mqtt_publish(temperature+fog,"cookerState");
  Serial.print("温度+烟雾 = ");
  Serial.println(temperature+fog);
  delay(3000);
}
