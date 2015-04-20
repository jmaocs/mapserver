var selected_poi = {};
var markersOnMap = {};
var checkedBox_count = 0;

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function getChecked(key, data, top_recom)
{
	// remove previous search history
	directionsDisplay.setMap(null);
	directionsDisplay.setPanel(null);

	if(key in selected_poi){
		delete selected_poi[key];
		removeMakersByKey(key);
		checkedBox_count--;
	} else {		
		selected_poi[key] = data[key];
		checkedBox_count++;
	}
	updateMap();
	if (checkedBox_count == 0 || checkedBox_count == 5) {
		showTopRecom(top_recom);
		return;
	}
	updateRecomTableAndSlider(top_recom);
}
function showTopRecom (top_recom) {
	var recom_img = document.getElementsByName("recom_img");
	var icon_img = document.getElementsByName("icon_img");
	var recom_title = document.getElementsByName("recom_title");
	var recom_address = document.getElementsByName("recom_address");
	var recom_direction = document.getElementsByName("recom_direction");
	var recom_phone = document.getElementsByName('recom_phone');
	var slider_img = document.getElementsByName('slider_img');
	var slider_link = document.getElementsByName("slider_link");
	var count = 0;
	for (key in top_recom) {
		var items = top_recom[key];
		recom_img[count].src = items.images;
		var icon = "/signs/" + items.type+ ".png"
		icon_img[count].src = icon;
		recom_title[count].href = items.website;
		recom_title[count].innerHTML = items.title;
		recom_direction[count].value = items.address;
		recom_address[count].innerHTML = items.address;
		recom_phone[count].innerHTML = items.phone;
		slider_link[count].href = items.website;
		slider_img[count].src = items.images;
		count++;
	}
}
function removeAllMarkers() {
	if (Object.size(markersOnMap) != 0) {
		var lastKey = null;
		for (var k in markersOnMap) {
			if (lastKey == null || lastKey != k) {
				lastKey = k;
				clickCheckBox(lastKey);		// uncheck checkbox
			}
		}
	}
	console.log("All markers removed from map");
}
function removeMakersByKey(key) {
	for (var k in markersOnMap) {
		if (k == key) {
			for (var i = 0; i < markersOnMap[k].value.length; i++) {
				markersOnMap[k].value[i].setMap(null);
			}	
			delete markersOnMap[key];
		}
	}
	console.log("Makers with key: " + key + " removed from map");
}

function updateMap () {
	// body...
	console.log(selected_poi);
	var markers = [];
	var infoWindows = [];
	for (var key in selected_poi) {
		
		var items = selected_poi[key];
		for (var sub_key in items) {
			var lat = items[sub_key].latitude;
			var lnt = items[sub_key].longtitude;
			var address = items[sub_key].address;
			var contentString=
			'<div id="content" style="width:200px">'+
		      '<h3 id="Heading1"><a target="_blank" href='+ items[sub_key].website + '>'+items[sub_key].title + '</a></h3>'+
		      '<div id="bodyContent1">'+
		      '<div id="image" align = "center" style="width:100%; height:150px">'+ '<img src=' + items[sub_key].images + ' style="width:100%;height:100%">' +
      		  '</div>' +
      		  '<div style="width:100%; font-color:black">' + items[sub_key].phone + 
      		  '<br><a id = "direct_link" name ="' + address + '" href="javascript:void(0);">Direction To Here</a>' +
      		  '</div>' + 

		    '</div>';
		    
		    var imgURL = "/signs/" + items[sub_key].type + ".png";
			var pinIcon = new google.maps.MarkerImage(
			    imgURL,
			    null, /* size is determined at runtime */
			    null, /* origin is 0,0 */
			    null, /* anchor is bottom center of the scaled image */
			    new google.maps.Size(28, 28)
			); 

		    var temp_marker = [];
		    temp_marker.push(lat);
		    temp_marker.push(lnt);
		    temp_marker.push(pinIcon);
		    temp_marker.push(key);
		    infoWindows.push(contentString);
		    markers.push(temp_marker);
		}
	}
	var infoWindow = new google.maps.InfoWindow(),marker,i;
	for(i = 0; i < markers.length; i++){
		var myLatLng = new google.maps.LatLng(markers[i][0], markers[i][1]);
		var mapOptions=
		{
			map: map,
			icon: markers[i][2],
			position: myLatLng,
            // animation: google.maps.Animation.DROP,
		};
		marker = new google.maps.Marker(mapOptions);

		// Allow each marker to have an info window    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindows[i]);
                infoWindow.open(map, marker);
                d3.selectAll("#direct_link").on("click",function(d,i){
					var adr = d3.select(this).attr("name");
					expandTwoSearchBox();
					document.getElementById("destination").value = adr;
				})
            }
        })(marker, i));
        var key = markers[i][3];
        if (key in markersOnMap) {
        	markersOnMap[key].value.push(marker);
        } else {
        	markersOnMap[key] = {
        		value:[]
        	}
        	markersOnMap[key].value.push(marker);
		}
	}
	map.setCenter({lat: 41.147169, lng: -81.348025});
	map.setZoom(14);

}

