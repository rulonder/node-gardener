/* Simple Serial ECHO script : Written by ScottC 03/07/2012 */
#include <stdlib.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <NewPing.h>
// definitions
#define TRIGGER_PIN  12  // Arduino pin tied to trigger pin on ping sensor.
#define ECHO_PIN     11  // Arduino pin tied to echo pin on ping sensor.
#define MAX_DISTANCE 100 // Maximum distance we want to ping for (in centimeters). Maximum sensor distance is rated at 400-500cm.
NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE); 
unsigned int pingSpeed = 50; // How frequently are we going to send out a ping (in milliseconds). 50ms would be 20 times a second.
unsigned long pingTimer;     // Holds the next ping time.
// time from start
unsigned long time;
unsigned long time_start_pump;
unsigned long time_end_pump;
boolean is_pump = false;
/* Use a variable called byteRead to temporarily stopre
   the data coming from the computer */
int byteRead;
// configure dht11 sensor
// #define DHTTYPE DHT22 
#define DHTPIN 2  //Digital pin for comunications to the temp/humidity sensor
#define DHTTYPE DHT11 

//json buffer
StaticJsonBuffer<200> jsonBuffer;
JsonObject& root = jsonBuffer.createObject();

// analog pins for soil humidity, the sensor pin switch it on
// so we can avoid it degradationdue to the electrolisis
int analogPin = 0;
int sensorPin = 3;
int readVal = 0;

//pump pin 
int pumpPin = 4;

float avegValue = 0.0;
char holder[7];
// sensor labels
const char * SOIL="soil";
const char * TANK="tank";
const char * TEMP="temperature";
const char * HUMI="humidity";
const char * PUMP="pump";

// Initialize DHT sensor.
DHT dht(DHTPIN, DHTTYPE);

void setup() {
// Turn the Serial Protocol ON
  Serial.begin(9600);
  pinMode(pumpPin,OUTPUT);
  pinMode(sensorPin,OUTPUT);
  digitalWrite(pumpPin,LOW);
  dht.begin();
}

void loop() {

  if (Serial.available()) {
    /* read the most recent byte */
    byteRead = Serial.read();
    /*ECHO the value that was read, back to the serial port. */
    processInput((char)byteRead);
  }
  time = millis();
  if (is_pump){
    // check for time or time overflow
    if (time < time_start_pump || time > time_end_pump){
        stopPump();
      } 
  }
  
}

// return an error through the serial
void printError(const char* ErrorCode, const char* type){
  char buffer[256];
  root["error"] = ErrorCode;
  root["value"] = "error";
  root["type"] = type;  
  root.printTo(buffer, sizeof(buffer));
  Serial.println(buffer);
}
// return value
void returnValue(float value, boolean error, const char* type){
  char buffer[256];
  root["error"] = 0;
  if (error) {
    root["error"] = 1;
  };  
  root["value"] = value;
  root["type"] = type;
  root.printTo(buffer, sizeof(buffer));
  Serial.println(buffer); 
}
// do the required action
void processInput(char Input) {
  // do something different depending on the
  switch (Input) {     
  case 'e':
    readEnv();
    break;
  case 'p':
    pump();
    break;
  case 'r':
    returnValue(getSensorReading(),false,SOIL);
    break;
  case 't':
    returnValue(readDistance(),false,TANK);
    break;
  case 's':
    stopPump();
    break;
  default:
    returnValue(0,true,"error");
    break;
  }
}

// read enviroment through dht11
void readEnv()
{
  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();
  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t) ) {
    printError("Failed to read from DHT sensor!",TEMP);
    return;
  } else {
    returnValue(h,false,HUMI);
    returnValue(t,false,TEMP);
  }
  
}


// read soil sensor
float getSensorReading(){
  // switch oin sensor
    digitalWrite(sensorPin, HIGH);
    delay(300);
     /*  check if data has been sent from the computer: */
     avegValue = 0;
     for (int i=0; i<10;i++) {
         avegValue += analogRead(analogPin);
         delay(20);
     }
     avegValue = avegValue/10.0;
         // read the input pin
     String g= (String)dtostrf( avegValue, 7, 3,holder);
     // switch off sensor
     digitalWrite(sensorPin,LOW);
     return avegValue;
}
// read distance sensor
float readDistance() { 
  // Don't do anything here!
  unsigned int uS = sonar.ping(); // Send ping, get ping time in microseconds (uS).
  float result = uS / US_ROUNDTRIP_CM  ;
  return result; // Convert ping time to distance and print result (0 = outside set distance range, no ping echo)
}
// pump start
void pump() {
  if (!is_pump){
    returnValue(1,false,PUMP);
    digitalWrite(pumpPin, HIGH);
    // stop pump after 1 minute
    unsigned long duration = 60000  ;
    time_start_pump = millis();
    time_end_pump = time_start_pump + duration;
    is_pump = true;
  }
}
// stop pump
void stopPump() {
  digitalWrite(pumpPin,LOW); 
  returnValue(0,false,PUMP); 
  is_pump = false;
}



