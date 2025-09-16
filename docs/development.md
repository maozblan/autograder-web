# Development Notes

## Autograder API Interface

This project interfaces with the Autograder API through functions.
Each endpoint call is a function that returns a promise to send a POST request to Autograder API.
The request is handled in `sendRequest()` in
[`core.js`](/site/js/modules/autograder/core.js).

Endpoint function parameters should match the Autograder API payload content.
Payload content includes all configurable parameters corresponding to each endpoint,
with the exception of credientials which are generally handled in `sendRequest()`.

### Payload Parameter Edge Cases

The Autograder API includes nullable types which are not handled by the page template by default.
Nullable parameters should be handled manually in `onSubmit()` when using the template.
For example, the nullable timestamp needs to be set to `null` if the input value is `NaN`.

## Style

### Arrow Functions

This project heavily prefers the use of the `function` keyword over the use of
[arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions).
Arrow functions may only be used for one line callbacks.
If the RHS of the arrow function is more than a single expression,
use the `function` keyword instead.
Both the RHS and LHS of the arrow must be wrapped in parentheses.

Consider the following cases:
```javascript
    // Good: One line, parentheses on both sides.
    numbers.map((number) => (number * 2));

    // Bad: Missing parentheses on both sides.
    numbers.map(number => number * 2);

    // Bad: Missing parentheses on RHS.
    numbers.map((number) => number * 2);

    // Bad: Using multiple lines.
    numbers.map((number) => {
        return (number * 2);
    });
```
