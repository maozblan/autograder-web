# Autograder Web

A web-based GUI for the autograder.

## Usage

### Test Server

This repo comes with a simple test server to host the GUI.
By default, the test server uses port 12345, but this can be changed with the `--port` flag.
You will need to tell the test server (via a required argument) where an accessible autograder server is.

```
./.scripts/run_test_server.py 'http://127.0.0.1:8080'
```
