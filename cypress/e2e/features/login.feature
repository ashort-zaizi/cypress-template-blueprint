Feature: User Login

 As a user
 I want to login to the OrangeHRM website
 So that I can access my account and perform actions

 Background:
   Given I am on the OrangeHRM login page

 Scenario: Successful login with valid credentials
   When I enter the username "Admin"
   And I enter the password "admin123"
   And I click the login button
   Then I should be redirected to the dashboard page

  Scenario: Successful login with valid credentials - using test fixtures
    When I enter the username for "adminUser"
    And I enter the password for "adminUser"
    And I click the login button
    Then I should be redirected to the dashboard page

 