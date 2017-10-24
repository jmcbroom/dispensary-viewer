import Helpers from './helpers.js'

const Socrata = {
  makeURL: function(id, type, params) {
    return `https://data.detroitmi.gov/resource/${id}.${type}?${Helpers.makeParamString(params)}`
  }
}

export default Socrata;