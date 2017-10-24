var mapboxgl = require('mapbox-gl');
var yaml = require('yamljs');
var _ = require('lodash');

import Helpers from './helpers.js'
import Socrata from './socrata.js'
import Map from './map.js'
import Legend from './legend.js'
import Locate from './locate.js'

mapboxgl.accessToken = 'pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjajhmenkzejYwNm56MnFvNmF1anhmaXN6In0.hOESlZup6yOhJB8bH9kiWA';

document.getElementById('map').style.height = `${window.innerHeight * 0.79}px`;
// document.getElementById('map').style.height = `${window.innerHeight}px`;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/cityofdetroit/cj1gxcmoh001h2rr06vhx3dy8',
    center: [-83.091, 42.350],
    // center: [42.350, -83.091],
    zoom: 10,
    maxBounds: [
        [-83.427803, 41.985192],
        [-82.770451, 42.72023]
    ]
})

// nav control
map.addControl(new mapboxgl.NavigationControl(), 'top-right');

// load datasets.yml
const ds = yaml.load('datasets.yml')

map.on('load', function() {

    let interactiveLayers = []
    let categories = []

    // loop through datasets
    _.each(ds, (ds => {
        console.log(ds)
        // get URL based on the source.type
        switch (ds.source.type) {
            case "socrata":
                let sodaUrl = Socrata.makeURL(ds.source.url, 'geojson', ds.source.params)
                Map.addGeoJsonSource(map, ds.slug, sodaUrl)
                console.log(sodaUrl)
                break
            case "esri":
                let esriUrl = Esri.makeURL(ds.source.url, 'geojson', ds.source.params)
                console.log(esriUrl)
                Map.addGeoJsonSource(map, ds.slug, esriUrl)
                break
        }

        let legend = document.getElementById('legend')
        // loop through layers
        _.each(ds.layers, (l => {
            // replace the name & push to interactiveLayers
            l.layer_name = `${ds.slug}_${Helpers.slugify(l.name)}`;
            interactiveLayers.push(l.layer_name)
            Legend.addLayer(legend, l, ds.source.url)                        
            map.addLayer({
                "id": l.layer_name,
                "type": l.type,
                "source": ds.slug,
                "layout": l.layout,
                "paint": l.paint
            },
            // insert before the roads layer 
            'road-subway')
            // apply filter if exists
            if (l.filter) {
                map.setFilter(l.layer_name, l.filter)
            }
        }))
    }))

    let countParams = {
        "$group": "action",
        "$select": "count(*) as count, action"
    }

    fetch(Socrata.makeURL("5dsb-b4t3", "json", countParams)).then(r => {
        return r.json()
    }).then(x => { 
        Legend.populateCounts(x)
    })

    // mouseover/mouseout crosshair
    interactiveLayers.forEach(il => {
        map.on('mouseenter', il, function (e) {
            map.getCanvas().style.cursor = 'crosshair'
        });
        map.on('mouseout', il, function (e) {
            map.getCanvas().style.cursor = ''
        });
    })

    // listen to mapClick on interactiveLayers, and make popup
    let popup = null
    map.on('click', e => {
        if (popup) {
            popup.close()
        }
        let features = map.queryRenderedFeatures(e.point, { layers: interactiveLayers })
        if (features.length > 0) {
            Map.makePopup(map, features, ds)
        }
    })
})
