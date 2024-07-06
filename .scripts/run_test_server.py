#!/usr/bin/env python3

import argparse
import http
import http.server
import os
import sys

THIS_DIR = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))
ROOT_DIR = os.path.abspath(os.path.join(THIS_DIR, '..'))

DEFAULT_PORT = 12345

class Handler(http.server.SimpleHTTPRequestHandler):
    _host = None

    @classmethod
    def init(cls, host = None, **kwargs):
        if (host is None):
            raise ValueError("No host provided to handle API requests.")

        cls._host = host

    def log_message(self, format, *args):
        return

    def do_GET(self):
        http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        self.send_response(http.HTTPStatus.TEMPORARY_REDIRECT)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Location', Handler._host + self.path)
        self.end_headers()

def run(host = None, port = DEFAULT_PORT, **kwargs):
    # Move into the root dir.
    os.chdir(ROOT_DIR)

    print("Serving test server on 'http://127.0.0.1:%d', forwarding API requests to '%s'." % (port, host))

    Handler.init(host = host)

    server = http.server.ThreadingHTTPServer(('', port), Handler)
    server.serve_forever()

def main():
    args = _get_parser().parse_args()
    run(**(vars(args)))

    return 0

def _get_parser():
    parser = argparse.ArgumentParser(description = 'Run a test web server for the Autograder web GUI.')

    parser.add_argument('host',
        action = 'store', type = str,
        help = 'Address of the host the autograder server lives on.')

    parser.add_argument('--port', dest = 'port',
        action = 'store', type = int, default = DEFAULT_PORT,
        help = 'Port to launch the web GUI on (default: %(default)s).')

    return parser

if __name__ == '__main__':
    sys.exit(main())
