var mapboxgl = require('mapbox-gl');

mapboxgl.accessToken = 'pk.eyJ1Ijoiam1jYnJvb20iLCJhIjoianRuR3B1NCJ9.cePohSx5Od4SJhMVjFuCQA';

document.getElementById('map').style.height = `${window.innerHeight}px`;

// make a map objects
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jmcbroom/cixs0h7mr001m2ro6gbvjgufn',
    doubleClickZoom: false,
    zoom: 10,
    center: [-83.09, 42.33],
    // :triangular_ruler:
    bearing: -1.25,
    minZoom: 9,
    maxBounds: [
        [-83.611, 41.900],
        [-82.511, 42.800]
    ]
});

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');

// once the map's loaded
map.on('load', function(){
  // add the dispensaries
  map.addSource('locations', {
    type: 'geojson',
    data: 'https://gis.detroitmi.gov/arcgis/rest/services/BSEED/MedicalMarihuana/MapServer/0/query?where=1%3D1&outFields=*&returnGeometry=true&outSR=4326&f=geojson'
  });

  // add council district
  var boundary = 'council_districts'
  map.addSource(boundary, {
    type: 'vector',
    url: 'mapbox://cityofdetroit.' + boundary
  });

  // add line & fill layer
  map.addLayer({
    "id": boundary + "_line",
    "type": "line",
    "source": boundary,
    "source-layer": boundary,
    "layout": {
      "visibility": "visible",
      "line-join": "round"
    },
    "paint": {
        "line-color": "#189aca",
        "line-opacity": {
            stops: [
                [8, 1],
                [11, 0.5],
                [16, 0.05],
                [18, 0.01]
            ]
        },
        "line-width": {
            stops: [
                [8, 0.5],
                [11, 1.5],
                [13, 5],
                [22, 18]
            ]
        }
    }
  });

  // layer for all:
  map.addLayer({
      "id": "locations",
      "type": "circle",
      "source": "locations",
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "circle-radius": {
          stops: [[8, 1], [14, 7], [20, 12]]
        },
        "circle-color": {
          "property": "status",
          "type": "categorical",
          stops: [
            ["Closed By Order", "red"],
            ["In Enforcement Process", "orange"],
            ["In Approval Process", "yellow"],
            ["In Approval Process / Operating", "rgb(75, 166, 252)"],
            ["MMCC Approved", "green"],
          ]
        },
        "circle-opacity": 0.66,
        "circle-stroke-width": 1,
        "circle-stroke-color": "black"
      }
  });


  // open a popup on click
  map.on('click', function (e) {
      var features = map.queryRenderedFeatures(e.point, { layers: ['locations'] });
      if (!features.length) {
          return;
      }
      var feature = features[0];
      var html = `
      <span class="b">Name</span><br/>
      <span class="">${feature.properties.name}</span><br/>
      <span class="b">Address</span><br/>
      <span class="">${feature.properties.address}</span><br/>
      <span class="b">Status</span><br/>
      <span class="">${feature.properties.status}</span><br/>
      `
      var popup = new mapboxgl.Popup()
          .setLngLat(feature.geometry.coordinates)
          .setHTML(html)
          .addTo(map);
  });

  map.on('mousemove', function (e) {
      var features = map.queryRenderedFeatures(e.point, { layers: ['locations'] });
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
  });
})

// summary stats
var countReq = new XMLHttpRequest();
countReq.open("GET", "https://gis.detroitmi.gov/arcgis/rest/services/BSEED/MedicalMarihuana/MapServer/0/query?where=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=status&outStatistics=%5B%0D%0A++++%7B%0D%0A++++++++%22statisticType%22%3A+%22count%22%2C%0D%0A++++++++%22onStatisticField%22%3A+%22status%22%2C%0D%0A++++++++%22outStatisticFieldName%22%3A+%22status_count%22%0D%0A++++%7D%0D%0A%5D%0D%0A&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&sqlFormat=none&f=pjson", false);
countReq.send();
var count = JSON.parse(countReq.response)["features"];
console.log(count);

// assign the numbers
count.forEach(function(c) {
  switch(c["attributes"]["status"]) {
    case "Closed By Order":
      console.log("Closed By Order", c['attributes']['status_count'])
      document.getElementById('closed').innerHTML = c["attributes"]["status_count"]
      break
    case "MMCC Approved":
      console.log("MMCC Approved", c['attributes']['status_count'])
      document.getElementById('approved').innerHTML = c["attributes"]["status_count"]
      break
    case "In Enforcement Process":
      console.log("In Enforcement Process", c['attributes']['status_count'])
      document.getElementById('enforcement').innerHTML = c["attributes"]["status_count"]
      break
    case "In Approval Process / Operating":
      console.log("In Approval Process / Operating", c['attributes']['status_count'])
      document.getElementById('approval_operational').innerHTML = c["attributes"]["status_count"]
      break
    case "In Approval Process":
      console.log("In Approval Process", c['attributes']['status_count'])
      document.getElementById('approval').innerHTML = c["attributes"]["status_count"]
      break
    default:
      break
  }
})
