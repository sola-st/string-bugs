# String-related Bugs

This repository contains the dataset and scripts of "No Strings Attached: An Empirical Study of String-related Software Bugs".

For citing this work use "Aryaz Eghbali and Michael Pradel. 2020. No Strings Attached: An Empirical Study of String-related Software Bugs. In *35th IEEE/ACM International Conference on Automated Software Engineering (ASE ’20), September 21–25, 2020, Virtual Event, Australia*" (https://doi.org/10.1145/3324884.3416576).

## Dataset Description
* The `main.csv` file contains all bugs from our study. The columns are as follows:
   * Bug Description: A short textual description of the bug.
   * Commit URL: The Github URL to the commit that fixed the bug.
   * String literal fix: 1 if the bugfix fixed a string literal.
      * Code: 1 if the string literal is some software code.
      * Path: 1 if the string literal is a path (URL, file path, etc.) to some resource.
   * Regex: 1 if the bug is caused by a regular expression.
      * Mistake in literal: 1 if the bug is because of wrong literal
      * Grouping: 1 if the bug is because of wrong grouping
      * New case: 1 if the bug is fixed by adding more cases to the regex
      * Use regex at all: 1 if the bug is fixed by using regular expressions
      * Escaping: 1 if the bug is caused by not escaping some special characters
      * Repetition/optional: 1 if the bug is caused by wrong repetition/existence directives
      * Anchors: 1 if the bug is caused by wrong anchors
      * replace() added or removed: 1 if the bug is fixed by using or removing the replace() method call
   * Script as string: 1 if the bug is caused by some script that is used as a string value.
   * API: 1 if the bug is caused by some string-related API.
   * String literal --> function/config generated: 1 if the bug is fixed by using a function generated string or reading from configuration source instead of using a fixed string.
   * Additional operation/comparison required: 1 if the bug is fixed by applying more operations or comparisons.
   * Wrong path: 1 if a path to some resource is wrong.
   * Treat as/cast to string: 1 if the bug is fixed by treating a value as or casting a value to the string type.
   * String comparison using exact format: 1 if the bug is caused by comparing a value to a fixed string with exact equality operations.
   * Case-sensitive comparison: 1 if the bug is caused by comparing strings case-sensitive.
   * Should have been a string literal: 1 if the bug is fixed by using a string literal instead of some variable, method call, etc.
   * Empty string problems: 1 if the bug is caused by empty strings.
   * Remove some operation/comparison: 1 if the bug is fixed by removing some operations or comparisons.
   * Core: 1 if the component affected by the bug is the core component.
   * Testing: 1 if the testing part of the code is affected by the bug.
   * Utility: 1 if some utility function/class/etc. is affected by the bug.
   * Build: 1 if the build process is affected by the bug.
   * Demo: 1 if the demonstration code is affected by the bug.
   * UI: 1 if the user interface is affected by the bug.
   * Consequence: A short description of the bug's consequences.
   * Incorrect output: 1 if the output is wrong because of the bug. The output can be any visual output from textual to graphical user interfaces.
   * Corrupt a file: 1 if the bug corrupts the contents of a file.
   * Cause problem in specific OS: 1 if the bug makes some problems in some operating system(s).
   * Causes problem in s specific software: 1 if the bug causes problems in some software(s), like web browsers.
   * Test fails: 1 if some test fails because of this bug.
   * Task not done: 1 if the task that was supposed to be done by the code is not preformed (partially or completely).
   * Interpreter/commandline error: 1 if the bug presents an error.
   * Authentication fails: 1 if authentication to some protected resource fails because of the bug.
   * Inexecutable program part: 1 if some part of the program does not get executed because of the bug.
   * Tool/Software warning: 1 if the bug causes a warning in some other tool or software.
   * Cause problem in a specific device: 1 if the bug happens in some device(s).
   * Security risk: 1 if the bug poses a security risk.
* The `changes.csv` containes statistics on how many characters and lines are changed in each of the bugfixes studied.
* The file `rootcause_component.csv` contains the matrix of how many of each root cause affect each component.
 The file `rootcause_consequence.csv` contains the matrix of how many of each root cause entails which consequences.

## Scripts
The following scripts (presented in the "scripts" directory) were used for various analysis:
* `extract_all_patches.sh`: Extracts all patches (commits) into separate files (one file per patch).
* `small_fixes_in_js.py`: Selects commits with few number (4) of changed lines in js files.
* `extract_interesting_commits.sh`: Copies the small commits from `small_fixes_in_js.py` script into a file for manual inspection.
* `repair.js`: For each bugfix, looks for the added tokens in at most 100 lines away to see if those tokens appear in the vicinity of the code change.
* `compare_with_jshint.py`: Runs JSHint and checks if any commits match the same lines of JSHint warnings. Also uses `.jshintrc`.

