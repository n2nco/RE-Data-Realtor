


//could take daysAgo and/or totalDays & timezone as arg

module.exports = realtorScript = String.raw `

const els = document.querySelectorAll(".js-component_property-card")
const elsArr = Array.from(els)
console.log('processing ' + elsArr.length + ' sold elements/listings')

//1 city, 1 data object

city = {}
let daysAgoArr = [0, 1, 2, 3, 4, 5, 6, 7]


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
         let lotSize = el.querySelector("[data-label=property-meta-lotSize]")?.children[0].innerText

         soldPropertyData.push({ streetAddress, locality, addressRegion, latitude, longitude, postalCode, propertyType, price, beds, bathrooms, sqFt}) //don't need date tho
   })
   return soldPropertyData
}

//find soldEls, pass them to extractData 
Object.keys(city).forEach((date, index) => {
    if (!(city[date].soldEls === undefined )) {
        city[date].soldProperties = extractData(city[date].soldEls) 
    } 
})

console.log('final city (aka city data object)')
console.log(city)
`
