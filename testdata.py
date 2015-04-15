import json

poi = json.load(open('poi.json'))

topic = poi["restaurants"]
for each in topic:
    print topic[each]["title"]
    #print topic["rays_place"]
