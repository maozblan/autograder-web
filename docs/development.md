# Development Notes

## Checking for Undefined

To catch undefined values,
values must strictly be checked against `undefined`.
Regular guards will not work as JS has many falsy values.
This risks the removal of `null`,
which is a proper input value for certain types.

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

## Arrow Functions

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
