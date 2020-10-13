//https://www.realtor.com/soldhomeprices/Brooklyn_NY

module.exports = realtorScript = String.raw `
const els = document.querySelectorAll(".js-component_property-card")
const elsArr = Array.from(els)
console.log('processing ' + elsArr.length + ' sold elements/listings')

//Date variable setting
const now = () => new Date()

const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: "America/New_York" };
const numericOpts = { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: "America/New_York" };

const today = now().toLocaleDateString('en-US', options)
const todayNumeric = now().toLocaleDateString('en-US', numericOpts)

const yesterdayRaw = new Date((now().setDate(now().getDate()-1)))
const yesterday = yesterdayRaw.toLocaleDateString('en-US', options)
const yesterdayNumeric = yesterdayRaw.toLocaleDateString('en-US', numericOpts)

const twoDaysAgoRaw = new Date((now().setDate(now().getDate()-2)))
const twoDaysAgo = twoDaysAgoRaw.toLocaleDateString('en-US', options)
const twoDaysAgoNumeric = twoDaysAgoRaw.toLocaleDateString('en-US', numericOpts)

const threeDaysAgoRaw = new Date((now().setDate(now().getDate()-2)))
const threeDaysAgo = threeDaysAgoRaw.toLocaleDateString('en-US', options)
const threeDaysAgoNumeric = threeDaysAgoRaw.toLocaleDateString('en-US', numericOpts)


//globals for console testing:
 soldToday = []
 soldTodayData = []

 soldYesterday = []
 soldYesterdayData = []

 soldTwoDaysAgo = []
 soldTwoDaysAgoData = []

 soldThreeDaysAgo = []
 soldThreeDaysAgoData = []

 dataArrs = {soldTodayData, soldYesterdayData, soldTwoDaysAgoData, soldThreeDaysAgoData}
 numericDates = [todayNumeric, yesterdayNumeric, twoDaysAgoNumeric, threeDaysAgoNumeric]

elsArr.forEach( (el, index) => {
	const text = el.querySelector("[data-label=property-label-sold]").innerText
	
	if (text.includes(today) || text.includes(today.toUpperCase())) {
        console.log(text)
		soldToday.push(el)
	}
	if (text.includes(yesterday) || text.includes(yesterday.toUpperCase())){
	    console.log(text)
	    soldYesterday.push(el)
   }
   if (text.includes(twoDaysAgo) || text.includes(twoDaysAgo.toUpperCase())){
      console.log(text)
      soldTwoDaysAgo.push(el)
  }
  if (text.includes(threeDaysAgo) || text.includes(threeDaysAgo.toUpperCase())){
   console.log(text)
   soldThreeDaysAgo.push(el)
}
})

const extractData = (elementArrays) => {

   elementArrays.forEach( (array, index) => {
      array.forEach( (el, i) => {
         let price = el.querySelector(".data-price").innerText
         let beds = el.querySelector("[data-label=property-meta-beds]")?.children[0].innerText
         let bathrooms = el.querySelector("[data-label=property-meta-baths]")?.children[0].innerText
         let sqFt = el.querySelector("[data-label=property-meta-sqft]")?.children[0].innerText
         let postalCode = el.querySelector(".listing-postal").innerText
         
         const dArrName = Object.keys(dataArrs)[index]
         window[dArrName].push({ price, beds, bathrooms, sqFt, postalCode, date: numericDates[index] })
      })
   })
}
extractData([soldToday, soldYesterday, soldTwoDaysAgo])


console.log('soldData - Order: today, yesterday, twoDaysAgo:')
console.dir(soldTodayData)
console.dir(soldYesterdayData)
console.dir(soldTwoDaysAgoData)

document.querySelector("[title='Go to next page']").click()
//return val here not in use. the subsequent driver.executeScript returns data from the window object

return soldTwoDaysAgoData //soldYesterdayData


`