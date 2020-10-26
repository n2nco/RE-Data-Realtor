


//Default values prevent un-spotted bugs when testing!!!
async function getSingleCollection(dbName='RE-Data-Realtor', collectionName='Bay_Area') {
   // let publicVars = require('./routes/data').publicVars
   // var req = publicVars.req ?? null
   let db //mongo client connected to dbName
   try {
      // if (!(typeof req?.app.locals.db == 'undefined')) { //1st try to used shared connection
      //    db = req.app.locals.db
      // }
      // if (!(typeof publicVars.db == 'undefined')) { // then use non-shared single connection
      //    db = publicVars.db
      // }
      // else {         
         const getMongoConn = require('./mongoConnection')                              // then create one if doesn't exist
         db = getMongoConn() //already connected to hsigma db
         console.log('got db')
      // }
   }catch(e) {
      console.log('error getting mongo connection ' + e)
   }

   const col = db.collection(`${collectionName}`)
   let c
   try {
      console.log('finding collection')
      c = await col.find( {}, {sort:{$natural: -1}},  /*{limit: 1 } */ ) // -1 sorts descending.
      // console.log('c.length aka number of documents in collection:')
      // console.log(c.length)
      return c
      // if (c.length === 0) throw new Error('collection not found. potential errors: name wrong or zero entries for this day. for dbName: ')
      // c = c[0]
      // delete c?._id
      // return c
   } catch(e) {
      console.log(e + '   in database: ' + dbName + ',  collection name:' + collectionName)
      return false
   }
}

module.exports = { getSingleCollection } //copying over getSingleCollection2 in RE-Data-heroku-copy