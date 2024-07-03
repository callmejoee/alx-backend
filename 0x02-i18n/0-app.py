#!/usr/bin/env python3
""" module """

from flask import Flask, render_template

app.url_map.strict_slashes = False
pp = Flask(__name__)


@app.route('/')
def home() -> str:
    ''' function to render index '''
    return render_template('0-index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
