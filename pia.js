const REGIONS_ARR = require('./variables').REGIONS_ARR
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

   const newRegion = REGIONS_ARR.random(1)
   shell.exec(`piactl set region ${newRegion}`)
}

module.exports.changePiaRegion = changePiaRegion