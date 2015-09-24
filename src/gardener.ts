/// <reference path="../typings/tsd.d.ts" />
import * as db from "./database"
import {Board,BoardI,getPorts} from "./board"

// interface for gardener
interface GardenerInt {
    getState(type: string) : Object,
    addRecord(value: number, type: string) : Object,
    getPort() : Promise<Object>,
    openValve() : Object,
    closeValve() : Object,
}

export class Gardener implements GardenerInt {
  private db : db.DatabaseI
  private board : BoardI

  constructor(db){
    this.db = db
    this.board = new Board(this.addRecord )
  }
  getState  ( type: string) {
      return this.db.getRecord("humidity" )
  }

  addRecord (value: number, type: string) {
    return this.db.addRecord(value,type)
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

  getPort () {return this.board.getPort()}

  setPort (port:string) {return this.board.setPort(port)}

}
