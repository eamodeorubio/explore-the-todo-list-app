Feature: The todo list apps allows to add new tasks

  Background:
    Given there are no tasks yet

  Scenario: [jQuery] adding task using the keyboard
    Given the user has visited the jquery application
    And the user has specified the new task description as 'Hola'
    When the user request the task to be added using the keyboard
    And the user will see that the task 1 is "to do" after a while

  Scenario: [jQuery] adding task without the keyboard
    Given the user has visited the jquery application
    And the user has specified the new task description as 'Hola'
    When the user request the task to be added without the keyboard
    And the user will see that the task 1 is "to do" after a while

  Scenario: [Zepto] adding task using the keyboard
    Given the user has visited the zepto application
    And the user has specified the new task description as 'Hola'
    When the user request the task to be added using the keyboard
    And the user will see that the task 1 is "to do" after a while

  Scenario: [Zepto] adding task without the keyboard
    Given the user has visited the zepto application
    And the user has specified the new task description as 'Hola'
    When the user request the task to be added without the keyboard
    And the user will see that the task 1 is "to do" after a while

  Scenario: [KO] adding task using the keyboard
    Given the user has visited the knockout application
    And the user has specified the new task description as 'Hola'
    When the user request the task to be added using the keyboard
    And the user will see that the task 1 is "to do" after a while

  Scenario: [KO] adding task without the keyboard
    Given the user has visited the knockout application
    And the user has specified the new task description as 'Hola'
    When the user request the task to be added without the keyboard
    And the user will see that the task 1 is "to do" after a while