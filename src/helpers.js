var moment = require('moment')

const Helpers = {
  makeParamString: function(p) {
    return Object.keys(p).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(p[k])}`).join("&") 
  },

  slugify: function(text) {
    return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
  },

  formatPopupValue: function(value, type) {
    switch(type) {
      case "text":
        return value
        break;
      case "date":
        console.log(value)
        if (value != 'null') {
          return moment(value).format('ll')          
        }
        else { return 'n/a' }
        break;
      case "money":
        return '$' + parseInt(value).toFixed(2)
        break
    }
  }

}

export default Helpers;