function updateRecomTableAndSlider (top_recom) {
	var size = Object.size(selected_poi);
	if (size == 0) {
		console.log("Nothing to update");
	} else if (size == 6) {
		showTopRecom(top_recom);
		return;
	} else {
		var need_to_update = getItemsToUpdate(top_recom);
		updateRecomTableAndSliderHelper(need_to_update);
	}
}

function getItemsToUpdate(top_recom) {
		var size = Object.size(selected_poi);
		var need_to_update = {};
		if (size == 1) {
			for (var key in selected_poi) {
				var count = 0;
				var items = selected_poi[key];
				var tmp = {};
				for (var sub_key in items) {
					if (count == 6) {		// 6 * 1
						break;
					}
					tmp[sub_key] = items[sub_key];
					count++;
				}
				need_to_update[key] = tmp;
			}
		} else if (size == 2) {
			for (var key in selected_poi) {
				var count = 0;
				var items = selected_poi[key];
				var tmp = {};
				for (var sub_key in items) {
					if (count == 3) {		// 3 * 2
						break;
					}
					tmp[sub_key] = items[sub_key];
					count++;
				}
				need_to_update[key] = tmp;
			}
		} else if (size == 3){
			for (var key in selected_poi) {
				var count = 0;
				var items = selected_poi[key];
				var tmp = {};
				for (var sub_key in items) {
					if (count == 2) {			// 2 * 3 
						break;
					}
					tmp[sub_key] = items[sub_key];
					count++;
				}
				need_to_update[key] = tmp;
			}
		} else if (size == 4) {
			var step = 0;
			for (var key in selected_poi) {
				var count = 0;
				var items = selected_poi[key];
				var tmp = {};
				for (var sub_key in items) {
					if (step < 2 && count == 2 || (step >= 2 && count == 1)) {	// 2 + 2 + 1 + 1
						break;
					}
					tmp[sub_key] = items[sub_key];
					count++;
				}
				step++;
				need_to_update[key] = tmp;
			}
		} else if (size == 5) {
			var step = 0;
			for (var key in selected_poi) {
				var count = 0;
				var items = selected_poi[key];
				var tmp = {};
				for (var sub_key in items) {
					if (step < 1 && count == 2 || (step >= 1 && count == 1)) {	// 2 + 1 + 1 + 1 + 1 + 1
						break;
					}
					tmp[sub_key] = items[sub_key];
					count++;
				}
				step++;
				need_to_update[key] = tmp;
			}

		} else {
			showTopRecom(top_recom);
			// for (var key in selected_poi) {
			// 	var count = 0;
			// 	var items = selected_poi[key];
			// 	var tmp = {};
			// 	for (var sub_key in items) {
			// 		if (count == 1) {		// 1 * 6
			// 			break;
			// 		}
			// 		tmp[sub_key] = items[sub_key];
			// 		count++;
			// 	}
			// 	need_to_update[key] = tmp;
			// }

		}
		return need_to_update;
}

function updateRecomTableAndSliderHelper(need_to_update) {		// need_to_update: just have 6 items
	
	var recom_img = document.getElementsByName("recom_img");
	var icon_img = document.getElementsByName("icon_img");
	var recom_title = document.getElementsByName("recom_title");
	var recom_address = document.getElementsByName("recom_address");
	var recom_direction = document.getElementsByName("recom_direction");
	var recom_phone = document.getElementsByName('recom_phone');
	var slider_img = document.getElementsByName('slider_img');
	var slider_link = document.getElementsByName("slider_link");
	var count = 0;
	for (var key in need_to_update) {		
			var items = need_to_update[key];
			for (var sub_key in items) {
				recom_img[count].src = items[sub_key].images;
				var icon = "/signs/" + items[sub_key].type+ ".png"
				icon_img[count].src = icon;
				recom_title[count].href = items[sub_key].website;
				recom_title[count].innerHTML = items[sub_key].title;
				recom_direction[count].value = items[sub_key].address;
				recom_address[count].innerHTML = items[sub_key].address;
				recom_phone[count].innerHTML = items[sub_key].phone;
				slider_link[count].href = items[sub_key].website;
				slider_img[count].src = items[sub_key].images;
				count++;

			}
	}
}




