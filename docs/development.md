# Development Notes

## Autograder API Interface

This project interfaces with the Autograder API through functions.
Each endpoint call is a function that returns a promise to send a POST request to Autograder API.
The request is handled in `sendRequest()` in `core.js`.

Endpoint function parameters should match payload content.
Payload content includes all configurable parameters corresponding to each endpoint,
with the exception of credientials which are handled in `sendRequest()`.

### Payload Parameter Edge Cases

Autograder API includes nullable types.
Due to these edge cases, parameter values must strictly be checked against `undefined`
to avoid accidentally removing other falsy values including `null`
when removing unused optional parameters in `sendRequest()`.

For example:
```javascript
    // Bad: Will catch other falsy values.
    if (value) {
        return 'value is undefined';
    }

    // Good: Will only catch undefined.
    if (value === undefined) {
        return 'value is undefined';
    }
```

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
