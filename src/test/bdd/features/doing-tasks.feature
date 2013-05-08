Feature: The todo list apps allows to do/undo tasks

  Background:
    Given there are some tasks with the following statuses:
      | status |
      | to do  |
      | done   |
      | to do  |

# For this Scenario Outline could be could
# But it is not still supported at CucumberJS

  Scenario: [jQuery] undo task toggling the check
    Given the user has visited the jquery application
    When the user toggles the task number 2 "toggling the check"
    Then the user will see that the task 2 is "to do" after a while

  Scenario: [jQuery] do task toggling the check
    Given the user has visited the jquery application
    When the user toggles the task number 3 "toggling the check"
    Then the user will see that the task 3 is "done" after a while

  Scenario: [jQuery] undo task clicking the text
    Given the user has visited the jquery application
    When the user toggles the task number 2 "clicking the text"
    Then the user will see that the task 2 is "to do" after a while

  Scenario: [jQuery] do task clicking the text
    Given the user has visited the jquery application
    When the user toggles the task number 3 "clicking the text"
    Then the user will see that the task 3 is "done" after a while

  Scenario: [Zepto] undo task toggling the check
    Given the user has visited the zepto application
    When the user toggles the task number 2 "toggling the check"
    Then the user will see that the task 2 is "to do" after a while

  Scenario: [Zepto] do task toggling the check
    Given the user has visited the zepto application
    When the user toggles the task number 3 "toggling the check"
    Then the user will see that the task 3 is "done" after a while

  Scenario: [Zepto] undo task clicking the text
    Given the user has visited the zepto application
    When the user toggles the task number 2 "clicking the text"
    Then the user will see that the task 2 is "to do" after a while

  Scenario: [Zepto] do task clicking the text
    Given the user has visited the zepto application
    When the user toggles the task number 3 "clicking the text"
    Then the user will see that the task 3 is "done" after a while

  Scenario: [KO] undo task toggling the check
    Given the user has visited the knockout application
    When the user toggles the task number 2 "toggling the check"
    Then the user will see that the task 2 is "to do" after a while

  Scenario: [KO] do task toggling the check
    Given the user has visited the knockout application
    When the user toggles the task number 3 "toggling the check"
    Then the user will see that the task 3 is "done" after a while

  Scenario: [KO] undo task clicking the text
    Given the user has visited the knockout application
    When the user toggles the task number 2 "clicking the text"
    Then the user will see that the task 2 is "to do" after a while

  Scenario: [KO] do task clicking the text
    Given the user has visited the knockout application
    When the user toggles the task number 3 "clicking the text"
    Then the user will see that the task 3 is "done" after a while