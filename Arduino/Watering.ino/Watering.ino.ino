/* Simple Serial ECHO script : Written by ScottC 03/07/2012 */
#include <stdlib.h>
#include <ArduinoJson.h>
#include <idDHT11.h>
#include "Timer.h"
#include <NewPing.h>
#define TRIGGER_PIN  12  // Arduino pin tied to trigger pin on ping sensor.
#define ECHO_PIN     11  // Arduino pin tied to echo pin on ping sensor.
#define MAX_DISTANCE 200 // Maximum distance we want to ping for (in centimeters). Maximum sensor distance is rated at 400-500cm.
NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE); 
unsigned int pingSpeed = 50; // How frequently are we going to send out a ping (in milliseconds). 50ms would be 20 times a second.
unsigned long pingTimer;     // Holds the next ping time.

/* Use a variable called byteRead to temporarily stopre
   the data coming from the computer */
int byteRead;
// configure dht11 sensor
int idDHT11pin = 2; //Digital pin for comunications
int idDHT11intNumber = 0; //interrupt number (must be the one that use the previus defined pin
//declaration
void dht11_wrapper(); // must be declared before the lib initialization
//json buffer
StaticJsonBuffer<200> jsonBuffer;
JsonObject& root = jsonBuffer.createObject();
// Lib instantiate
idDHT11 DHT11(idDHT11pin,idDHT11intNumber,dht11_wrapper);
// define Timer
Timer t;
// analog pins for soil humidity, the sensor pin switch it on
// so we can avoid it degradationdue to the electrolisis
int analogPin = 0;
int sensorPin = 3;
int readVal = 0;

//pump pin 
int pumpPin = 4;

float avegValue = 0.0;
char holder[7];

// This wrapper is in charge of calling
// mus be defined like this for the lib work
void dht11_wrapper() {
  DHT11.isrCallback();
}

void setup() {
// Turn the Serial Protocol ON
  Serial.begin(9600);
  pinMode(pumpPin,OUTPUT);
  pinMode(sensorPin,OUTPUT);
}

void loop() {

  if (Serial.available()) {
    /* read the most recent byte */
    byteRead = Serial.read();
    /*ECHO the value that was read, back to the serial port. */
    processInput((char)byteRead);
  }
  t.update();
  
}

float readDistance() { 
  // Don't do anything here!
  unsigned int uS = sonar.ping(); // Send ping, get ping time in microseconds (uS).
  return (uS / US_ROUNDTRIP_CM); // Convert ping time to distance and print result (0 = outside set distance range, no ping echo)
}
// return an error through the serial
void printError(const char* ErrorCode){
  char buffer[256];
  root["error"] = ErrorCode;
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
    pump()  ;
    break;
  case 'r':
    returnValue(getSensorReading(),false,"soil");
    returnValue(readDistance(),false,"tank");
    break;
  case 't':
    returnValue(readDistance(),false,"tank");
    break;
  default:
    returnValue(0,true,"error");
    break;
  }
}

// read enviroment through dht11
void readEnv()
{
  char buffer[256];
  root["error"] = NULL;
  int result = DHT11.acquireAndWait();
  switch (result)
  {
  case IDDHTLIB_OK:
    break;
  case IDDHTLIB_ERROR_CHECKSUM:
    printError("Error\n\r\tChecksum error");
    break;
  case IDDHTLIB_ERROR_ISR_TIMEOUT:
    printError("Error\n\r\tISR time out error");
    break;
  case IDDHTLIB_ERROR_RESPONSE_TIMEOUT:
    printError("Error\n\r\tResponse time out error");
    break;
  case IDDHTLIB_ERROR_DATA_TIMEOUT:
    printError("Error\n\r\tData time out error");
    break;
  case IDDHTLIB_ERROR_ACQUIRING:
    printError("Error\n\r\tAcquiring");
    break;
  case IDDHTLIB_ERROR_DELTA:
    printError("Error\n\r\tDelta time to small");
    break;
  case IDDHTLIB_ERROR_NOTSTARTED:
    printError("Error\n\r\tNot started");
    break;
  default:
    printError("Unknown error");
    break;
  }
  root["value"] = DHT11.getHumidity();
  root["type"] = "humidity";
  root.printTo(buffer, sizeof(buffer));
  Serial.println(buffer);
  root["value"] = DHT11.getCelsius();
  root["type"] = "temperature";
  root.printTo(buffer, sizeof(buffer));
  Serial.println(buffer);
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

void returnValue(float value, boolean error, String type){
  char buffer[256];
  root["error"] = NULL;
  if (error) {
    root["error"] = 1;
  };  
  root["value"] = value;
  root["type"] = type;
  root.printTo(buffer, sizeof(buffer));
  Serial.println(buffer); 
}

void pump() {
  returnValue(1,false,"pump");
  digitalWrite(pumpPin, HIGH);
  // stop pump after 1 minute
  unsigned long duration = 60000  ;
  int afterEvent = t.after(duration,stopPump);
}

void stopPump() {
  digitalWrite(pumpPin,LOW); 
  returnValue(0,false,"pump"); 
  }



