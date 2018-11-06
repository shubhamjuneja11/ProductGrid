function UrlHandler() {
}

UrlHandler.prototype.update = function(data) {
  this.createUrl(data);
};

UrlHandler.prototype.createUrl = function(data) {
  window.location.hash = encodeURIComponent(JSON.stringify(data));
};

UrlHandler.prototype.getDataFromUrl = function() {
  var hash = decodeURIComponent(window.location.hash.substring(1));
  if (hash.length > 0) {
    return JSON.parse(hash);
  } else {
    return {};
  }
};
