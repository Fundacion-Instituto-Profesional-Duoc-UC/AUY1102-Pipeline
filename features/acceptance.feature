Feature: User Registration
  Scenario: Successful registration
    Given I am on the registration page
    When I enter valid registration details
    Then I should see a confirmation message
