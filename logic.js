
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function (data) {
  createFeatures(data);
  function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function (feature, latlong) {
        return L.circleMarker(latlong)
      },
      style: styleInfo,
      onEachFeature: onEachFeature
    });


    createMap(earthquakes);
  }

});
// This function returns the style data for each of the earthquakes we plot on
// the map. We pass the magnitude of the earthquake into two separate functions
// to calculate the color and radius.
function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}
function getRadius(magnitude){
  if (magnitude===0){
    return 1;
  }
  return magnitude*4;
}
function getColor(magnitude) {
  switch (true) {
    case magnitude > 5:
      return "#B22222";
    case magnitude > 4:
      return "#FF0000";
    case magnitude > 3:
      return "#FF8C00";
    case magnitude > 2:
      return "#FFFF00";
    case magnitude > 1:
      return "#0000FF";
    default:
      return "#98ee00";
  }
}
function createMap(earthquakes) {


  
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: "pk.eyJ1IjoicmVnaW5hbGRtYWxkZW4iLCJhIjoiY2tmdHRrcTloMDhhajJ5bzl1aXZ6ZXhhbyJ9.M5ftp_4B3QqUyDk-B6l23w"
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Street Map": streetmap
  };

  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create the map object with options
  var map = L.map("map", {
    center: [40.761457, -110.054391],
    zoom: 3,
    layers: [streetmap]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

}
