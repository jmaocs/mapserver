import assets_route
from bottle import route, run, debug, template, request, static_file, error, get, default_app
@route('/')
def load():
    return static_file('index.html', root='.')
