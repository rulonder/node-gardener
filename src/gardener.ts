/// <reference path="../typings/index.d.ts" />
import * as db from "./database"
import {Board, BoardI, getPorts} from "./board"

// interface for gardener
interface GardenerI {
  getState(type: string): Object,
  addRecord(value: number, type: string): Object,
  getPort(): Promise<Object>,
  openValve(): Object,
}

export class Gardener implements GardenerI {
  private db: db.DatabaseI
  private board: BoardI
  private schedule: NodeJS.Timer
  private schedule2: NodeJS.Timer

  constructor(db,serialHandler) {
    this.db = db
    this.board = new Board( serialHandler,
                            (v,t)=>{this.addRecord(v,t)}, 
                            (err) => { console.log(err) })
    this.board.findPort().then((port_name)=>{
      return this.setPort(port_name)
    }).catch(err=>{
      console.log(err)
    })  
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
    return {status:"close"}
  }

  listPorts(serialHandler) { return getPorts(serialHandler) }

  getPort() { return this.board.getPort() }

  setPort(port: string) {
    return this.board.setPort(port).then((result) => {
      this.board.measureEnv()
      this.board.measureSoil()
      this.board.measureTank()      
      // Setup the timeout handler
      clearInterval(this.schedule)
      this.schedule = setInterval(() => {
        // Clear the local timer variable, indicating the timeout has been triggered.
        this.board.measureEnv()
      }, 60000)
      clearInterval(this.schedule2)
      this.schedule2 = setInterval(() => {
        // Clear the local timer variable, indicating the timeout has been triggered.
        this.board.measureSoil()
        this.board.measureTank()        
      }, 61000)      
      return port
    })
  }

}
