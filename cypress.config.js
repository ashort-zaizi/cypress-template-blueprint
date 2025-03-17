const { defineConfig } = require("cypress");
const cucumber = require("cypress-cucumber-preprocessor").default;
const fs = require("fs");

module.exports = defineConfig({

  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports/mochawesome-report',
    overwrite: false,
    html: true,
    json: true,
    charts: true
  },

  viewportWidth: 1920,
  viewportHeight: 1080,

  retries: {
    // Configure retry attempts for `cypress run`
    // Default is 0
    runMode: 2,
    // Configure retry attempts for `cypress open`
    // Default is 0
    openMode: 2
  },

  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      
      on("file:preprocessor", cucumber());

      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        table(message) {
          console.table(message)
          return null
        },
        generateReport(file) {
          fs.writeFile(file.filename, file.fileBody, err => {
            if (err) {
              console.error(err);
              return
            }
          })
          return null
        }
      })
      // return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
    specPattern: "**/*.feature"
  },
});
