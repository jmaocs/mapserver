import assets_route
from bottle import route, run, debug, template, request, static_file, error, get, default_app

#root_url = '/home/jmao/mapserver/'
root_url = './'
@route('/', method='GET')
def load():
    return template(root_url + 'index.tpl')

@route('/map', method='GET')
def map():
    return template(root_url + 'map.tpl')


@route('/aboutus', method='GET')
def map():
    return template(root_url + 'aboutus.tpl')


debug(True)
#application = default_app()   # run on pythonanywhere
run(reloader=True) 		# run local

