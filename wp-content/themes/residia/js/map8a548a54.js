/*---------------------------------------------*/
/*  OI Hotel Map functionality
/*---------------------------------------------*/


(function(jQuery) {

// Defining variables
  var mapQuery = [];
  var markers = [];
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  var firstLoad=true;

// Defining Functions


function initializeMap() {
  // Map style array

  if (lat && lng) {
    latlng = new google.maps.LatLng(parseFloat(lat),parseFloat(lng));
    setup_map();
  } else {
    geocoder = new google.maps.Geocoder();
    var address = document.getElementById("pointb").value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        //In this case it creates a marker, but you can get the lat and lng from the location.LatLng
          latlng = results[0].geometry.location
          setup_map();
      } else {
        console.log("Could not setup map! Please check! Map settings!");
      }
    });
  }



};

  function setup_map()
  {


    var forrest = [
      {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
          { "visibility": "off" }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
          { "visibility": "simplified" },
          { "hue": "#0066ff" },
          { "saturation": 74 },
          { "lightness": 100 }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
          { "visibility": "simplified" }
        ]
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
          { "visibility": "simplified" }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
          { "visibility": "off" },
          { "weight": 0.6 },
          { "saturation": -85 },
          {
            "lightness": 61
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "on" }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "all",
        "stylers": [
          { "visibility": "off" }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "all",
        "stylers": [
          { "visibility": "on" }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
          { "visibility": "simplified" }
        ]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
          { "visibility": "simplified" },
          { "color": "#d6e8ec" }
        ]
      }
    ];

    // Defining map options
    var myOptions = {
      zoom: 14,
      styles: forrest,
      scaleControl: false,
      scrollwheel: false,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControlOptions: { style: google.maps.ZoomControlStyle.SMALL },
      panControl: false // drag on mobile if false, you can drag
    };


    // Initializing Google map
    map = new google.maps.Map(document.getElementById("map"), myOptions);
    directionsDisplay.setMap(map);
    firstLoad = true;

    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      icon: image,
      title: "OI Hotel"
    });

    markers.push(marker);
  }

// Check if in url the path is already defined


function checkRouteExists() {

  if (location.hash) {
    // on pageload, if the URL has a query in the hash, build the mapQuery array from it, and then populate the page based on that.
    if (location.hash.search('#')===0) {
      var hashList = location.hash.substr(1).split('&');
    } else {
      var hashList = location.hash.split('&');
    }
    for (var a=0;a<hashList.length;a++) {
      var hash = hashList[a].split('=');
      mapQuery[hash[0]] = decodeURI(hash[1]);
    }
    setFormValues()
  } else {
    // otherwise initialize the forms from hotel data and build mapQuery from that.
    var d = 0;
    jQuery('.address').each(function(i) {
      if(i>1){
        if(jQuery(this).parent('div').attr("id") != null && jQuery(this).parent('div').attr("id") != 'undefined' ) { // Make sure we dont grab the address tags associated with Google
          var c = (d) ? ', ' : '';
          jQuery('#pointb').val( jQuery('#pointb').val() + c + jQuery(this).text());
          d++;
          return;
        }
      }
    });
    setMapQuery();
  }
}

// google maps directions form is triggering route display
function triggerDirectionsFromForm() {
  jQuery('#swap-ab-points').mouseup(function(e) {
    if (!jQuery('#pointa').val() && !jQuery('#pointb').val()) { return false; }
    var pointaEscrow = jQuery('#pointa').val();
    jQuery('#pointa').val(jQuery('#pointb').val());
    jQuery('#pointb').val(pointaEscrow);
    directionsFormSubmit(e);
  });
  jQuery('#pointa,#pointb').keyup(function(e){
    if (e.keyCode==13) { // 'return' key
      directionsFormSubmit(e);
    }
  });
  jQuery('.js-map-actions a').mouseup(function(e){
    if(jQuery(this).hasClass("js-print")){
        var printContents = document.getElementById("map").outerHTML;
        printContents += document.getElementById("mapdirections").outerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    }
    else{
      directionsFormSubmit(e);
    }
  });

  jQuery('.maps__travel-mode').find("label").on("click", function(e) {
    jQuery(".js-map-actions").find("a").first().trigger("mouseup");
  });
  // run the Google Maps query on pageload, if the page is set up to do so.
  if (mapQuery['pointa'] && mapQuery['pointb'] && jQuery('input[name="travel-mode"]').filter(':checked').val()) { calcRoute(); }
}

