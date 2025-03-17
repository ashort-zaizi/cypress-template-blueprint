Feature: Accessibility

    As a user
    I want to check the accessibility of the OrangeHRM website
    So that I can ensure it meets accessibility standard AA
   
   @accessibility
   Scenario: Check Accessibility of the OrangeHRM Login page
       Given I am on the OrangeHRM login page
       When I wait 3000 for page to fully load
       Then I check accessibility to AA standards on "OrangeHRM Login Page" page



