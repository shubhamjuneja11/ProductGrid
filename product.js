function Product(attributes) {
  this.name = attributes['name'];
  this.url = 'product_data/images/' + attributes['url'];
  this.brand = attributes['brand'];
  this.color = attributes['color'];
  this.soldOut = attributes['sold_out'];
}

Product.getJsonMappedAttribute = function(jsonKey) {
  return jsonKey.split('_').map(function(word, index) {
    if (index == 0) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join('');
}
