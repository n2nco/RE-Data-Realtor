
var MongoClient = require('mongodb').MongoClient;
const monk = require('monk');
// const { publicVars } = require('./routes/data');
let db

//should call this in app.js. share 1 connection.
module.exports = function getMongoConn(dbName='RE-Data-Realtor') {
  let url = `mongodb+srv://b:mongo284@cluster0.peny6.gcp.mongodb.net/${dbName}?retryWrites=true&w=majority`
   try {
      // db =  await monk(url) //this seems to return a promise. even in an async function, it returns the respolved promise, why not pending?
      // db.then( () => {
      let x = monk(url)
      // console.log('connected to mongo. returning db & setting to publicVars')
      // let publicVars = require('./routes/data').publicVars  //undefined if imported at top. (why? declared in creation phase but execution phase in data.js hasn't run so note assigned a val?)  
      // publicVars.db = x
      // db = x
      return x
      //return Promise.resolve(db)
    //  })
   }catch(e) {
      console.log('error connecting to mongo. options set to retry 5 times')
      return false
   }
  }

let testInsert = () => {
   getMongoConn()
   collectionName = 'yotest'
   collection = db.collection(collectionName); //
   dataToSave = {test: 'yo'}
   async function insertDataAsCollection() {
      await collection.insert(dataToSave, function (err, result) {
         if (err)
            console.log(err);
         else
            console.log('Document inserted successfully into ' + 'monk db' + '  collection: ' + collectionName);
      });
      db.close() //does this work?
   }
    insertDataAsCollection();
}

const cleanup = () => {
   // let publicVars = require('./routes/data').publicVars
   // publicVars?.db?.close(); // Close MongodDB Connection when Process ends. only close here?
   // console.log('cleaned up')
    db?.close()
   process.exit()
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
module.exports.testInsert = testInsert 