/// <reference path="../typings/tsd.d.ts" />
import * as db from "./database"
import {getPorts} from "./board"

// interface for gardener
interface GardenerInt {
    getState(type: string) : Object,
    init() : Object,
    addRecord(value: number, type: string) : Object,
    openValve() : Object, 
    closeValve() : Object,
}

export class Gardener implements GardenerInt {
  private db : db.DatabaseI
  constructor(db){
    this.db = db
  }
  getState  ( type: string) {
      return this.db.getRecord(100,type )
      console.log("Not implemented yet getState")
  }
  addRecord (value: number, type: string) {
    return this.db.addRecord(value,type)
  }


  init  () {
      // for (let port of ports) {
      //   if("USB" in port.pnpId){
      //     return port
      //   }
      // }
      // no port matched the criteria

      return {}
  }
  openValve () {
      console.log("Not implemented yet openValve ")
      return {}
  }
  closeValve () {
      console.log("Not implemented yet closeValve ")
      return {}
  }
  listPorts () {return getPorts()}

}
