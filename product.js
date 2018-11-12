function Product(attributes) {
  this.name = attributes['name'];
  this.url = 'product_data/images/' + attributes['url'];
  this.brand = attributes['brand'];
  this.color = attributes['color'];
  this.soldOut = attributes['sold_out'];
}
