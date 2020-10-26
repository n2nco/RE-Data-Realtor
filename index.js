

const getDataRealtor = require('./getDataRealtor')
const { getDataSingleDriver } = require('./getDataRealtor')
const changePiaRegion = require('./pia.js').changePiaRegion
const sleep = require('./lib').sleep
const getMongoConn = require('./mongoConnection')   

urlsNyCities = ["https://www.realtor.com/soldhomeprices/Brooklyn_NY", "https://www.realtor.com/soldhomeprices/Queens_NY", "https://www.realtor.com/soldhomeprices/Manhattan_NY", "https://www.realtor.com/soldhomeprices/Union-City_NJ", "https://www.realtor.com/soldhomeprices/Hoboken_NJ"]
urlsNyCounties = ["https://www.realtor.com/soldhomeprices/New-York-County_NY", "https://www.realtor.com/soldhomeprices/Kings-County_NY", "https://www.realtor.com/soldhomeprices/Queens-County_NY", "https://www.realtor.com/soldhomeprices/Richmond-County_NY", "https://www.realtor.com/soldhomeprices/Hudson-County_NJ", "https://www.realtor.com/soldhomeprices/Bergen-County_NJ"]

urlsBayArea = ["https://www.realtor.com/soldhomeprices/San-Francisco_CA",  "https://www.realtor.com/soldhomeprices/Daly-City_CA", "https://www.realtor.com/soldhomeprices/Pacifica_CA", "https://www.realtor.com/soldhomeprices/South-San-Francisco_CA", "https://www.realtor.com/soldhomeprices/San-Mateo_CA", "https://www.realtor.com/soldhomeprices/Redwood-City_CA", "https://www.realtor.com/soldhomeprices/Palo-Alto_CA", "https://www.realtor.com/soldhomeprices/Mountain-View_CA", "https://www.realtor.com/soldhomeprices/Sunnyvale_CA", "https://www.realtor.com/soldhomeprices/San-Jose_CA", "https://www.realtor.com/soldhomeprices/Fremont_CA", "https://www.realtor.com/soldhomeprices/Hayward_CA", "https://www.realtor.com/soldhomeprices/Oakland_CA", "https://www.realtor.com/soldhomeprices/Berkeley_CA", "https://www.realtor.com/soldhomeprices/Richmond_CA", "https://www.realtor.com/soldhomeprices/Vallejo_CA", "https://www.realtor.com/soldhomeprices/San-Rafael_CA", "https://www.realtor.com/soldhomeprices/Petaluma_CA",  "https://www.realtor.com/soldhomeprices/Santa-Rosa_CA", "https://www.realtor.com/soldhomeprices/Napa_CA", "https://www.realtor.com/soldhomeprices/Fairfield_CA", "https://www.realtor.com/soldhomeprices/Santa-Cruz_CA", "https://www.realtor.com/soldhomeprices/Monterey_CA", "https://www.realtor.com/soldhomeprices/Pleasanton_CA", "https://www.realtor.com/soldhomeprices/Concord_CA", "https://www.realtor.com/soldhomeprices/Sacramento_CA"]

testUrls = ["https://www.realtor.com/soldhomeprices/San-Francisco_CA", "https://www.realtor.com/soldhomeprices/Daly-City_CA", "https://www.realtor.com/soldhomeprices/Pacifica_CA"]


data = []
var firstCityName 
gotFirstCityName = false

const main = async () => {
      for await (let url of urlsBayArea) {

   // for await (let url of testUrls) { //USE FOR TESTING
      let resolvedData = await getDataRealtor(url) 
      if (resolvedData === 'hadToChangeRegion') { //re-call. getDataRealtor quits driver & changes ip
         resolvedData = await getDataRealtor(url)
      }

      const cityName = url.split('/').pop()
      if (!gotFirstCityName) { firstCityName = cityName; gotFirstCityName = true}


      global[cityName] = resolvedData //if i put my resolved data in an arr, will it create subdocuments? NO it didn't

      data.push({[cityName]: global[cityName]}) //push object w/ city as key  
      console.log('index.js resolved data for: ' + cityName + ":")
      console.log(global[cityName])
      // changePiaRegion()
      // sleep(5000)
   }
}
//!ENTRY POINT ATM
 main().then( () => {
  
   formatData(data)
   console.log('done. data:')
   console.dir(data)
   data[0][firstCityName]._dateCollected = new Date().toLocaleDateString('en-US')
   data[0][firstCityName]._timeCollected = new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true})

   const db = getMongoConn() 
   const col = db.collection(`Bay_Area`);
   // console.log(col)
   col.insert(data)
   // col.bulkWrite([{ updateMany: { update: data, upsert: true }}])
 })



