const { exec } = require('child_process')
var path = require("path");

var myDir = process.cwd()
var gunDIR = path.dirname(require.resolve("gun"));
var jobs = [];

jobs.push((next) => {
    exec('npm run unbuild', { cwd: gunDIR }, (err, output) => {
        next(err)
    })
})

jobs.push((next) => {
    exec('npm run unbuildSea', { cwd: gunDIR }, (err, output) => {
        next(err)
    })
})

jobs.push((next) => {
    exec('npx browserify ./gun.js -o '+myDir+'/index.js', { cwd: gunDIR }, (err, output) => {
        next(err)
    })
})


jobs.push((next) => {
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