var map;
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();
var marker;

function init(poi)
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
              getChecked("downtown", poi);
            }                       
        }
        var check3 = new checkBox(checkOptions3);

        var checkOptions4 = {
            gmap: map,
            title: "restaurants",
            id: "restaurants",
            label: "Restaurants",
            action: function(){
              getChecked("restaurants", poi);
            }                       
        }
        var check4 = new checkBox(checkOptions4);

        var checkOptions5 = {
            gmap: map,
            title: "apartments",
            id: "apartments",
            label: "Apartments",
            action: function(){
				getChecked("apartments", poi);     
	       }                       
        }
        var check5 = new checkBox(checkOptions5);

        var checkOptions6 = {
            gmap: map,
            title: "sports",
            id: "sports",
            label: "Sports",
            action: function(){
              getChecked("sports", poi);
            }                       
        }
        var check6 = new checkBox(checkOptions6);

        var checkOptions7 = {
            gmap: map,
            title: "ksu",
            id: "ksu",
            label: "KSU",
            action: function(){
              getChecked("ksu", poi);
            }                       
        }
        var check7 = new checkBox(checkOptions7);

        var checkOptions8 = {
            gmap: map,
            title: "hotels",
            id: "hotels",
            label: "Hotels",
            action: function(){
              getChecked("hotels", poi);
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
        		name: 'Options',
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
					    var autocomplete = new google.maps.places.Autocomplete($("#address1")[0], {});
		            google.maps.event.addListener(autocomplete, 'place_changed', function() {
		                var place = autocomplete.getPlace();
		            });
					    var autocomplete = new google.maps.places.Autocomplete($("#address2")[0], {});
		            google.maps.event.addListener(autocomplete, 'place_changed', function() {
		                var place = autocomplete.getPlace();
		            });

	// document.getElementById(type).click();

}

function codeAddress() {
	        var geocoder = new google.maps.Geocoder();
            var address = document.getElementById("address").value;
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();
					var MarkerOption=
					{
					position:new google.maps.LatLng(latitude,longitude),
                    animation: google.maps.Animation.DROP
					};
					marker=new google.maps.Marker(MarkerOption);
					marker.setMap(map);
					//Add Information Window
					var InfoOption={content:"Here is Kent State University"}
					var infoWindow=new google.maps.InfoWindow(InfoOption);
					google.maps.event.addListener(marker,'click',function(e){
					infoWindow.open(map, marker);
					});
                } else {
                    alert("Request failed.")
                }
            });	
	}
	function direction() {
		    document.getElementById("route-results").innerHTML = "";
			directionsDisplay.setMap(map);
			directionsDisplay.setPanel(document.getElementById('route-results'));
		    var start = document.getElementById("address1").value;
			var end = document.getElementById("address2").value; 
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
	function myFunction1() {
     document.getElementById('D1').style.display = "none";
	 document.getElementById('D2').style.display = "block";
	 document.getElementById("myform2").reset();
	 document.getElementById("address1").focus();
	 document.getElementById("route-results").innerHTML = "";
	 clean();
	}
	function myFunction2() {
     document.getElementById('D2').style.display = "none";
	 document.getElementById('D1').style.display = "block";
	 document.getElementById("myform1").reset();
	 document.getElementById("address").focus();
	 clean();
	}
	function clean(){
	directionsDisplay.setMap(null);
	directionsDisplay.setPanel(null);
	marker.setMap(null);
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
				} else {
					//traffic layer is enabled.. disable it
					weatherLayer.setMap(null);  
					cloudLayer.setMap(null);
				}
			}