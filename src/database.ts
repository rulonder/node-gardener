/// <reference path="../typings/tsd.d.ts" />
import * as Promise from "bluebird"

var sqlite3 = require('sqlite3').verbose()

var db = new sqlite3.Database('./database.sqlite')




export interface DatabaseI {
  addRecord: Function
  getRecord: Function
}


export class Database implements DatabaseI {
  private database : string
  // Contructor
  constructor(database: string) {
    this.database = database
    db.serialize(()=> {
      db.run("CREATE TABLE if not exists " + this.database +
             '(id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
             'type TEXT, ' +
             'created DATETIME DEFAULT CURRENT_TIMESTAMP, '+
             'value REAL)', (err) => {
               if(err !== null) {
                 console.log(err)
               }
             })
     })
   }

  addRecord(value: number, type: string) {
    return new Promise((resolve,reject)=>{
      var sqlRequest = "INSERT INTO "+this.database+" (type, value) " +
               "VALUES('" + type + "', '" + value + "')"
      db.run(sqlRequest, function(err) {
        if(err !== null) {
          reject(err);
        }
        else {
          resolve({ success:true})
        }
      })
    })
  }

  getRecord(type: string, nRecords: number ) {
    return new Promise((resolve,reject)=>{
      db.all(' SELECT * '+
             ' FROM '+this.database+
             " WHERE created >= date('now', '-1 day') AND type = " +'"' +type +'"' +
             ' ORDER BY created DESC LIMIT '+nRecords, function(err, row) {
        if(err !== null) {
          // Express handles errors via its next function.
          // It will call the next operation layer (middleware),
          // which is by default one that handles errors.
          reject(err);
        }
        else {
          resolve({ values:row})
        }
      })
    })
  }
}
