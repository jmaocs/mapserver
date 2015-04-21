var map;
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();
var marker;
var lastMarkerBySearch = null;

function init(poi, type, top_recom, events)
{
	var MapOption={
			center:new google.maps.LatLng(41.1536111,-81.3580556),
			zoom: 12,
			mapTypeControl:true,
		    mapTypeControlOptions: {
		      style:google.maps.MapTypeControlStyle.DROPDOWN_MENU
		    },
			mapTypeId:google.maps.MapTypeId.TERRAIN,
			mapTypeId:google.maps.MapTypeId.SATELLITE,
			mapTypeId:google.maps.MapTypeId.HYBRID,
			mapTypeId:google.maps.MapTypeId.ROADMAP
			};
			map=new google.maps.Map(document.getElementById('map'),MapOption)
			trafficLayer = new google.maps.TrafficLayer();
            google.maps.event.addDomListener(document.getElementById('trafficToggle'), 'click', toggleTraffic);
			
			weatherLayer = new google.maps.weather.WeatherLayer({temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT});
            google.maps.event.addDomListener(document.getElementById('weatherToggle'), 'click', toggleweather);
		    cloudLayer = new google.maps.weather.CloudLayer();
  			
  			//create the check box items
        var checkOptions = {
        		gmap: map,
        		title: "Traffic",
        		id: "traffic",
        		label: "Traffic",				
        		action: function(){
        			toggleTraffic();
        		}        		        		
        }
        var check1 = new checkBox(checkOptions);
        
        var checkOptions2 = {
        		gmap: map,
        		title: "weather",
        		id: "weather",
        		label: "Weather",
        		action: function(){
        			toggleweather();
        		}        		        		
        }
        var check2 = new checkBox(checkOptions2);

        var checkOptions3 = {
            gmap: map,
            title: "downtown",
            id: "downtown",
            label: "Downtown",
            action: function(){
              getChecked("downtown", poi, top_recom);
            }                       
        }
        var check3 = new checkBox(checkOptions3);

        var checkOptions4 = {
            gmap: map,
            title: "restaurants",
            id: "restaurants",
            label: "Restaurants",
            action: function(){
              getChecked("restaurants", poi, top_recom);
            }                       
        }
        var check4 = new checkBox(checkOptions4);

        var checkOptions5 = {
            gmap: map,
            title: "apartments",
            id: "apartments",
            label: "Apartments",
            action: function(){
				getChecked("apartments", poi, top_recom);     
	       }                       
        }
        var check5 = new checkBox(checkOptions5);

        var checkOptions6 = {
            gmap: map,
            title: "sports",
            id: "sports",
            label: "Sports",
            action: function(){
              getChecked("sports", poi, top_recom);
            }                       
        }
        var check6 = new checkBox(checkOptions6);

        var checkOptions7 = {
            gmap: map,
            title: "ksu",
            id: "ksu",
            label: "KSU",
            action: function(){
              getChecked("ksu", poi, top_recom);
            }                       
        }
        var check7 = new checkBox(checkOptions7);

        var checkOptions8 = {
            gmap: map,
            title: "hotels",
            id: "hotels",
            label: "Hotels",
            action: function(){
              getChecked("hotels", poi, top_recom);
            }                       
        }
        var check8 = new checkBox(checkOptions8);
        //set options
        // var divOptions = {
        //     gmap: map,
        //     name: 'Option1',
        //     title: "This acts like a button or click event",
        //     id: "mapOpt",
        //     action: function(){
        //       alert('option1');
        //     }
        // }
        // var optionDiv1 = new optionDiv(divOptions);
        
        
        
        //create the input box items
        
        //possibly add a separator between controls        
        var sep = new separator();
        
        //put them all together to create the drop down       
        var ddDivOptions = {
        	items: [sep, check1, check2,check3,check4,check5,check6,check7,check8],
        	id: "myddOptsDiv"        		
        }

        //alert(ddDivOptions.items[1]);
        var dropDownDiv = new dropDownOptionsDiv(ddDivOptions);               
                
        var dropDownOptions = {
        		gmap: map,
        		name: 'Categories',
        		id: 'ddControl',
        		title: '',
        		position: google.maps.ControlPosition.TOP_RIGHT,
        		dropDown: dropDownDiv 
        }
        
        var dropDown1 = new dropDownControl(dropDownOptions);     



        //
        var autocomplete = new google.maps.places.Autocomplete($("#address")[0], {});
		google.maps.event.addListener(autocomplete, 'place_changed', function() {
	        var place = autocomplete.getPlace();
		});
		
		var autocomplete = new google.maps.places.Autocomplete($("#source")[0], {});
		google.maps.event.addListener(autocomplete, 'place_changed', function() {
		    var place = autocomplete.getPlace();
		});
		var autocomplete = new google.maps.places.Autocomplete($("#destination")[0], {});
		google.maps.event.addListener(autocomplete, 'place_changed', function() {
		    var place = autocomplete.getPlace();
		});

		//Enter Key Event Listener
		document.querySelector('#address').addEventListener('keypress', function (e) {
		    var key = e.which || e.keyCode;
		    if (key === 13) { // 13 is enter
		      	e.preventDefault();
		      	if(document.getElementById("address").value != ""){
		      		searchTarget();
		      	}
		    }
		});
		document.querySelector('#destination').addEventListener('keypress', function (e) {
		    var key = e.which || e.keyCode;
		    if (key === 13) { // 13 is enter
		      	e.preventDefault();
		      	if(document.getElementById("source").value != "" || document.getElementById("destination").value != ""){
		      		getDirection();
		      	}
		    }
		});
	if (events != "" && events != null && events != undefined && events != "None") {
		addEventToMap(poi,events);
	}
	if (type != null && type != "") {
		setTimeout( function(){
			clickCheckBox(type);	
		}, 200);
	}
	getDirectionFromRecom();
}

