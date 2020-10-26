const calc = require('./calcLib');

//note: currently only for Bay Area
// const {metros} = require('./calculate')

module.exports = format = async (stats) => {
   console.dir(stats)
   
   let pTypes = stats.pTypes
   let durations = stats.durations
   let metros = stats.metros
    // make this into array in stats or here?


   //Example: statsByNew.thisWeek.Bay_area.SingleFamDetached

   stats.statsByNew =  {}

   durations.forEach((duration) => {
      stats.statsByNew[duration] = stats.statsByNew[duration]  ?? {}
      //add foreach when multi
      metros.forEach((metro) => {
         stats.statsByNew[duration][metro] = stats.statsByNew[duration][metro]  ?? {}

          //! - 1 - Irregular case here - All ptypes - sort into all ptypes rows by duration
         stats.statsBy.city.forEach((city, index) => {

            // stats.statsByNew[duration][metro].All = stats.statsByNew[duration][metro].All ?? [] //don't need as added all to pTypes in calculate.js

            let pTypeRow = {}
            pTypeRow.city = city.city

            Object.keys(city).filter( (key) => {
               if (key.includes(duration)) {
                  newKey = key.replace(duration + '_', "") //strip 'last_week' prefix to make duration easlily abstractable on frontend
                  pTypeRow[newKey] = city[key]
                  
               }
            })
            // stats.statsByNew[duration][metro]['All'].push(pTypeRow)
         })

         //!-2 Normal cases - sort into ptype rows by duration
         pTypes.forEach((pType) => {

            // stats.statsByNew[duration] = stats.statsByNew[duration]  ?? {}
            // stats.statsByNew[duration][metro] = stats.statsByNew[duration][metro]  ?? {}
            
            // pTypeRow = {}
            stats.statsByNew[duration][metro][pType] = stats.statsByNew[duration][metro][pType] ?? []
            stats.statsBy[duration][pType].forEach((entry, index) => {
               if (entry.duration == duration && entry.pType == pType) stats.statsByNew[duration][metro][pType].push(entry)

               // stats.statsByNew[entry.duration] = stats.statsByNew[entry.duration]  ?? {}
               // stats.statsByNew[entry.duration][metro] = stats.statsByNew[entry.duration][metro]  ?? {}
               // stats.statsByNew[entry.duration][metro][entry.pType] =  stats.statsByNew[entry.duration][metro][entry.pType] ?? []
               // stats.statsByNew[entry.duration][metro][entry.pType].push(entry)
            })
         })
               
      })
   })
return stats
}  
