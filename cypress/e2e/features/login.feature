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

  # Scenario: Login with invalid credentials
  #   When I enter the username "invalid_user"
  #   And I enter the password "invalid_password"
  #   And I click the login button
  #   Then I should see an error message "Invalid credentials"

  # Scenario: Login with empty username
  #   When I leave the username field empty
  #   And I enter the password "admin123"
  #   And I click the login button
  #   Then I should see an error text "Required" below the Username field
  #   And user is not logged in