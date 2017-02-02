var mapboxgl = require('mapbox-gl');

mapboxgl.accessToken = 'pk.eyJ1Ijoiam1jYnJvb20iLCJhIjoianRuR3B1NCJ9.cePohSx5Od4SJhMVjFuCQA';

document.getElementById('map').style.height = `${window.innerHeight - 70}px`;

// make a map objects
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jmcbroom/cixs0h7mr001m2ro6gbvjgufn',
    doubleClickZoom: false,
    zoom: 10.7,
    center: [-83.091, 42.350],
    // :triangular_ruler:
    bearing: -1.25,
    minZoom: 9,
    maxBounds: [
        [-83.611, 42.100],
        [-82.511, 42.600]
    ]
});

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');

// once the map's loaded
map.on('load', function(){
  // add the dispensaries
  map.addSource('marijuana', {
    type: 'geojson',
    data: 'https://gis.detroitmi.gov/arcgis/rest/services/BSEED/MedicalMarijuanaFacilities/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=true&outSR=4326&f=geojson'
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
                [8, 0.1],
                [11, 1.5],
                [13, 5],
                [22, 18]
            ]
        }
    }
  });

  // a layer for the closed ones
  map.addLayer({
      "id": "marijuana-closed",
      "type": "circle",
      "source": "marijuana",
      "filter": ["in", "status", "Closed By Order"],
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "circle-radius": {
          stops: [[8, 1], [14, 7], [20, 12]]
        },
        "circle-color": "red",
        "circle-opacity": 0.66,
        "circle-stroke-width": 1,
        "circle-stroke-color": "black"
      }
  });
  map.addLayer({
      "id": "marijuana-approval",
      "type": "circle",
      "source": "marijuana",
      "filter": ["in", "status", "In Approval Process"],
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "circle-radius": {
          stops: [[8, 1], [14, 7], [20, 12]]
        },
        "circle-color": "yellow",
        "circle-opacity": 0.66,
        "circle-stroke-width": 1,
        "circle-stroke-color": "black"
      }
  });
  map.addLayer({
      "id": "marijuana-enforcement",
      "type": "circle",
      "source": "marijuana",
      "filter": ["in", "status", "MMCC Approved"],
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "circle-radius": {
          stops: [[8, 1], [14, 7], [20, 12]]
        },
        "circle-color": "green",
        "circle-opacity": 0.66,
        "circle-stroke-width": 1,
        "circle-stroke-color": "black"
      }
  });
  // open a popup on click
  map.on('click', function (e) {
      var features = map.queryRenderedFeatures(e.point, { layers: ['marijuana-enforcement', 'marijuana-approval', 'marijuana-closed'] });
      if (!features.length) {
          return;
      }
      var feature = features[0];
      var html = `
      <span class="b">Name</span><br/>
      <span class="">${feature.properties.business_name}</span><br/>
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
      var features = map.queryRenderedFeatures(e.point, { layers: ['marijuana-enforcement', 'marijuana-approval', 'marijuana-closed'] });
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
  });
})

// summary stats
var countReq = new XMLHttpRequest();
countReq.open("GET", "https://gis.detroitmi.gov/arcgis/rest/services/BSEED/MedicalMarijuanaFacilities/FeatureServer/0/query?where=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=status&outStatistics=%5B%0D%0A++++%7B%0D%0A++++++++%22statisticType%22%3A+%22count%22%2C%0D%0A++++++++%22onStatisticField%22%3A+%22status%22%2C%0D%0A++++++++%22outStatisticFieldName%22%3A+%22status_count%22%0D%0A++++%7D%0D%0A%5D%0D%0A&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&sqlFormat=none&f=pjson", false);
countReq.send();
var count = JSON.parse(countReq.response)["features"];
console.log(count);
var closed = count[0]["attributes"]["status_count"]
var approval = count[1]["attributes"]["status_count"]
var approved = count[2]["attributes"]["status_count"]
var total = closed + approval + approved
// document.getElementById('total').innerHTML = total
document.getElementById('closed').innerHTML = closed
document.getElementById('approval').innerHTML = approval
document.getElementById('approved').innerHTML = approved
