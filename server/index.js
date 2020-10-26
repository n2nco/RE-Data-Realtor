//require( 'app-module-path' ).addPath( __dirname ); //set this dir as base dir for all paths.
require('dotenv').config()
const express = require('express')
const app = express();
//const helmet = require('helmet')
const cors = require('cors')
const path = require('path')
//const sslRedirect = require('heroku-ssl-redirect').default;
const { getMongoConn } = require('../mongoConnection')
const {cleanAndSort, metros} = require('../calculate')
const format = require('../formatStats')


// app.use(sslRedirect())

const port = process.env.PORT || 5000;
const CLIENT = (process.env.NODE_ENV == 'development') ? process.env.LOCAL_CLIENT : process.env.LIVE_CLIENT


const returnData = async (req, res) => {
   res ? res.setHeader("Access-Control-Allow-Origin", "*") : null
   if (req.app.locals.stats) {
      res.send(req.app.locals.stats)
      return
   }  


   // metros.forEach((metro) => {
      //  const getSingleCollection = require('../mongoLib').getSingleCollection('RE-Data-Realtor', metro)

      let stats = await cleanAndSort() //returns stats for all metros
      
      for (let metro of global.metros) {
       
       let statsFormatted = await format(stats[metro])
       stats[metro] = statsFormatted

      }

   // })
   
  
   
   

   res.send(stats)

}
app.use('/data', returnData)

app.listen(port, '0.0.0.0', async () => {
   console.log(`Express server running at http:\/\/127.0.0.1:${port}. CORS origin ${CLIENT} not currently mandated.`, "\n", `Server time is: ${(new Date()).toLocaleTimeString()}`)

   // app.locals.stats = await cleanAndSort({test:false})
   //new 
   let stats = await cleanAndSort() //returns stats for all metros
   // let metros = require('../calculate').metros

   for (let metro of global.metros) {
      console.log('stats')
      console.log(stats)
      let statsFormatted = await format(stats[metro])
      stats[metro] = statsFormatted
      console.log('done setting this metro:' + metro)

   }
   app.locals.stats = stats
   //Here's what I think the front end will use:
   app.locals.stats.statsByNew = stats[global.metros[0]].statsByNew //this has all metros within it, no?
   app.locals.stats.metros = stats[global.metros[0]].metros
   app.locals.stats.pTypes = stats[global.metros[0]].pTypes
   app.locals.stats.durations = stats[global.metros[0]].durations

   
   console.log('app.req.locals is set (to all obj) ! - printing stats:')
   console.dir(app.locals.stats)
   
   // console.log('app.req.locals is set (to all obj) ! - printing stats:')
   // if (process.env.NODE_ENV === 'production') {
   //   console.log('calling p() to getDaysOfData & set local vars')
   //   p()
   // } else {
   //   t()
   // }
 })
 
 module.exports = app