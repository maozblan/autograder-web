# Autograder Web

A web-based GUI for the autograder.

## Testing

## Unit Tests

We use [NodeJS](https://nodejs.org/en), [Jest](https://jestjs.io/), and [jsdom](https://github.com/jsdom/jsdom) for unit testing.
To run, first ensure that NodeJS (and npm) is installed.
Then, install the dependencies with:
```sh
npm install
```

Finally, to run the tests use:
```sh
npm test
```

### Test Data

Test data for this project is provided by the [autograder-py](https://github.com/edulinq/autograder-py) repository.
This repo maintains a fairly expansive set of test API requests and responses.
From that repo, we generate the test data using something like:
```sh
./.ci/dump_api_test_data.py > ../autograder-web/js/modules/autograder/test/api_test_data.json```
```

Note that the pathing assumes that these two repos are adjacent and we are inside the autograder-py repository.

## Test Server

This repo comes with a simple test server to host the GUI.
By default, the test server uses port 12345, but this can be changed with the `--port` flag.
You will need to tell the test server (via a required argument) where an accessible autograder server is.

```
./.scripts/run_test_server.py 'http://127.0.0.1:8080'
```
