import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

let softwareVersion = "1.0.5"
let location = "Not Set"
let filePath = 'cypress/accessibilityResults/'


When("I wait {int} for page to fully load", (durationTxt) => {
   let duration = parseInt(durationTxt)
   cy.wait(duration)
})


Then("I check accessibility to AA standards on {string} page", (page) => {
   location = page;
   cy.url().then((url) => {
       cy.cypressAxe(location, softwareVersion, url, filePath)
   })
})
