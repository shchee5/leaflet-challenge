var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryURL).then(function(data) {
    console.log(data);
    createFeatures(data.features);
});

function chooseColor(magnitude) {
    if (magnitude >= 5) {
        return "red";
    }
    else if (magnitude >= 4) {
        return "lightred";
    }
    else if (magnitude >= 3) {
        return "orange";
    }
    else if (magnitude >= 2) {
        return "yellow";
    }
    else if (magnitude >= 1) {
        return "yellowgreen";
    }
    else {
        return "green";
    }
};

function circleSize(magnitude) {
    return magnitude * 5;
};

function createFeatures(earthquakeData) {
    
    function onEachLayer(feature,latlng) {
        return L.circleMarker(latlng,
            {
                radius: circleSize(feature.properties.mag),
                fillColor: chooseColor(feature.properties.mag),
                fillOpacity: 0.8,
                stroke: true,
                weight: 0.5
            });
    }
    
    function onEachFeature(feature,layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>" + feature.properties.mag + "</p>");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: onEachLayer
    });
    
    createMap(earthquakes);
}

function createMap(earthquakes) {

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Street": streetmap
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [ 37.09, -95.71 ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Magnitude</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"row\">" + "<div class=\"colorbox1\"/>" + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

legend.addTo(myMap);

};

