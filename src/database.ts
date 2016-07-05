/// <reference path="../typings/index.d.ts" />
import * as Promise from "bluebird"

const sqlite3 = require('sqlite3').verbose()

const default_db = new sqlite3.Database('./database.sqlite')


export interface DatabaseI {
  addRecord: Function
  getRecord: Function
  createTable : Function
}


export class Database implements DatabaseI {
  private table : string
  private db : any
  // Contructor
  constructor(table: string , db : any = default_db  ) {
    this.table = table
    this.db = db
   }

  createTable() {
    return new Promise((resolve,reject)=>{
      const sqlRequest = "CREATE TABLE if not exists " + this.table +
             '(id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
             'type TEXT, ' +
             'created DATETIME DEFAULT CURRENT_TIMESTAMP, '+
             'value REAL)'
      this.db.run(sqlRequest, (err) => {
        if(err !== null) {
          reject(err);
        }
        else {
          resolve({ success:true})
        }
      })
    })  
  } 

  addRecord(value: number, type: string) {
    return new Promise((resolve,reject)=>{
      const sqlRequest = "INSERT INTO "+this.table+" (type, value) " +
               "VALUES(?,?)"
      this.db.run(sqlRequest,  [type ,value ], (err) => {
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
      this.db.all(' SELECT * '+
             ' FROM '+this.table+
             " WHERE created >= date('now', '-1 day') AND type = " +'"' +type +'"' +
             ' ORDER BY created DESC LIMIT '+nRecords, (err, row) => {
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
