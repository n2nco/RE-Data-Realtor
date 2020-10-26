const { getSingleCollection } = require('./mongoLib');
// require('core-js/features/array/flat');
const calc = require('./calcLib');



// const { all } = require('./server');

//test=false gets overridden if {} is populated with test: true
durations = ['lastWeek', 'thisWeek', 'past2days', 'total2weeks']
pTypes = ['Single Family Home', 'Land', 'Multi-Family Home', 'Condo/Townhome', 'Mfd/Mobile Home'] //any others? haven't used this yet
metros = ['Bay_Area']
db ='RE-Data-Realtor'
module.exports.metros = metros

 const cleanAndSort = async ({test = false} =  {}) => {
   
 
  console.log('getting db in cleanAndSort.js')
  let all = {}
  metros = metros
  for (const metro of metros) {
   
   let col = await getSingleCollection(db, metro)
   console.log('logging collection retreived')

   col = removeDups(col)
   all[metro] = sort(col)
  
}
   
   return all

   function removeDups(col) {
      cityNames = []

      return col?.filter( (city) => {
            delete city._id
            const cityName = Object.keys(city)[0]
            if (cityNames.includes(cityName)) return false
            else cityNames.push(cityName)
            return city
   })
   }
  function sort(col){
   const all = {}

   col?.forEach( (city) => {
      
      const cityName = Object.keys(city)[0]
      all[cityName] = {}
      let thisWeekProperties = []
      let lastWeekProperties = []
      let past2daysProperties = []

      city = Object.values(city)[0]
      let dates = Object.keys(city).filter( (key) => {
         return key.startsWith('20') //e.g. '2020-10-31'
      })
      dates.forEach( (date, index) => {
         //between 7 & 14 days ago
         if ((index < dates.length - 7) && (index >= dates.length - 14) && !(typeof city[date].soldProperties === 'undefined')&& !(city[date].soldProperties == null)) {
            if (city[date].soldProperties === null || city[date] == null) {
                  console.log('found null')
               // }
            }
            else {
               city[date] == null ? (
                  console.log('nul')
               ) : lastWeekProperties.push(...city[date]?.soldProperties) 
            }
         } 
         else if ((index >= dates.length - 7) && !(typeof city[date]?.soldProperties === 'undefined') && !(city[date]?.soldProperties === null) && !(city[date] == null)) {
            try {
               thisWeekProperties.push(...city[date].soldProperties)
            }
            catch(e) {
               console.log("caught " + e)
            }
            
         }
         if ((index >= dates.length - 2) && !(typeof city[date].soldProperties === 'undefined')&& !(city[date].soldProperties == null)) { 
            past2daysProperties.push(...city[date].soldProperties)
         }
      })
      all.cityNames = cityNames
      all[cityName].lastWeek = lastWeekProperties
      all[cityName].thisWeek = thisWeekProperties
      all[cityName].past2days = past2daysProperties
      all[cityName].total2weeks = lastWeekProperties.concat(thisWeekProperties)
   })
  
   // console.dir(all)
   global.all = all
   
  
   setpTypeArrs()
   setArrays({ all})
   console.dir("all is set. returning")
   // let s = all.StatsBy
   return { all: all, statsBy: all.statsBy, cityNames, durations, pTypes, metros}

   }
}



// let final 
// cleanAndSort({test:true}).then( 
//    function(cleanedNsorted) {
//       // console.log(cleanedNsorted); 
//       setArrays(cleanedNsorted)
//       console.log('arrays set in all object')

//    })


//City.duration.pType.soldProperties = []
//all.duration.ptype
//

//TODO, add all to citynames

const setpTypeArrs = () => {
//cityNames
   arrs = {}
   cityNames.forEach((c) => {
      arrs[c] = {}
      durations.forEach((d) => {
         arrs[c][d] = {} 
         a = global.all
         // let a = Object.values(global.all)
         // console.dir(a[c])
         a[c][d].forEach((prop) => { //all.cityname.duration
            arrs[c][d]['All'] = arrs[c][d]['All'] ?? []
            arrs[c][d]['All'].push(prop)

            pTypes.forEach((p) => {
               if (!arrs[c][d][p]) {
                  arrs[c][d][p] = []
               }
               if (prop.propertyType == p) {
                  arrs[c][d][p].push(prop)
               }
            })
         })
      })
   })
   a.pTypeArrs = arrs
   a.pTypeTest = a['San-Jose_CA'].total2weeks.map((el) => {
      return el.propertyType
   })
}

