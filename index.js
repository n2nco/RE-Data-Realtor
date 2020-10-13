// const { data } = require('cypress/types/jquery')
const getDataRealtor = require('./getDataRealtor')
const { getDataSingleDriver } = require('./getDataRealtor')
const {changePiaRegion} = require('./pia.js')

urlsNyCities = ["https://www.realtor.com/soldhomeprices/Brooklyn_NY", "https://www.realtor.com/soldhomeprices/Queens_NY", "https://www.realtor.com/soldhomeprices/Manhattan_NY", "https://www.realtor.com/soldhomeprices/Union-City_NJ", "https://www.realtor.com/soldhomeprices/Hoboken_NJ"]
urlsNyCounties = ["https://www.realtor.com/soldhomeprices/New-York-County_NY", "https://www.realtor.com/soldhomeprices/Kings-County_NY", "https://www.realtor.com/soldhomeprices/Queens-County_NY", "https://www.realtor.com/soldhomeprices/Richmond-County_NY", "https://www.realtor.com/soldhomeprices/Hudson-County_NJ", "https://www.realtor.com/soldhomeprices/Bergen-County_NJ"]

urlsSfCities = ["https://www.realtor.com/soldhomeprices/San-Francisco_CA", "https://www.realtor.com/soldhomeprices/Daly-City_CA", "https://www.realtor.com/soldhomeprices/South-San-Francisco_CA", "https://www.realtor.com/soldhomeprices/San-Mateo_CA", "https://www.realtor.com/soldhomeprices/Redwood-City_CA", "https://www.realtor.com/soldhomeprices/Palo-Alto_CA", "https://www.realtor.com/soldhomeprices/Mountain-View_CA", "https://www.realtor.com/soldhomeprices/Sunnyvale_CA", "https://www.realtor.com/soldhomeprices/San-Jose_CA", "https://www.realtor.com/soldhomeprices/Oakland_CA", "https://www.realtor.com/soldhomeprices/Berkeley_CA", "https://www.realtor.com/soldhomeprices/Richmond_CA", "https://www.realtor.com/soldhomeprices/Vallejo_CA", "https://www.realtor.com/soldhomeprices/San-Rafael_CA", "https://www.realtor.com/soldhomeprices/Petaluma_CA", "https://www.realtor.com/soldhomeprices/Santa-Cruz_CA", "https://www.realtor.com/soldhomeprices/Monterey_CA"]

const sleep = milliseconds => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds)


data = []

const main = async () => {
   for await (let url of urlsSfCities) {

      let resolvedData = await getDataRealtor(url) //.then((resolvedData) => {
      // add city/borough name
      const cityName = url.split('/').pop()
      global.cityName = resolvedData
      data.push(global.cityName)   
      console.log('global.cityName for: ' + cityName )
      console.log(global.cityName)
      changePiaRegion()
      sleep(5000)
   }
   console.log('done')
   console.dir(data)
}
main()

//Single Driver Test - gets blocked easier
data = []
const main2 = async () => {
   // for await (let url of urlsSfCities) {
      let resolvedData = await getDataSingleDriver(urlsSfCities) //.then((resolvedData) => {
      // add city/borough name
      // const cityName = url.split('/').pop()
      // global.cityName = resolvedData
      // data.push(global.cityName)   
      // console.log('global.cityName for: ' + cityName )
      // console.log(global.cityName)
      data.push(resolvedData)
   
  
}

// main2()
console.log('done')
console.dir(data)