// calculate rout,e update the map, generate alternate routes and the turn-by-turn directions
function calcRoute() {
  var request;
  jQuery("#map_lightbox").css("display", "block");
  var oldTravelMode = mapQuery['travel-mode'];
  setMapQuery();

  // if the travel mode changes, the route option has to reset to 0.
  if (firstLoad) {
    firstLoad = false;
  } else if (oldTravelMode!=mapQuery['travel-mode']) {
    mapQuery['route-option'] = 0;
  }

  request = {
    origin:mapQuery['pointa'].replace("PRC", "").replace("prc", ""),
    destination:mapQuery['pointb'].replace("PRC", "").replace("prc", ""),
    travelMode:mapQuery['travel-mode'],
    provideRouteAlternatives: false
  };

  directionsService.route(request, function(result,status) {
    jQuery("#map_lightbox").css("display", "none");
    if (status == google.maps.DirectionsStatus.OK) {
      map_results = result;
      var suggested = '';
      jQuery.each(result.routes, function(i){
        if (i == mapQuery['route-option']) {
          var checked = ' checked';
        } else {
          var checked = '';
        }
        suggested += '<li><label for="route-option-'+i+'" class="route-option-button clearfix"><input type="radio" name="route-option" id="route-option-'+i+'" class="route-option-radio" value="'+i+'"'+checked+'><span class="route-name">'+ result.routes[i].summary + "</span><span class=\"stats\"><span class='distance'>" + result.routes[i].legs[0].distance.text + "</span>, <span class='time'>" + result.routes[i].legs[0].duration.text + '</span></span></label></li>';
      });
      jQuery("#suggested").html('<h4 class="suggested-routes">Suggested routes</h4><ul id="suggest-routes">'+suggested+'</ul>');
      magicButtonizer('route-option');
      displayRoute(mapQuery['route-option']);
    } else {
      var suggested = '<h4 class="route-title">We cannot find a route</h4><p>Please try a different destination or a different method of travel.</p>';
      jQuery("#suggested").html('<h4 class="suggested-routes">Suggested routes</h4><ul id="suggest-routes">'+suggested+'</ul>');
      jQuery('#directions-container').html('');
    }
  });
}


// display route on map, generate the turn-by-turn directions.
function displayRoute(index) {
  directionsDisplay.setOptions( { suppressMarkers: true } );
  markers = [];
  directionsDisplay.setDirections(map_results);
  directionsDisplay.setRouteIndex(index);
  var directions = "";
  var route = map_results.routes[index].legs[0];




  var startMarker = new google.maps.Marker({
    position: route.start_location,
    map: map,
    icon: pinImage,
  });


  //Check if start point which matches Hotel coordinates

  if((route.start_location.lat()).toFixed(2)  == (latlng.lat()).toFixed(2) && (route.start_location.lng()).toFixed(2)  == (latlng.lng()).toFixed(2)) {
    startMarker.icon = image;
  }

  var endMarker = new google.maps.Marker({
    position: route.end_location,
    map: map,
    icon: pinImage,
  });

  //Check if end point which matches Hotel coordinates

  if((route.end_location.lat()).toFixed(2)  == (latlng.lat()).toFixed(2) && (route.end_location.lng()).toFixed(2)  == (latlng.lng()).toFixed(2)) {
    endMarker.icon = image;
  }

  markers.push(startMarker);
  markers.push(endMarker);

  var routeStart = '<h4 class="route-title">' + mapQuery['travel-mode'].substr(0,1)+mapQuery['travel-mode'].substr(1).toLowerCase() + ' directions to ' + route.end_address + '</h4><p class="end-point route-start">'+route.start_address+'</p>';
  var notices = '<div id="google-map-copyright">' + map_results.routes[index].copyrights + '</div>';
  if (map_results.routes[index].warnings) {
    notices += '<div id="google-map-warnings">' + map_results.routes[index].warnings.join(' ') + '</div>';
  }
  var numSteps = map_results.routes[index].legs[0].steps.length;
  for (var i = 0; i<numSteps; i++) {
    var routeStep = '<li>' + route.steps[i].instructions + '</li>';
    routeStep = routeStep.replace(/style="font-size:0\.9em"/g,'class="small"');
    var navIcon = iconInserter(routeStep);
    directions += routeStep.replace(/^<li>(.*?)<\/li>jQuery/,'<li><span class="map-directions-icon '+navIcon+'"></span>jQuery1<span class="route-distance">' + route.steps[i].distance.text + '</span></li>');
  }
  jQuery("#directions-container").html(routeStart + '<ol id="directions">'+directions+'</ol><p class="end-point route-end">'+route.end_address+'</p>'+notices);
}

