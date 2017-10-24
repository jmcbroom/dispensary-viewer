var _ = require('lodash')
import Helpers from './helpers.js'

const Legend = {

  addLayer: function(layerTable, layer, url) {
    let divHTML = `
        <div class='dib pa1 pa2-ns' style="background: ${layer.paint['circle-color']};">
          <span class='f7 f6-ns fw7'>${layer.name}: </span>
          <span class='f7 f6-ns' id="${Helpers.slugify(layer.name)}-count"></span>
        </div>
          `        
    layerTable.innerHTML += divHTML
    return divHTML
  },

  populateCounts: function(data) {
    data.forEach(d => {
      let countSpan = document.getElementById(`${Helpers.slugify(d['action'])}-count`)
      countSpan.innerHTML = d.count
    })
  }
}

export default Legend;