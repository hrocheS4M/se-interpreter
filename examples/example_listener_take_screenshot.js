var util = require('util');
var fs = require('fs');

/** An example interpreter listener factory with all listener functions implemented. */
exports.getInterpreterListener = function(testRun) {
  return {
    'startTestRun': function(testRun, info) {
      if (info.success) {
        console.log(testRun.name + ": " + "Starting test ".green +("("+ testRun.browserOptions.browserName +") ").yellow + testRun.name );
      } else {
        console.log(testRun.name + ": " + "Unable to start test ".red + testRun.name + ": " + util.inspect(info.error));
      }
    },
    'endTestRun': function(testRun, info) {
      if (info.success) {
        console.log(testRun.name + ": " + "Test passed".green +("("+ testRun.browserOptions.browserName +") ").yellow);
      } else {
        if (info.error) {
          console.log(testRun.name + ": " + "Test failed: ".red +("("+ testRun.browserOptions.browserName +") ").yellow + util.inspect(info.error));
        } else {
          console.log(testRun.name + ": " + "Test failed ".red +("("+ testRun.browserOptions.browserName +") ").yellow);
        }
      }
    },
    'startStep': function(testRun, step) {
    },
    'endStep': function(testRun, step, info) {
      name = step.step_name ? step.step_name + " " : "";
      if (info.success) {
        console.log(testRun.name + ": " + "Success ".green + name + JSON.stringify(step).grey);
      } else {
        if (info.error) {
            
          // Take a screenshot before close the browser
          // The screenshot is saved where you launched the interpreter
          testRun.do('takeScreenshot', [], step, function(err, base64Image) {
              var decodedImage = new Buffer(base64Image, 'base64');
              fs.writeFile(name + '-' + Date.now() + '.png', decodedImage, function(err) {
                console.log(testRun.name + ": " + "Failed - Take a Snap!".red + name);
                console.log(util.inspect(info.error));
              });
            });

        } else {
          console.log(testRun.name + ": " + "Failed ".red + name);
        }
      }
    },
    'endAllRuns': function(num_runs, successes) {
      var message = successes + '/' + num_runs + ' tests ran successfully. Exiting';
      if (num_runs == 0) {
        message = 'No tests found. Exiting.'.yellow;
      } else if (successes == num_runs) {
        message = message.green;
      } else {
        message = message.red;
      }

      console.log(message);
    }
  };
}
