var _ = require('lodash')
import Helpers from './helpers.js'

const Legend = {

  addLayer: function(layerTable, layer, url) {
    let divHTML = `
        <div class='dib pa1 pa2-ns v-mid' style="background: ${layer.paint['circle-color']};">
          <span class='f6 f5-ns fw4 mr1 v-mid dib'>${layer.name}</span>
          <span class='f5 f4-ns fw5 v-mid dib' id="${Helpers.slugify(layer.name)}-count">0</span>
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