// run the Google Maps query on an interface action.
function directionsFormSubmit(e) {
  if (e) { e.preventDefault(); }
  // if the form's not complete, politely ignore the request to process it.
  if (jQuery('#pointa').val() && jQuery('#pointb').val() && jQuery('input[name="travel-mode"]').filter(':checked').val()) {
    calcRoute();
    setUrlVars();
  }
}

// update the hash according to the latest query.
function setUrlVars() {
  // looks baroque but helps screen for obvious junk and URL-encodes form fields.
  var urlVars = [['pointa',mapQuery['pointa']],['pointb',mapQuery['pointb']],['travel-mode',mapQuery['travel-mode']],['route-option',mapQuery['route-option']]];
  var hashList = [];
  for (var a=0;a<urlVars.length;a++) {
    hashList[a] = urlVars[a][0] + '=';
    if (urlVars[a][1]!=='undefined') {

      if (typeof urlVars[a][1] === "string") {
        hashList[a] += encodeURI(urlVars[a][1].replace(/^\s+|\s+jQuery/g, ''));
      }

    }
  }
  location.hash = hashList.join('&');
  return;
}

// poll current state of query form and update the data array.
function setMapQuery() {
  mapQuery['pointa'] = jQuery('#pointa').val();
  mapQuery['pointb'] = jQuery('#pointb').val();
  mapQuery['travel-mode'] = jQuery('input[name="travel-mode"]').filter(':checked').val();
  mapQuery['route-option'] = jQuery('input[name="route-option"]').filter(':checked').val();
  if (typeof mapQuery['route-option'] == 'undefined' && location.hash.match(/route-option=(\d+)/)) {
    var routeOptResult = location.hash.match(/route-option=(\d+)/);
    mapQuery['route-option'] = parseInt(routeOptResult[1]);
  } else {
    mapQuery['route-option'] = parseInt(mapQuery['route-option']);
  }
  if (isNaN(mapQuery['route-option'])) {
    mapQuery['route-option'] = 0;
  }
  return;
}

// rebuild the query form based on the data array.
function setFormValues() {
  jQuery('#pointa').val(mapQuery['pointa']);
  jQuery('#pointb').val(mapQuery['pointb']);
  jQuery('.travel-mode input[type="radio"]').filter('[value="'+mapQuery['travel-mode']+'"]').attr('checked',true);
  if (jQuery('.route-option input[type="radio"]') && mapQuery['route-option']) {
    jQuery('.route-option input[type="radio"]').filter('[value="'+mapQuery['route-option']+'"]').attr('checked',true);
  }
  return;
}

// make the radio buttons behave like a modern magic button selector thingy.
// this initializes both [travel-mode] and [route-option]
// [route-option] will have to be reinitialized frequently during page view.
function magicButtonizer(radioButton) {
  // format and style buttons.
  jQuery('.'+radioButton+'-button input[type="radio"]').filter(':checked').parent().addClass('checked');

  jQuery('label.'+radioButton+'-button').mouseup(function(e){
    // if we're clicking on an already-checked button, give up quickly.
    if (jQuery(this).hasClass('checked') && jQuery(this).children('input[type="radio"]').filter(':checked')) { return; }
    jQuery('.'+radioButton+'-button').removeClass('checked').children('input[type="radio"]').removeAttr('checked');
    jQuery(this).addClass('checked').children('input[type="radio"]').attr('checked',true);
    directionsFormSubmit(e);
  });
  return;
}

