/// <reference path="../typings/tsd.d.ts" />
import * as db from "./database"
import {Board, BoardI, getPorts} from "./board"

// interface for gardener
interface GardenerInt {
  getState(type: string): Object,
  addRecord(value: number, type: string): Object,
  getPort(): Promise<Object>,
  openValve(): Object,
  closeValve(): Object,
}

export class Gardener implements GardenerInt {
  private db: db.DatabaseI
  private board: BoardI
  private schedule: NodeJS.Timer

  constructor(db) {
    this.db = db
    this.board = new Board((v,t)=>{this.addRecord(v,t)}, (err) => { console.log(err) })
  }
  getState(type: string) {
    return this.db.getRecord(type, 500)
  }

  addRecord(value: number, type: string) {
    return this.db.addRecord(value, type)
  }

  openValve() {
    this.board.openValve()
    return {status:"open"}
  }

  closeValve() {
    this.board.closeValve()
    return {status:"closed"}
  }

  listPorts() { return getPorts() }

  getPort() { return this.board.getPort() }

  setPort(port: string) {
    return this.board.setPort(port).then((result) => {
      // Setup the timeout handler
      this.schedule = setInterval(() => {
        // Clear the local timer variable, indicating the timeout has been triggered.
        this.board.measureEnv()
        this.board.measureSoil()
      }, 60000)
      return port
    })
  }

}
