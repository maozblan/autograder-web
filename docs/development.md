# Development Notes

## Autograder Modules
Parameter order:
- `courses, assignments, files` in this order (only include what is needed for the function).
- Required parameters (alphabetically).
- Optional parameters (alphabetically), initialize all to undefined.

The function should then construct the arguments object to only include arguments that are not undefined and send it as the payload.

## Arrow Functions

This projet heavily prefers the use of the `function` keyword over the use of
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
