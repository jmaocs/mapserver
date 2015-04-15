import json

poi = json.load(open('poi.json'))

topic = poi["restaurants"]
for each in topic:
	sign_name= "/signs/" + str(each) + ".png"
	print len(topic)
    #print topic[each]["title"]
    #print topic["rays_place"]
