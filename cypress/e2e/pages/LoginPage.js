const BasePage = require('./BasePage')


class LoginPage extends BasePage {

 constructor() {
   super()
 }

 // Define the locators for elements on the login page
 elements = {
   usernameInput: '[name="username"]',
   passwordInput: '[name="password"]',
   loginButton: '.orangehrm-login-action'
 }

 // Method to navigate to the login page
 navigateToLoginPage() {
   this.navigate('/')
 }

 // Method to enter the username
 enterUsername(username) {
   this.enterText(this.elements.usernameInput, username, 10000)
 }

 // Method to enter the password
 enterPassword(password) {
   this.enterText(this.elements.passwordInput, password, 10000)
 }

 // Method to click the login button
 clickLoginButton() {
   this.clickButton(this.elements.loginButton, 10000)
 }

 // Method to perform a complete login action
 login(username, password) {
   this.enterUsername(username)
   this.enterPassword(password)
   this.clickLoginButton()
 }
}

module.exports = LoginPage;