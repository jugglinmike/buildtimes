# Copyright (c) 2012 Paul Tagliamonte <paultag@debian.org>
#
# Permission is hereby granted, free of charge, to any person obtaining a
# copy of this software and associated documentation files (the "Software"),
# to deal in the Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish, distribute, sublicense,
# and/or sell copies of the Software, and to permit persons to whom the
# Software is furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# DEALINGS IN THE SOFTWARE.

from flask import Flask, render_template
from pymongo import Connection
import json
import time

app = Flask(__name__)

connection = Connection('localhost', 27017)
db = connection.firehose


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/overview/<package>")
def overview(package):
    inf = {
        "package": package
    }
    return render_template("overview.html", **inf)


@app.route("/api/times/<package>")
def api_times(package):
    reports = db.reports.find({"package": package})
    ret = []
    for report in reports:
        when = report['when']
        report = report['report']
        sut = report['metadata']['sut']

        ret.append({
            "sut": sut,
            "when": time.mktime(when.timetuple()),
            "time": report['metadata']['stats']['wallclocktime']
        })

    return json.dumps(ret)

if __name__ == '__main__':
    app.run(debug=True)
