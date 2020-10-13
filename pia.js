const REGIONS_ARR = require('./variables')
const shell = require('shelljs');


const addToArrProto = () => {
   Array.prototype.random = function(n){
      if(n&&n>1){
      const a = [];
      for(let i = 0;i<n;i++){
         a.push(this[Math.floor(Math.random()*this.length)]);
      }
      return a;
      } else {
      return this[Math.floor(Math.random()*this.length)];
      }
   }
}

const changePiaRegion = () => {
   addToArrProto()
   console.log('typeof REGIONS_ARR')
   console.log(typeof REGIONS_ARR)
   const newRegion = REGIONS_ARR.random(1)[0]
   shell.exec(`piactl set region ${newRegion}`)
}

module.exports.changePiaRegion = changePiaRegion