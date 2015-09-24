/// <reference path="../typings/tsd.d.ts" />
import * as sqlize from "sequelize"
import * as Promise from "bluebird"


export interface DatabaseI {
  addRecord: Function
  getRecord: Function
}


export class Database implements DatabaseI {
  private sequelize: sqlize.Sequelize
  private measurements: any
  // Contructor
  constructor(database: string = 'database') {

    this.sequelize = new sqlize(database, 'username', 'password', {
      dialect: 'sqlite',
      logging: false,
      // SQLite only
      storage: './database.sqlite'
    })

    this.measurements = this.sequelize.define('Measurements', {
      value: { type: sqlize.DOUBLE },
      type: { type: sqlize.STRING },
      date: { type: sqlize.DATE }
    }, {})
  }

  addRecord(value: number, type: string) {
    var date: Date = new Date()
    return this.sequelize.sync({force: true}).then(() => {
      return this.measurements.create({
        value: value,
        type: type,
        date: date
      })
    }).then((data) => {
      return data
    }).catch((e) => {
      return { error: "Invalid request" }
    })
  }

  getRecord(type: string, nRecords: number = 100) {
    var self = this
    return this.sequelize.sync({force: true}).then(() => {
      var dayAgo = Number(new Date()) - 24 * 60 * 60 * 1000
      console.log("Requesting")
      return self.measurements.findAll({
        limit: nRecords,
        where: {
          date: {
            $gt: new Date(dayAgo)
          },
          type: type
        }
      }).then((data) => {
        console.log("data is ::::", data)
        return data
      }).catch(err=> {
        console.log("error", err)
        return err
      })
    })
  }
}
