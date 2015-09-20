/// <reference path="../typings/tsd.d.ts" />
import * as sqlize from "sequelize"

export interface DatabaseI {
  addRecord : Function
  getRecord : Function
}
 

export class Database implements DatabaseI {
    private sequelize : sqlize.Sequelize
    private measurements : any
    // Contructor
    constructor () {

      this.sequelize = new sqlize('database', 'username', 'password', {
        dialect: 'sqlite',
        // SQLite only
        storage: './database.sqlite'
      })

      this.measurements = this.sequelize.define('Measurements', {
        value: {type:sqlize.DOUBLE },
        type:  {type:sqlize.STRING},
        date:  {type:sqlize.DATE}
      },{})
    }

    addRecord(value: number, type : string ) {
        var date: Date = new Date()
        return this.sequelize.sync().then( () => {
          return this.measurements.create({
            value: value,
            type : type,
            date: date
          })
        }).then((data) => {
          return data
        }).catch((e)=>{
          return {error:"Invalid request"}
        })
    }

    getRecord( type:string,nRecords : number = 100 ) {
      return this.sequelize.sync().then(()=>{
        var dayAgo = Number(new Date())- 24 * 60 * 60 * 1000
        return this.measurements.findAll({
        limit: nRecords,
        where: {
          date: {
            $gt: new Date(dayAgo )
          },
          type : type
        }
      }).then((data) => {
        return data
      }).catch((e)=>{
        return {error:"Invalid request"}
      })
    })
  }




}
