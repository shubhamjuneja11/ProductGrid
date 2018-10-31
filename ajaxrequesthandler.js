function AjaxRequestHandler(requestUrl) {
  this.requestUrl = requestUrl;
}

AjaxRequestHandler.prototype.fetchData = function(callback) {
  var _this = this;
   $.ajax({
      url: this.requestUrl,
      dataType: "json"
    })
    .done(function(response) {
      callback(response);
    });
};
