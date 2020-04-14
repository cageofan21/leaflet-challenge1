// Store our API endpoint inside queryURL
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL
d3.json(queryURL, function(data) {
    //console.log(data)
    createFeatures(data.features);
});

// Creating a function to give magnitude color range and size
function markerSize(magnitude) {
  return magnitude * 45000;
}

function Color(magnitude) {
  if (magnitude <= 1) {
      return "greenyellow";
  } else if (magnitude <= 2) {
      return "yellowgreen";
  } else if (magnitude <= 3) {
      return "yellow";
  } else if (magnitude <= 4) {
      return "gold";
  } else if (magnitude <= 5) {
      return "orange";
  } else {
      return "red";
  };
}



function createFeatures(earthquakeData) {

var earthquakes = L.geoJSON(earthquakeData, {
// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake
  onEachFeature : function (feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<br> Magnitude: " + feature.properties.mag + "</p>")
  },   pointToLayer: function (feature, latlng) {
    return new L.circle(latlng,
      {radius: markerSize(feature.properties.mag),
      fillColor: Color(feature.properties.mag),
      fillOpacity: 1.0,
      stroke: false,
  })
}
});
  

// Sending our earthquakes layer to the createMap function
createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap, satellitemap,and darkmap layers

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Satellite": satellitemap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the map and layers to display on load
  var myMap = L.map("map", {
    center: [31.0,-99.5],
    zoom: 3,
    layers: [streetmap, satellitemap, earthquakes]
  });


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  //Creating a legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend'),
      magnitudes = [0, 1, 2, 3, 4, 5];
      labels =[];

     
      div.innerHTML += "<h4 style='font-size:16px'>Magnitude</h4>"
  
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
          '<div class="color-box" style="background-color:' + Color(magnitudes[i] + 1) + '"></i> ' 
      + magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : ' + ');
      }
  
      return div;
  };
  
  legend.addTo(myMap);

}
