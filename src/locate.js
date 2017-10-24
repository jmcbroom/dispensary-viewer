import Helpers from './helpers.js'

const Locate = {
  /**
   * Send an address to the geocoder.
   * @param {string} address a street address in the CoD
   * @returns {Promise} res
   */
  geocodeAddress: function(address) {
    const geocodeURL = 'https://gis.detroitmi.gov/arcgis/rest/services/DoIT/CompositeGeocoder/GeocodeServer/findAddressCandidates?'
    let params = {
      'Street': '',
      'City': '',
      'outSR': '4326',
      'outFields': '*',
      'SingleLine': address,
      'f': 'pjson'
    };
    return fetch(geocodeURL + Helpers.makeParamString(params)).then((r) => {
      var res = r.json()
      return res
    })
  }
}

export default Locate