// Inserting icons for google maps directions
function iconInserter(navStep) {
  var navIcon;
  var directionSet = [];
  // The match vals are regex objects.
  // you can add more regex expr but be as conservative as possible and make sure every left gets a right and vice versa.
  // Note that only right hand traffic (eg US traffic) is covered.
  // Left hand traffic (eg British traffic) regexes are isolated in a comment below, along with reasons why.
  // For now just try to avoid anywhere that people drive on the right when driving routes are requested.

  directionSet['left'] = [/^Take the [\w\d]{1,3} left/,/^Turn left (?:onto|at|toward|to stay)/,/^Turn leftjQuery/,/^.+? turns left/];
  directionSet['slight left'] = [/^Slight left/,/^.+? turns slightly left/];
  directionSet['sharp left'] = [/^Sharp left/,/^.+? turns sharply left/];
  directionSet['exit left'] = [/^Take the exit on the left onto/,/^Take exit .*? on the left to/,/^Take the .*? exit on the left/];
  directionSet['fork left'] = [/^Keep left at the fork/];
  directionSet['right'] = [/^Take the [\w\d]{1,3} right/,/^Turn right (?:onto|at|toward|to stay)/,/^Turn rightjQuery/,/^.+? turns right/];
  directionSet['slight right'] = [/^Slight right/,/^.+? turns slightly right/];
  directionSet['sharp right'] = [/^Sharp right/,/^.+? turns sharply right/];
  directionSet['exit right'] = [/^Exit onto/,/^Take exit .*? (?:to|for)/,/^Take the exit (?:onto|toward)/];
  directionSet['fork right'] = [/^Keep right at the fork/];
  directionSet['merge'] = [/^Turn (?:left|right) (?:to merge|onto)/,/^Take the ramp (?:to|onto)/,/^Merge onto/];
  directionSet['u-turn'] = [/^Make a U-turn at/,/^Make a U-turnjQuery/];
  directionSet['traffic circle'] = [/^At the traffic circle/];
  directionSet['ferry'] = [/^Take the .*? ferry to/];
  directionSet['train'] = [/^Take the train to/,/^Take the trainjQuery/];
  /*
    // left hand traffic values
    // Icons for some terms are determined by default traffic flow.
    // Eg, "Make a U-turn" gets a leftward U for right-hand traffic, and a rightward U for left-hand traffic.
    // "Exit at" statements have a default right arrow icon in the US, left arrow icon in Britain.
    // So detect directions for LHT traffic and process separately.
    // A SINGLE SET OF CONTIGUOUS DRIVNG DIRECTIONS CAN ENCOMPASS BOTH SIDES OF THE ROAD on all continents except North America and Australia.
    // beware of tygers.
    // exit left values
    directionSet['exit left'][/At junction/];
    // traffic circle values
    directionSet['traffic circle'][/At the roundabout/];
  */
  // current working assumptions:
  //  #  We're using Google's light-colored directional icons.
  //  #  Restricted to right-hand traffic (eg US roads)
  // the light and dark icons are in sprite form and declared in css.
  // for dark icons, use d-(whatever) instead of l-(whatever)
  var navIconSet = new Array(
    ['left','l-l'],
    ['slight left','l-slight-l'],
    ['sharp left','l-sharp-l'],
    ['exit left','l-exit-l'],
    ['fork left','l-fork-l'],
    ['right','l-r'],
    ['slight right','l-slight-r'],
    ['sharp right','l-sharp-r'],
    ['exit right','l-exit-r'], // default for right-hand traffic.
    ['fork right','l-fork-r'],
    ['merge','l-merge'],
    ['u-turn','l-uturn-l'], // left-ways U-turn: default for right-hand traffic.
    ['traffic circle','l-tcircle-cc'], // counterclockwise: default for right-hand traffic.
    ['ferry','l-ferry'],
    ['train','l-train']
    );

  navStep = navStep;
  navStep = jQuery.trim(jQuery(navStep).text());
  for (var a=0;a<navIconSet.length;a++) {
    var nISa = navIconSet[a][0];
    for (var e=0;e<directionSet[nISa].length;e++) {
      if (navStep.match(directionSet[nISa][e])) {
        return navIconSet[a][1];
      }
    }
  }
  // gmaps doesn't display a straight arrow icon, so we won't either, for now.
  // if you want a straight arrow icon, edit the .l-straight declaration in the CSS document, not this script.
  return 'l-straight';
}


// Document ready
jQuery(document).ready(function(){

    if(jQuery("#map").length) {

      initializeMap();

      checkRouteExists();

      triggerDirectionsFromForm();
  }

});

})(jQuery);
