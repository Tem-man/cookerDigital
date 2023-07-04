#include <ESP8266WiFi.h>
#include <PubSubClient.h>
 
// 设置wifi接入信息(请根据您的WiFi信息进行修改)
const char* ssid = "Redmi 9A";
const char* password = "123456789wm";
const char* mqttServer = "broker.emqx.io";

 
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
 
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  // 设置板上LED引脚为输出模式
  pinMode(D6,OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);  // 启动后关闭板上LED
  
  Serial.begin(115200);               // 启动串口通讯
  
  //设置ESP8266工作模式为无线终端模式
  WiFi.mode(WIFI_STA);
  
  // 连接WiFi
  connectWifi();
  
  // 设置MQTT服务器和端口号
  mqttClient.setServer(mqttServer, 1883);
  // 设置MQTT订阅回调函数
  mqttClient.setCallback(receiveCallback);
 
  // 连接MQTT服务器
  connectMQTTserver();
}
 
void loop() {
  if (mqttClient.connected()) { // 如果开发板成功连接服务器
    mqttClient.loop();          // 处理信息以及心跳
  } else {                      // 如果开发板未能成功连接服务器
    connectMQTTserver();        // 则尝试连接服务器
  }
}
 
// 连接MQTT服务器并订阅信息
void connectMQTTserver(){
  // 根据ESP8266的MAC地址生成客户端ID（避免与其它ESP8266的客户端ID重名）
  String clientId = "esp8266-" + WiFi.macAddress();
 
  // 连接MQTT服务器
  if (mqttClient.connect(clientId.c_str())) { 
    Serial.println("MQTT Server Connected.");
    Serial.println("Server Address:");
    Serial.println(mqttServer);
    Serial.println("ClientId: ");
    Serial.println(clientId);
    subscribeTopic(); // 订阅指定主题
  } else {
    Serial.print("MQTT Server Connect Failed. Client State:");
    Serial.println(mqttClient.state());
    delay(5000);
  }   
}
 
// 收到信息后的回调函数
void receiveCallback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message Received [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println("");
  Serial.print("Message Length(Bytes) ");
  Serial.println(length);
 
  if ((char)payload[0] == '1') {     // 如果收到的信息以“1”为开始
    digitalWrite(BUILTIN_LED, LOW);  // 则点亮LED。
    digitalWrite(D6, HIGH);
    Serial.println("LED ON");
  } else {                           
    digitalWrite(BUILTIN_LED, HIGH); // 否则熄灭LED。
    digitalWrite(D6, LOW);
    Serial.println("LED OFF");
  }
}
 
// 订阅指定主题
void subscribeTopic(){
 
  
  String topicString = "ele-cooker";
  char subTopic[topicString.length() + 1];  
  strcpy(subTopic, topicString.c_str());
  
  // 通过串口监视器输出是否成功订阅主题以及订阅的主题名称
  if(mqttClient.subscribe(subTopic)){
    Serial.println("Subscrib Topic:");
    Serial.println(subTopic);
  } else {
    Serial.print("Subscribe Fail...");
  }  
}
 
// ESP8266连接wifi
void connectWifi(){
 
  WiFi.begin(ssid, password);
 
  //等待WiFi连接,成功连接后输出成功信息
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi Connected!");  
  Serial.println(""); 
}
