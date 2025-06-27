# Development Notes

## Arrow Functions
This projet heavily prefers the use of the `function` keyword over the use of arrow functions in most cases.
Arrow functions may be used in simple callbacks in functional functions such as `map` or `filter` and should not be more than one line long.
If the right hand side of the arrow function is more than a single expression, use the `function` keyword instead.
Ensure that both the righthand side and lefthand side of the arrow wrapped in parentheses. For example:
```javascript
// Good
numbers.map((number) => (number * 2));

// Bad
numbers.map(number => number * 2);
numbers.map(number => {
		return number * 2;
});
numbers.map((number) => number * 2);
```