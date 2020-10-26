// sort array ascending

const e = require("express");
replaceall = require("replaceall")

module.exports.toCleanNums = arr => arr?.map( (entry) => {
   entry = (typeof entry == 'string') ? entry.replace(/,/g, "").replace(/\$/g, "") : entry
   if (entry == null) return null
   return Number(entry)
})
module.exports.toCleanNum = num => { 
   num = (typeof num == 'string') ? num.replace(/,/g, "").replace(/\$/g, "") : num
   if (num == null) return null
   return Number(num)
}

module.exports.toNumbers = arr => arr.map( (entry) => Number(entry));

asc = module.exports.asc = arr => arr.sort((a, b) => a - b);

sum = module.exports.sum = arr => arr.reduce((a, b) => a + b, 0);

module.exports.mean = arr => (Math.round(( sum(arr) / arr.length)* 10) / 10)

// sample standard deviation
module.exports.std = (arr) => {
    const mu = mean(arr);
    const diffArr = arr.map(a => (a - mu) ** 2);
    return Math.sqrt(sum(diffArr) / (arr.length - 1));
};

quantile = module.exports.quantile = (arr, q) => {
    const sorted = asc(arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};

module.exports.q25 = arr => quantile(arr, .25);

q50 = module.exports.q50 = arr => quantile(arr, .50);

module.exports.q75 = arr => quantile(arr, .75);

module.exports.median = arr => (Math.round(q50(arr) * 10) / 10)

module.exports.toCurrency = (num) => {
   let f = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
   });
   let res = f.format(num).split(".")[0]
   if (res) return res
   else return null

}