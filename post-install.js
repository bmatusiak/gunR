const { exec } = require('child_process')
var path = require("path");

var myDir = process.cwd()
console.log(myDir);
var gunDIR = path.dirname(require.resolve("gun"));
var jobs = [];

jobs.push((next) => {
    console.log("unBuilding GUN")
    exec('npm run unbuild', { cwd: gunDIR }, (err, output) => {
        next(err)
    })
})

jobs.push((next) => {
    console.log("browserify GUN")
    exec('npx browserify ./src/index.js -o '+myDir+'/index.js', { cwd: gunDIR }, (err, output) => {
        next(err)
    })
})

jobs.push((next) => {
    console.log("unBuilding SEA")
    exec('npm run unbuildSea', { cwd: gunDIR }, (err, output) => {
        next(err)
    })
})


jobs.push((next) => {
    console.log("browserify SEA")
    exec('npx browserify ./sea.js -o '+myDir+'/sea.js', { cwd: gunDIR }, (err, output) => {
        next(err)
    })
})


function executeSequentially(jobList) {
    var result = Promise.resolve();
    jobList.forEach(function (job) {
        result = result.then(() => {
            return new Promise((resolve, rejects) => {
                job((err)=>{
                    if(err) return rejects(err);
                    resolve()
                });
            });
        });
    });
    return result;
}
executeSequentially(jobs)