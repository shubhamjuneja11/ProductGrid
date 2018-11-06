function AttributesMap() {

}
AttributesMap.getJsonMappedAttribute = function(jsonKey) {
  return jsonKey.split('_').map(function(word, index) {
    if (index == 0) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join('');
};

AttributesMap.getMappedAttribute = function(key) {
  if (this.mappedAttributes[key]) {
    return mappedAttributes[key];
  } else {
    return this.mappedAttributes[key] = this.getJsonMappedAttribute(key);
  }
};
