import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import LoginPage from "../pages/LoginPage";

const loginPage = new LoginPage();

Given('I am on the OrangeHRM login page', () => {
    loginPage.navigateToLoginPage();
});

When('I enter the username {string}', (username) => {
    loginPage.enterUsername(username);
});

When('I enter the username for {string}', (user) => {
    const person = cy.fixture(`${user}.json`)
    person.then((username) => {
        loginPage.enterUsername(username.username);
    })
});

When('I enter the password for {string}', (user) => {
    const person = cy.fixture(`${user}.json`)
    person.then((password) => {
        loginPage.enterPassword(password.password);
    })
});

When('I leave the username field empty', () => {
    loginPage.enterUsername('');
});

And('I enter the password {string}', (password) => {
    loginPage.enterPassword(password);
});

And('I click the login button', () => {
    loginPage.clickLoginButton()
});

Then('I should be redirected to the dashboard page', () => {
    cy.url().should('include', '/dashboard/index');
});

