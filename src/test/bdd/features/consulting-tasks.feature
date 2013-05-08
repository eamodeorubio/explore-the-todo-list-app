Feature: The todo list apps allows to consult the existing tasks

  Scenario: [jQuery] empty todo list
    Given there are no tasks yet
    When the user enters into the jquery application
    Then the user will see no tasks

  Scenario: [jQuery] non empty todo list
    Given there are some tasks
    When the user enters into the jquery application
    Then the user will see all the tasks

  Scenario: [Zepto] empty todo list
    Given there are no tasks yet
    When the user enters into the zepto application
    Then the user will see no tasks

  Scenario: [Zepto] non empty todo list
    Given there are some tasks
    When the user enters into the zepto application
    Then the user will see all the tasks

  Scenario: [KO] empty todo list
    Given there are no tasks yet
    When the user enters into the knockout application
    Then the user will see no tasks

  Scenario: [KO] non empty todo list
    Given there are some tasks
    When the user enters into the knockout application
    Then the user will see all the tasks