//Structure:
//Data { city { page { date } } }   or:
//AllData { cityData { pageData { dateData } } }

//For multi-page cities
var formatData = (data) => {
   data.forEach( (city, data_index) => {
      let cityData = Object.values(city)[0]
      if (cityData.length > 1) {
         console.log('multi page data found. must merge')
         pagesMergedCityData = mergeData(cityData, data_index)
         data[data_index][Object.keys(city)[0]] = pagesMergedCityData //data -> ob1 -> sf_ca = mergedArray
         delete data[data_index][Object.keys(city)[0]]?._id
      }
      else { //if not a multi-page city data:
         

         data[data_index][Object.keys(city)[0]] = Object.values(city)[0][0]
         data[data_index][Object.keys(city)[0]].lastPageLastElDateLong = data[data_index][Object.keys(city)[0]]?.lastElDate ?? null
         data[data_index][Object.keys(city)[0]].pageMerged = false
         delete data[data_index][Object.keys(city)[0]]?._id 
      }
   })
   console.log(data)
}

function mergeData(cityData, data_index) {
   cityData.forEach( (pageData, index) => {
      if ((index + 1) < cityData.length) {
  
       let lastElDateRaw = new Date(pageData.lastElDate)
       let lastElDateHyphen = lastElDateRaw.toLocaleDateString('en-CA') //en-ca = spits out hyphens
  
       //merge difficult date into index one
       try {
         if (cityData[0][lastElDateHyphen].soldProperties && cityData[index + 1][lastElDateHyphen].soldProperties) {
            // cityData[0][lastElDateHyphen].soldProperties = []
        
       //if page ends just as a data had it's final element.
            cityData[0][lastElDateHyphen].soldProperties.push(...cityData[index + 1][lastElDateHyphen].soldProperties)
      }
      //no soldProperties array available in recipeint. clean page split. so must init empty array on recipient.
      else if ( !cityData[0][lastElDateHyphen].soldProperties && cityData[index + 1][lastElDateHyphen].soldProperties) {
         cityData[0][lastElDateHyphen].soldProperties = []
         cityData[0][lastElDateHyphen].soldProperties.push(...cityData[index + 1][lastElDateHyphen].soldProperties)
         console.log('had to initialize city data[0].' + lastElDateHyphen)
      }
       let latterPageArr = Object.entries(cityData[index + 1]).map(( [k, v] ) => ({ [k]: v }));
       latterPageArr.forEach ( (dateData, index) => {
           let thisDateHypen = Object.keys(dateData)[0]
           if ( (thisDateHypen != "lastElDate") && (new Date(thisDateHypen) < new Date(lastElDateHyphen))) {
               // console.log('new uncovered dates of soldproperties to add:')
               // console.log(dateData)
               cityData[0][thisDateHypen].soldProperties = dateData[thisDateHypen].soldProperties 
           }
       }) 
      }catch(e) { 
         console.log('error in top level index.js')
      }
      }
   
  
   })
   cityData[0].firstPageLastElDate = cityData[0].lastElDate //clarify
   delete cityData[0].lastElDate

   cityData[0].lastPageLastElDateLong = cityData[cityData.length - 1].lastElDate
   cityData[0].lastPageLastElDateHypen = cityData[cityData.length - 1].lastElDateHyphen
   

   cityData[0].pageMerged = true
   console.log(cityData[0])
   return cityData[0]
}


//Single Driver reused for each city Test - gets blocked easier so not in use.
const main2 = async () => {
   // for await (let url of urlsSfCities) {
      let resolvedData = await getDataSingleDriver(urlsSfCities) //.then((resolvedData) => 
      data.push(resolvedData)
}

//  main2()
