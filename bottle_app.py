import assets_route, json
from bottle import route, run, debug, template, request, static_file, error, get, default_app


#root_url = '/home/jmao/mapserver/'
root_url = './'

poi = json.load(open(root_url + 'poi.json'))


@route('/', method='GET')
def index():
	return template(root_url + 'index.tpl', data = poi)

@route('/map', method='GET')
def map():
    return template(root_url + 'map.tpl')

@route('/map/:topic', method='GET')
def map_topic(topic):
	return template(root_url + 'map.tpl', topic = poi[topic])


@route('/aboutus', method='GET')
def aboutus():
    return template(root_url + 'aboutus.tpl')



debug(True)
#application = default_app()   # run on pythonanywhere
run(reloader=True) 		# run local

