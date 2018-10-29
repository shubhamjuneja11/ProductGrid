function ProductGrid(options) {
  this.$brandsContainer = options.brandsContainer;
  this.$colorsContainer = options.colorsContainer;
  this.$productsContainer = options.productsContainer;
  this.stockAvailableCheckBox = options.stockAvailableCheckBox;
  this.requestUrl = options.requestUrl;
  this.brandClass = options.brandClass;
  this.colorClass = options.colorClass;
  this.productClass = options.productClass;
  this.productImageClass = options.productImageClass;
  this.productNameClass = options.productNameClass;
  this.colorKey = options.colorKey;
  this.brandKey = options.brandKey;
  this.availableKey = options.availableKey;
  this.availableTrueValue = options.availableTrueValue;
}

ProductGrid.prototype.init = function() {
  this.fetchedBrands = [];
  this.fetchedColors = [];
  this.selectedBrands = [];
  this.selectedColors = [];
  this.bindEventListeners();
  this.fetchData();
};

/**************Event Binding***************************/
ProductGrid.prototype.bindEventListeners = function() {
  var _this = this;
  this.stockAvailableCheckBox.on('click', function() {
    _this.filterStockAvailability(this);
  });
  this.$brandsContainer.on('click', 'input', function() {
    _this.updateFilterArray(_this, this, _this.selectedBrands);
  });
  this.$colorsContainer.on('click', 'input', function() {
    _this.updateFilterArray(_this, this, _this.selectedColors);
  });
};

ProductGrid.prototype.filterStockAvailability = function(checkBox) {
  if (checkBox.checked) {
    this.includeOnlyAvailableProducts = true;
  } else {
    this.includeOnlyAvailableProducts = false;
  }
  this.refreshProducts();
};

ProductGrid.prototype.updateFilterArray = function(gridContext, checkBox, filterArray) {
  if (checkBox.checked) {
    filterArray.push(checkBox.value);
  } else {
    filterArray.splice($.inArray(checkBox.value, filterArray), 1)
  }
  this.refreshProducts();
};

/*******************Filter data****************************/

ProductGrid.prototype.filterData = function() {
  var _this = this;
  return this.productData.filter(function(product) {
    return _this.shouldIncludeProduct(product);
  });
};

ProductGrid.prototype.refreshProducts = function() {
  this.setProductsData(this.filterData());
};

ProductGrid.prototype.shouldIncludeProduct = function(product) {
  var includeProduct = true,
    _this = this;
  if (includeProduct && this.includeOnlyAvailableProducts) {
    includeProduct = (product[this.availableKey] === this.availableTrueValue);
  }
  if (includeProduct && this.selectedBrands.length > 0) {
    includeProduct = $.inArray(product[this.brandKey], _this.selectedBrands) != -1;
  }
  if (includeProduct && this.selectedColors.length > 0) {
    includeProduct = $.inArray(product[this.colorKey], _this.selectedColors) != -1
  }
  return includeProduct;
};

/**************Data fetching from server**********************/
ProductGrid.prototype.fetchData = function() {
  var _this = this;
  $.ajax({
      url: this.requestUrl,
      dataType: "json"
    })
    .done(function(response) {
      _this.productData = response;
      _this.setData();
    });
};

ProductGrid.prototype.setData = function() {
  this.setFilterOptions();
  this.setBrandsData();
  this.setColorsData();
  this.setProductsData(this.productData);
};

/****************** Set Data*****************************/
ProductGrid.prototype.setFilterOptions = function() {
  var _this = this;
  $.each(this.productData, function(index, value) {
    var brand = value[_this.brandKey],
      color = value[_this.colorKey];
    if (_this.fetchedBrands.indexOf(brand) == -1) {
      _this.fetchedBrands.push(brand);
    }
    if (_this.fetchedColors.indexOf(color) == -1) {
      _this.fetchedColors.push(color);
    }
  });
};

ProductGrid.prototype.setBrandsData = function() {
  var _this = this;
  $.each(this.fetchedBrands, function(index, brandName) {
    var newBrand = _this.createBrand(brandName);
    _this.$brandsContainer.append(newBrand);
  });
};

ProductGrid.prototype.setColorsData = function() {
  var _this = this;
  $.each(this.fetchedColors, function(index, colorName) {
    var newColor = _this.createColor(colorName);
    _this.$colorsContainer.append(newColor);
  });
};

ProductGrid.prototype.setProductsData = function(productsData) {
  var _this = this,
    fragment = document.createDocumentFragment();
  $.each(productsData, function(index, value) {
    fragment.append(_this.loadProductToView(index, value));
  });
  this.$productsContainer.html(fragment);
};

/*********Creating new views*****************/
ProductGrid.prototype.createNewProduct = function() {
  return $('<div>').addClass(this.productClass)
    .append($('<div>')
      .addClass(this.productImageClass)
      .append('<img>'))
    .append($('<div>')
      .addClass(this.productNameClass));
};

ProductGrid.prototype.loadProductToView = function(index, product) {
  return this.createNewProduct()
    .find('img')
    .attr('src', 'product_data/images/' + product['url'])
    .end()
    .find('.product-name')
    .text(product['name'])
    .end()
    .get(0);
};

ProductGrid.prototype.createBrand = function(brandName) {
  return $('<div>').addClass(this.brandClass)
    .html('<label for="' + brandName + '">' + brandName + '</label><input type="checkbox" value="' + brandName + '"">');
};

ProductGrid.prototype.createColor = function(colorName) {
  return $('<div>').addClass(this.colorClass)
    .html('<label for="' + colorName + '">' + colorName + '</label><input type="checkbox" value="' + colorName + '"">');
};

$(function() {
  var options = {
    brandsContainer: $('[data-property=brands'),
    colorsContainer: $('[data-property=colors]'),
    productsContainer: $('[data-property=products'),
    stockAvailableCheckBox: $('[data-property=available]'),
    productClass: 'product-item',
    productNameClass: 'product-name',
    productImageClass: 'product-image',
    requestUrl: 'product.json',
    brandClass: 'brand-item',
    colorClass: 'color-item',
    colorKey: 'color',
    brandKey: 'brand',
    availableKey: 'sold_out',
    availableTrueValue: '0'
  };
  var productGrid = new ProductGrid(options);
  productGrid.init();
});
