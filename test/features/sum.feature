Feature: Sum numbers
  Scenario: Sum two positive numbers
    Given a = 2
    And b = 3
    When I sum them
    Then the result should be 5
