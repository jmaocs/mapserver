import assets_route
from bottle import route, run, debug, template, request, static_file, error, get, default_app

root_url = '/home/jmao/mapserver/'
@route('/', method='GET')
def load():
    return template(root_url + 'index.tpl')


debug(True)
application = default_app()

