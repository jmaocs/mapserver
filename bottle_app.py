import assets_route, json
from bottle import route, run, debug, template, request, static_file, error, get, default_app


#root_url = '/home/jmao/mapserver/'
root_url = './'

poi = json.load(open(root_url + 'poi.json'))
top_recom = json.load(open(root_url + 'top_recom.json'))


@route('/', method='GET')
def index():
	return template(root_url + 'index.tpl', data = poi)

@route('/map', method='GET')
def map():
	tmp = json.dumps(poi)
	return template(root_url + 'map.tpl', topic = top_recom, poi = tmp, topic_type = None)

@route('/map/:topic', method='GET')
def map_topic(topic):
	tmp = json.dumps(poi)
	print(topic)
	return template(root_url + 'map.tpl', topic = poi[topic], poi = tmp, topic_type = topic)


@route('/aboutus', method='GET')
def aboutus():
    return template(root_url + 'aboutus.tpl')

@route('/interests', method='GET')
def interests():
    return template(root_url + 'interests.tpl')

@route('/test')
def test():
	return template(root_url + 'test_image.tpl')



debug(True)
#application = default_app()   # run on pythonanywhere
run(reloader=True,host='localhost', port=8080) 		# run local

