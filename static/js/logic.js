var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryURL).then(function(data) {
    console.log(data);
    createFeatures(data.features);
});

function chooseColor(magnitude) {
    if (magnitude >= 5) {
        return "maroon";
    }
    else if (magnitude >= 4) {
        return "orangered";
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
    
    function onEachLayer(feature) {
        return L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
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
        var div = L.DomUtil.create("div", "legend_class");
        div.setAttribute("id","legend_id");

        labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

        //add title
        div.innerHTML = '<h3 id = "legend_header"> Magnitude </h3>';

        for (var i = 0; i < labels.length; i++) {
            div.innerHTML += '<div class = "legend_row"> <div class = "legend_box" id = "legend_element_'+ i + '" style="background-color: ' + chooseColor(i) + "\"></div> " + 
            '<div class = "legend_text">' + labels[i] + '</div> </div>';
        };
        return div;
    };

    legend.addTo(myMap);

};