function getDirectionFromRecom () {
	d3.selectAll("#direct_recom").on("click",function(d,i){
		var adr = d3.select(this).attr("title");
		console.log(adr);
		expandTwoSearchBox(adr);
		// document.getElementById("destination").placeholder = adr;
		// document.getElementById("destination").value = adr;
	})
}

function clickCheckBox (type) {
	document.getElementById(type).click();
	document.getElementById('myddOptsDiv').style.display = 'none';
}

function searchTarget(){
	removeAllMarkers(); 
	var geocoder = new google.maps.Geocoder();
    var address = document.getElementById("address").value;
    var service = new google.maps.places.PlacesService(map);
    geocoder.geocode({ 'address': address }, function (results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	        var latitude = results[0].geometry.location.lat();
	        var longitude = results[0].geometry.location.lng();
			var MarkerOption=
			{
				position:new google.maps.LatLng(latitude,longitude),
	            animation: google.maps.Animation.DROP,
	            draggable:true
			};
			marker = new google.maps.Marker(MarkerOption);
			marker.setMap(map);
	        map.setCenter({lat: latitude, lng: longitude});

			//Add Information Window
			var content = '<div id="content" style="width:200px">'+
		       results[0].formatted_address + ' <br>  Type: ' + 
				results[0].types[0] + ' <br> ' + latitude + ', ' + longitude + 
		    '</div>';
			// var content = results[0].formatted_address + ' <br>  Type: ' + 
			// 	results[0].types[0] + ' <br> ' + latitude + ', ' + longitude;
			var InfoOption={content:content}
			var infoWindow=new google.maps.InfoWindow(InfoOption);
			google.maps.event.addListener(marker,'click',function(e){
				infoWindow.open(map, marker);
			});
			if (lastMarkerBySearch != null) {
				lastMarkerBySearch.setMap(null);
			}
			lastMarkerBySearch = marker;
	    } else {
	        alert("Please enter a place to search");
	    }
    });	
}
function getDirection() {
	removeAllMarkers(); 
    document.getElementById("route-results").innerHTML = "";
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById('route-results'));
    var start = document.getElementById("source").value;
	var end = document.getElementById("destination").value; 
	var request = {
		origin:start,
		destination:end,
		travelMode: google.maps.TravelMode.DRIVING
	};
	directionsService.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
  	  		directionsDisplay.setDirections(result);
		}
	});	 
	
}
function expandTwoSearchBox() {
	 document.getElementById('D1').style.display = "none";
	 document.getElementById('D2').style.display = "block";
	 document.getElementById("myform2").reset();
	 //document.getElementById("address1").focus();
	 if (document.getElementById('address').value != "") {
	 	document.getElementById('source').value = document.getElementById('address').value;
	 }
	 document.getElementById("route-results").innerHTML = "";
	 removeSearchedDisplay();
}
function expandTwoSearchBox(dest) {
	 document.getElementById('D1').style.display = "none";
	 document.getElementById('D2').style.display = "block";
	 document.getElementById("myform2").reset();
	 //document.getElementById("address1").focus();
	 if (document.getElementById('address').value != "") {
	 	document.getElementById('source').value = document.getElementById('address').value;
	 }
	 if (dest != "" && dest != undefined) {
	 	document.getElementById('destination').value = dest;
	 }
	 document.getElementById("route-results").innerHTML = "";
	 removeSearchedDisplay();
}

function shrinkTwoSearchBox() {
	 document.getElementById('D2').style.display = "none";
	 document.getElementById('D1').style.display = "block";
	 document.getElementById("myform1").reset();
	 //document.getElementById("address").focus();
	 removeSearchedDisplay();
}

function removeSearchedDisplay(){
	if (lastMarkerBySearch != null) {
		lastMarkerBySearch.setMap(null);
	}
	directionsDisplay.setMap(null);
	directionsDisplay.setPanel(null);
}

function toggleTraffic(){
	if(trafficLayer.getMap() == null){
		//traffic layer is disabled.. enable it
		trafficLayer.setMap(map);
	} else {
		//traffic layer is enabled.. disable it
		trafficLayer.setMap(null);             
	}
}
			
function toggleweather(){
	if(weatherLayer.getMap() == null){
		//traffic layer is disabled.. enable it
		weatherLayer.setMap(map);
		cloudLayer.setMap(map);
        map.setZoom(12);
	} else {
		//traffic layer is enabled.. disable it
		weatherLayer.setMap(null);  
		cloudLayer.setMap(null);
	}
}