// 1) create array by pType above
// 2) add a pTypes for each at same level as durations.forEach?

const setArrays = ({all}) => {
   const statsBy = {}
   statsBy.lastWeek = []
   statsBy.thisWeek = []
   statsBy.past2days = []

   statsBy.city = [] //statsBy.city = [{city: sf,  ...last ...this ...past2days ...total2weeks}]
   
   // const lastWeekStats = []
   // const thisWeekStats = []
   // const past2daysStats = []a

   pTypes.unshift('All') //!New adding here instead of beginning becuase 'All' doesn't match html el property type textContent.

   cityNames.forEach( (cityName, index) => {
      // statsBy.city[cityName] = {city: cityName, past2days: false, thisWeek: false, lastWeek: false, total2weeks: false}
      let cityRow = {} //future row {city: SF, pas2DaysSppMed: 101010, past2dayspSqft: 900/ft, thisWeekSpMed: 134123, ... }, {city: Oakland ...}, ..]
      cityRow.city = cityName
      cityRow.id = cityName
      // cityRow.nSold = all[cityName] - this is captured by total2weeks
      
      //geting sqFtprice arr for all!
      //one: make all.cityName.duration.All = all.cityname.duration
      //two: add 'All' to pTypes

      
     

      durations.forEach( (duration) => {
         

         statsBy[duration] =  statsBy[duration] ?? []
         let durationRow = {} // past2Weeks[{ city: SF, medSp: 12132, pSqFt: 1231,  }]
         durationRow.city = cityName
         durationRow.id = cityName + duration
         durationRow.nSold = cityRow[`${duration}_nSold`] = all[cityName][duration].length ?? 0

         _a = all[cityName][duration].soldPricesArr = all[cityName][duration].map( (soldProp) => {
            return soldProp.price ?? null
         })
         all[cityName][duration].soldPricesArr = calc.toCleanNums(_a) //clean stings into numbers
         all[cityName][duration].medSp = cityRow[duration + '_medSp'] = durationRow.medSp = calc.median(calc.toCleanNums(_a))
         all[cityName][duration].meanSp = cityRow[duration + '_meanSp'] = durationRow.meanSp = calc.mean(calc.toCleanNums(_a))
         cityRow[duration + '_medSpDollars'] = durationRow.medSpDollars = calc.toCurrency(durationRow.medSp)
         cityRow[duration + '_meanSpDollars'] = durationRow.meanSpDollars = calc.toCurrency(durationRow.meanSp)

       

         // all[cityName][duration].soldPricesMedian = spMed //all data object for record
         // //+ make table rows
         // cityRow[cityName] = { [duration + 'soldPricesMedian'] : spMed }

         // durationRow[duration] = { [cityName + soldPricesMedian = spMed 

         _b = all[cityName][duration].sqFtArr = all[cityName][duration].map( (soldProp) => {
            return soldProp.sqFt ?? null
         })
         all[cityName][duration].sqFtArr = calc.toCleanNums(_b)
         all[cityName][duration].medSqFt = cityRow[duration + '_medSqFt'] = durationRow.medSqFt = calc.median(calc.toCleanNums(_b)) ?? null
         all[cityName][duration].meanSqFt = cityRow[duration + '_meanSqFt'] = durationRow.meanSqFt = calc.mean(calc.toCleanNums(_b)) ?? null

         _c = all[cityName][duration].lotSizeArr = all[cityName][duration].map( (soldProp) => {
            return soldProp.lotSize ?? null
         })
         all[cityName][duration].lotSizeArr = calc.toCleanNums(_c)
         all[cityName][duration].medLotSize =  cityRow[duration + '_medLotSize'] = durationRow.medLotSize = calc.median(calc.toCleanNums(_c)) ?? null

        
         //using a,b & c above:

         _d = all[cityName][duration].soldPricesArr.map( (soldPrice, index) => {
               return (soldPrice / all[cityName][duration].sqFtArr[index]) ?? null
         }) 
         all[cityName][duration].medPsqFt =  cityRow[duration + '_medPsqFt'] = durationRow.medPsqFt =  calc.median(_d) ?? null
         all[cityName][duration].medPsqFtDollars =  cityRow[duration + '_medPsqFtDollars'] = durationRow.medPsqFtDollars =  calc.toCurrency(durationRow.medPsqFt) ?? null
         
         _e = all[cityName][duration].soldPricesArr.map( (soldPrice, index) => {

            return soldPrice / all[cityName][duration].lotSizeArr[index] ?? null
         })
         all[cityName][duration].medPlotSize = cityRow[duration + '_medPlotSize'] = durationRow.medPlotSize =  calc.median(_e) ?? null

         //Now week over week
         if (duration == 'thisWeek' || duration == 'past2days') {
            //square foot change + price per square foot change
            cityRow[duration + '_medSqFtPchange'] = durationRow.medSqFtPchange = parseFloat(Number(all[cityName][duration]['medSqFt']) / Number(all[cityName]['lastWeek']['medSqFt']) - 1).toFixed(3)  ?? null
            cityRow[duration + '_medPsqFtPchange'] = durationRow.medPsqFtPchange = parseFloat(Number(all[cityName][duration]['medPsqFt']) / Number(all[cityName]['lastWeek']['medPsqFt']) - 1).toFixed(3)  ?? null
            
            cityRow[duration + '_meanSqFtPchange'] = durationRow.meanSqFtPchange = parseFloat(Number(all[cityName][duration]['meanSqFt']) / Number(all[cityName]['lastWeek']['meanSqFt']) - 1).toFixed(3)  ?? null
            cityRow[duration + '_meanPsqFtPchange'] = durationRow.meanPsqFtPchange = parseFloat(Number(all[cityName][duration]['meanPsqFt']) / Number(all[cityName]['lastWeek']['meanPsqFt']) - 1).toFixed(3)  ?? null
            // pChangeMedSpYday = parseFloat(Number(yDayCol[city][pType]['medSp']) / Number(yDayColPrevious[city][pType]['medSp']) - 1).toFixed(3) || null
         }


         // all[cityName][duration]['All'] = all[cityName][duration] //!New //remove this?

         //now by pType :)
         pTypes.forEach((p) => {
            let pTypeRow = {}
            statsBy[duration][p] = statsBy[duration][p] ?? []
            pTypeRow.city = cityName
            pTypeRow.id = String(cityName + duration + p)
            pTypeRow.duration = duration
            pTypeRow.pType = p

            all[cityName][duration][p] =  (!(typeof all[cityName][duration][p] === 'undefined')) ? all[cityName][duration][p] : {}

            if (all.pTypeArrs[cityName][duration][p]) {
               
               p_a = all[cityName][duration][p].soldPricesArr = all.pTypeArrs[cityName][duration][p].map((soldProp) => { //This acts on 'All' as well.
                  return soldProp.price ?? null
               })
               p_b = all[cityName][duration][p].sqFtArr = all.pTypeArrs[cityName][duration][p].map( (soldProp) => {
                  return soldProp.sqFt ?? null
               })
               //lotSizeArr
               p_c = all[cityName][duration][p].lotSizeArr = all.pTypeArrs[cityName][duration][p].map( (soldProp) => {
                  return soldProp.lotSize ?? null
               })
               //don't need to create an arr here as using previous ones:

               //Price per square foot
               p_d = all[cityName][duration][p].ppSqFtArr = p_a.map( (soldPrice, index) => {
                  let sqFt = p_b[index]
                  if (soldPrice != null && sqFt != null) { //prevent returning Nan when null values come in (e.g. for land)
                     return (calc.toCleanNum(soldPrice) / calc.toCleanNum(sqFt)) ?? null
                  }
               }) 
               p_d = p_d.filter((el) => {if (el && el !== null && isFinite(el)) { return el} })

               //price per lotsize
               if (cityName == 'Pacifica_CA' && p == 'Land'){
                  console.log('napa')
               }
               p_e = p_a.map( (soldPrice, index) => {
                  let lotSize = p_c[index]  ?? null
                  //converts all to sq feet - can conver to acres on frontend
                  //if in acres:
                  if (Number(lotSize) < 60  && lotSize)  {
                     lotSize = (Number(lotSize) * 43560) //acres to sq feet = acres * 43560
                  }
                  if (soldPrice && lotSize) { //prevent returning Nan when null values come in (e.g. for land)
                     let ppl = (calc.toCleanNum(soldPrice) / calc.toCleanNum(lotSize)) ?? null
                     if (typeof ppl == 'undefined') {
                        return null
                     }
                     else {
                        return ppl
                     }
                  }
               })
               
               p_e = p_e.filter((el) => {if (el && el !== null && isFinite(el)) { return el} })

               if (p_d && p_d.length > 0)  
                  pTypeRow.ppSqFtArr = p_d 
               else 
                  pTypeRow.ppSqFtArr = null
      
               if (p_e && p_e.length > 0) 
                  pTypeRow.ppLotsizeArr = p_e
               else 
                  pTypeRow.ppLotsizeArr = null

               
               //sort into # beds rows if condo/townhome type
               if (p === 'Condo/Townhome' && all.pTypeArrs[cityName][duration]['Condo/Townhome'].length > 0 ) {
                  let beds = ['0', '1', '2', '3']
                  let bedArrs = {}
                  statsBy.beds = statsBy.beds ?? {}
                  //For each bed number, create an array. create a stats object. push that stats object.
                  beds.forEach((bedNum) => { 
                    
                     //create array for each number of beds
                     // bedArrs[bedNum.toString()] = bedArrs[bedNum.toString()] ?? []
                     bedArrs[bedNum] = all.pTypeArrs[cityName][duration]['Condo/Townhome'].filter( (soldProp) => {
                        if (soldProp.beds == bedNum) return soldProp
                     })
                     bedArrs[bedNum].nBeds = bedNum //don't think need this.

                  
                     bedRow = {} //init  row object

                     let bedArr = bedArrs[bedNum] //RENAME
                     bedRow.bedNum = bedNum
                     bedRow.nSold = bedArr.length ?? 0
                     bedRow.city = cityName
                     bedRow.id = String(cityName + duration + 'beds' + bedNum)
                     bedRow.duration = duration

                    
                     b_a = bedArr.map((soldProp) => {
                        return soldProp.price ?? null
                     })
                     b_b = bedArr.map( (soldProp) => {
                        return soldProp.sqFt ?? null
                     })
                     // don't want lotSizeArr, just sqFt arr
                     b_d = b_a.map( (soldPrice, index) => {
                        let sqFt = b_b[index]
                        if (soldPrice != null && sqFt != null) { //prevent returning Nan when null values come in (e.g. for land)
                           return (calc.toCleanNum(soldPrice) / calc.toCleanNum(sqFt)) ?? null
                        }
                     }) 
                     //create Stats
                     bedRow.medSp = calc.median(calc.toCleanNums(b_a)) ?? null
                     bedRow.meanSp = calc.mean(calc.toCleanNums(b_a)) ?? null
         
                     bedRow.medSqFt= calc.median(calc.toCleanNums(b_b)) ?? null
                     bedRow.meanSqFt= calc.mean(calc.toCleanNums(b_b)) ?? null

                     bedRow.medPsqFt = calc.median(b_d) ?? null
                     bedRow.meanPsqFt = calc.mean(b_d) ?? null

                     bedRow.ppSqFtArr = b_d

                     // bedRow[key].map() //medSp, avgSp, p/sqFt, medSqft, meanSqft,
                     Object.keys(bedRow).forEach( (key) => { 
                        if (isNaN(bedRow[key]) && typeof bedRow[key] === 'number') {
                           bedRow[key] = null
                           }  
                     })
                     
                     statsBy.beds[bedNum] = statsBy.beds[bedNum] ?? []

                     statsBy.beds[bedNum].push(bedRow)
                   })
                  
               }
           }
           try{
            pTypeRow.nSold = all.pTypeArrs[cityName][duration][`${p}_nSold`] = all.pTypeArrs[cityName][duration][p]?.length ?? 0
           }catch(e) {
              console.log(e)
           }
            // all[cityName][duration][p].medSp = //don't think I need to set the 'all' obj. unless want to store it in db?
            pTypeRow.medSp = calc.median(calc.toCleanNums(p_a)) ?? null
            pTypeRow.meanSp = calc.mean(calc.toCleanNums(p_a)) ?? null
            pTypeRow.medSpDollars = calc.toCurrency(pTypeRow.medSp) ?? null
            pTypeRow.meanSpDollars = calc.toCurrency(pTypeRow.meanSp) ?? null

            pTypeRow.medSqFt= calc.median(calc.toCleanNums(p_b)) ?? null
            pTypeRow.meanSqFt= calc.mean(calc.toCleanNums(p_b)) ?? null

            pTypeRow.medLotSize = calc.median(calc.toCleanNums(p_c)) ?? null //Convert to acres for land?
            pTypeRow.medLotSizeAcres = (pTypeRow.medLotSize * 43560).toFixed(2)  ?? null
            pTypeRow.medLotSizeAcres = (isNaN(pTypeRow.medLotSizeAcres)) ?  'n/a' : pTypeRow.medLotSizeAcres

            pTypeRow.meanLotSize = calc.mean(calc.toCleanNums(p_c)) ?? null
            pTypeRow.meanLotSizeAcres = (pTypeRow.meanLotSize * 43560).toFixed(2)  ?? null
            pTypeRow.meanLotSizeAcres = (isNaN(pTypeRow.meanLotSizeAcres)) ?  'n/a' : pTypeRow.meanLotSizeAcres

            pTypeRow.medPsqFt = calc.median(p_d) ?? null
            pTypeRow.meanPsqFt = calc.mean(p_d) ?? null

            pTypeRow.medPlotSize = calc.median(p_e) ?? null
            pTypeRow.medPlotSizeAcres  = (pTypeRow.medPlotSize * 43560) ?? null

            pTypeRow.meanPlotSize = calc.mean(calc.toCleanNums(p_e)) ?? null //Note, this will return NAN if there's a null value in p_e
            pTypeRow.meanPlotSizeAcres  = (pTypeRow.meanPlotSize * 43560) ?? null

            if (duration == 'thisWeek' || duration == 'past2days') {
               //current duration / last week duration (last week is always completed 1st) //INDEX = city
              
               pTypeRow.medSqFtPchange = parseFloat(Number(pTypeRow['medSqFt']) / Number(statsBy['lastWeek'][p][index]['medSqFt']) - 1).toFixed(3)  ?? null
               pTypeRow.medPsqFtPchange = parseFloat(Number(pTypeRow['medPsqFt']) / Number(statsBy['lastWeek'][p][index]['medPsqFt']) - 1).toFixed(3)  ?? null
               
               pTypeRow.meanSqFtPchange = parseFloat(Number(pTypeRow['meanSqFt']) / Number(statsBy['lastWeek'][p][index]['meanSqFt']) - 1).toFixed(3)  ?? null
               pTypeRow.meanPsqFtPchange = parseFloat(Number(pTypeRow['meanPsqFt']) / Number(statsBy['lastWeek'][p][index]['meanPsqFt']) - 1).toFixed(3)  ?? null

               if (p == 'Land') {
                  if (!(statsBy['lastWeek'][p][index].nSold == 0)) {
                  pTypeRow.medLotSizePchange = parseFloat(Number(pTypeRow['medLotSize']) / Number(statsBy['lastWeek'][p][index]['medLotSize']) - 1).toFixed(3)  ?? null
                  pTypeRow.medPlotSizePchangeAcres = parseFloat(Number(pTypeRow['medPlotSizeAcres']) / Number(statsBy['lastWeek'][p][index]['medPlotSizeAcres']) - 1).toFixed(3)  ?? null
                  // pTypeRow.ppLotSizeArr = p_e
                  }
               }
            }

            Object.keys(pTypeRow).forEach( (key) => { 
               if (isNaN(pTypeRow[key]) && typeof pTypeRow[key] === 'number') {
                   pTypeRow[key] = null
                  }  
            })


            statsBy[duration][p].push(pTypeRow)
         })
         
         statsBy[duration].push(durationRow)
      })
      statsBy.city.push(cityRow)
   })
   all.statsBy = statsBy

}




  //for each city:

  //create a price array
  //create a sqFt array
  //create a price/sqFt array 




module.exports =  { cleanAndSort }