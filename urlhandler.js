function UrlHandler() {}

UrlHandler.prototype.update = function(data) {
  this.createUrl(data);
};

UrlHandler.prototype.createUrl = function(data) {
  var modifiedData = this.modifyData(data);
  window.location.hash = encodeURIComponent(JSON.stringify(modifiedData));
};

UrlHandler.prototype.modifyData = function(data) {
  var modifiedData = $.extend(true, {}, data);
  $.each(modifiedData['filterData'], function(name, options) {
    var _this = this;
    $.each(options, function(key, value) {
      if (!value) {
        delete _this[key];
      }
    })
  });
  return modifiedData
};

UrlHandler.prototype.getDataFromUrl = function() {
  var hash = decodeURIComponent(window.location.hash.substring(1));
  if (hash.length > 0) {
    return JSON.parse(hash);
  } else {
    return {};
  }
};
