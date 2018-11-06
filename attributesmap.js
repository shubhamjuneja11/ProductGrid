function AttributesMap(attributes) {

}
AttributesMap.mapAttributes = function(attributes) {
  var _this = this;
  this.mappedAttributes = {};
  $.each(attributes,function(index, attributeKey) {
    _this[attributeKey] = _this.getJsonMappedAttribute(attributeKey);
  });
};

AttributesMap.getJsonMappedAttribute = function(jsonKey) {
return jsonKey.split('_').map(function(word, index) {
    if (index == 0) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join('');
};

AttributesMap.getMappedAttribute = function(key){
  return this.mappedAttributes[key];
};
