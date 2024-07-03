#!/usr/bin/env python3
""" module """

from flask import Flask, render_template

app.url_map.strict_slashes = False
pp = Flask(__name__)


@app.route('/')
def home() -> str:
    return render_template('0-index.html')
