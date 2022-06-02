import kociemba
from flask import Flask
app = Flask(__name__)


@app.route('/<state>')
def hello_world(state):
    ans ="\"solve:" +str(kociemba.solve(state))+"\""
    #a = '<meta http-equiv="Access-Control-Allow-Origin" content="*" />'
    re =  "document.write("+ans+");"
    return re

if __name__ == '__main__':
    app.run()
