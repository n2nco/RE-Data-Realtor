


//could take daysAgo and/or totalDays & timezone as arg

module.exports = realtorScript = String.raw `

const els = document.querySelectorAll(".js-component_property-card")
const elsArr = Array.from(els)
console.log('processing ' + elsArr.length + ' sold elements/listings')

//1 city, 1 data object

city = {}
let daysAgoArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]


// numericDates = []
//data[date] = [listingData objects]

//Date variable setting
const now = () => new Date()
const date = (daysAgo, timeZone="America/New_York") => {
  
    const longOpts = { year: 'numeric', month: 'long', day: 'numeric', timeZone: timeZone }
    const numericOpts = { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: timeZone }

    const dRaw = new Date((now().setDate(now().getDate() - daysAgo)))
    const dLong = dRaw.toLocaleDateString('en-US', longOpts)
    const dNumeric = dRaw.toLocaleDateString('en-CA', numericOpts) //2020-10/-13
    
    //declare child property - requried?
    city[dNumeric] = {}
    city[dNumeric].dateLong = dLong
}
daysAgoArr.forEach( (daysAgo) => {
    date(daysAgo)
})

// let dNumericArr = Object.keys(city)



//foreach numeric date, if the corresponding long date matches the text, push the el to soldEls
Object.keys(city).forEach( (dateN, index) => {
    elsArr.forEach( (el, i) => {
       const text = el.querySelector("[data-label=property-label-sold]").innerText
        if (text.includes(city[dateN].dateLong) || text.includes(city[dateN].dateLong.toUpperCase())) {
            console.log(text)
            if (city[dateN]['soldEls'] === undefined) {
               city[dateN]['soldEls'] = []
            }
             city[dateN]['soldEls'].push(el)
        }  
    })
})

console.log(city)

const extractData = (soldElArray) => {
    soldPropertyData = []
    soldElArray.forEach( (el, index) => {
         let soldDate = el.querySelector("[data-label=property-label-sold]")?.children[0].innerText.split('ON ')[1].replace(/\s+/g, " ");

         let streetAddress = el.querySelector('span[itemprop="streetAddress"]').innerText
         let locality = el.querySelector('span[itemprop="addressLocality"]').innerText
         let addressRegion = el.querySelector('span[itemprop="addressRegion"]').innerText
         let latitude = el.querySelector('meta[itemprop="latitude"]').content
         let longitude = el.querySelector('meta[itemprop="longitude"]').content
         let postalCode = el.querySelector(".listing-postal").innerText

         let propertyType = el.querySelector('div[class="property-type"]').innerText
         let price = el.querySelector(".data-price").innerText
         let beds = el.querySelector("[data-label=property-meta-beds]")?.children[0].innerText
         let bathrooms = el.querySelector("[data-label=property-meta-baths]")?.children[0].innerText
         let sqFt = el.querySelector("[data-label=property-meta-sqft]")?.children[0].innerText
         let lotSize = el.querySelector("[data-label=property-meta-lotsize]")?.children[0].innerText

         soldPropertyData.push({ soldDate, streetAddress, locality, addressRegion, latitude, longitude, postalCode, propertyType, price, beds, bathrooms, sqFt, lotSize}) //don't need date tho
   })
   return soldPropertyData
}

//find soldEls, pass them to extractData 
Object.keys(city).forEach((date, index) => {
    if (!(city[date].soldEls === undefined )) {
        city[date].soldProperties = extractData(city[date].soldEls) 
        delete city[date].soldEls //delete els once data is extracted
    } 
})

//Determine whether need to click nextpage & scrape it:

let cityArr = Object.entries(city).map(( [k, v] ) => ({ [k]: v }));

//last date of ones I’m looking for:
let lastProp = cityArr.pop()
let lastPropDateNumeric = Object.keys(lastProp)[0]

let lastElDate = elsArr.pop().querySelector("[data-label=property-label-sold]")?.children[0].innerText.split('ON ')[1].replace(/\s+/g, " ");
let lastDateSought = lastProp[lastPropDateNumeric].dateLong

let lastElDateN = new Date(lastElDate)
let lastDateSoughtN = new Date(lastDateSought)

console.log(lastElDate)
console.log(lastDateSought)

console.log(lastElDateN)
console.log(lastDateSoughtN)

console.log('final city (aka city data object)')
console.log(city)

//Check for previous page data saved to localstorage. merge objects if present. ! will do this on backend
// let prevPageData = localStorage.getItem('city')
// if (prevPageData != null) {
//     city = Object.assign(city, JSON.parse(prevPageData))
// }


//need next page
 if (lastElDateN > lastDateSoughtN) {
     console.log('clicking next page & setting localstorage!')
     localStorage.setItem('pageNeedsScraping', 'true') // to do: confirm than localstorage doesn't remain between windows.
    //  localStorage.setItem('city', JSON.stringify(city))
     document.querySelector('[title="Go to next page"]').click()
     return { nextPageNeedsScraping: true, lastElDate: lastElDate, city: city }
 }

 return { nextPageNeedsScraping: false, lastElDate: lastElDate, city: city}


`
