function ProductGrid(options) {
  this.$productsContainer = options.productsContainer;
  this.filtersContainer = options.filtersContainer;
  this.requestUrl = options.requestUrl;
  this.filterOptions = options.filterOptions;
  this.filters = Object.keys(options.filterOptions);
  this.productAttributes = options.productAttributes;
  this.filterData = {};
  this.selectedFilters = {};
  var _this = this;
  $.each(this.filters, function(index, filter) {
    _this.filterData[filter] = {};
    _this.selectedFilters[filter] = {};
  });
}

ProductGrid.prototype.init = function(response) {
  this.filteredData = this.productData = response;
  this.setData();
  this.bindEventListeners();
};

/**************Event Binding***************************/
ProductGrid.prototype.bindEventListeners = function() {
  var _this = this;
  this.filtersContainer.on('click', 'input', function() {
    var $this = $(this);
    _this.updateSelectedFilters($this.attr('filter-name'), $this.attr('value'), $this.attr('filter-type'), $this[0].checked);
  });
};

ProductGrid.prototype.updateSelectedFilters = function(filterName, filterValue, filterType, filterChecked) {
  if (filterChecked) {
    this.selectedFilters[filterName][filterValue] = true;
  } else {
    delete this.selectedFilters[filterName][filterValue];
  }
  this.refreshProducts();
};

ProductGrid.prototype.refreshProducts = function() {
  var _this = this;
  this.filteredData = this.productData.filter(function(product) {
    return _this.shouldIncludeProduct(product);
  });
  this.setProductsData();
};

ProductGrid.prototype.shouldIncludeProduct = function(product) {
  var includeProduct = true,
    _this = this;
  $.each(this.selectedFilters, function(filterName, filterValue) {
    var productValue = product[filterName];
    if (Object.keys(filterValue).length != 0) {
      includeProduct = _this.selectedFilters[filterName][productValue] == true;
      return includeProduct;
    }
  });
  return includeProduct;
};

/**************Data fetching from server**********************/

ProductGrid.prototype.setData = function() {
  this.setProductsData();
  this.setFiltersData();
  this.createFilterViews();
};

/****************** Set Data*****************************/

ProductGrid.prototype.setFiltersData = function() {
  var _this = this;
  $.each(this.productData, function(index, product) {
    $.each(product, function(key, value) {
      if ($.inArray(key, _this.filters) != -1) {
        _this.filterData[key][value] = true;
      }
    });
  });
};

ProductGrid.prototype.createFilterViews = function() {
  var _this = this,
    filterFragment = document.createDocumentFragment();
  $.each(this.filterData, function(filterName, filterOptions) {
    filterOptions = Object.keys(filterOptions);
    var filterType = _this.filterOptions[filterName]['filterType'];
    if (filterType === 'boolean') {
      var filterView = _this.createBooleanFilter(filterName);
    } else {
      var filterView = _this.createfilterView(filterName, filterOptions);
    }
    filterFragment.append(filterView);
  });
  this.filtersContainer.append(filterFragment);
};

ProductGrid.prototype.createfilterView = function(filterName, filterOptions) {
  var filterViewTitle = this.createFilterTitle(filterName);
  filterView = $('<div>'),
    filterOptionsView = this.createFilterOptionsView(filterName, filterOptions)
  return filterView.append(filterViewTitle).append(filterOptionsView).append('<br><br>').get(0);
};

ProductGrid.prototype.createBooleanFilter = function(filterName) {
  var parentContainer = $('<div>'),
    checkBoxView = $('<input>', {
      type: 'checkbox',
      value: this.filterOptions[filterName]['trueValue'],
      id: filterName,
      'filter-name': filterName,
      'filter-type': 'boolean'
    }),
    label = $('<label>', {
      for: filterName,
      text: this.filterOptions[filterName]['title']
    });
  parentContainer.append(checkBoxView.get(0)).append(label).append('<br>');
  return parentContainer.get(0);
};

ProductGrid.prototype.createFilterTitle = function(filterName) {
  return $('<h2>').html(this.filterOptions[filterName]['viewTitle']).get(0);
};

ProductGrid.prototype.createFilterOptionsView = function(filterName, filterOptions) {
  var parentContainer = $('<div>');
  $.each(filterOptions, function(index, option) {
    var checkBoxView = $('<input>', {
        type: 'checkbox',
        value: option,
        id: option,
        'filter-name': filterName,
        'filter-type': 'multiple'
      }),
      label = $('<label>', {
        for: option,
        text: option
      });
    parentContainer.append(checkBoxView.get(0)).append(label).append('<br>');
  });
  return parentContainer.get(0);
};

ProductGrid.prototype.setProductsData = function() {
  var _this = this,
    fragment = document.createDocumentFragment();
  $.each(this.filteredData, function(index, value) {
    fragment.append(_this.loadProductToView(value));
  });
  this.$productsContainer.html(fragment);
};

/*********Creating new views*****************/
ProductGrid.prototype.loadProductToView = function(product) {
  return $('<div>', {
      class: this.productAttributes['class']
    })
    .append($('<div>').append($('<img>', {
      src: 'product_data/images/' + product['url']
    })))
    .append($('<div>', {
      'data-property': 'product-name',
      text: product['name']
    }))
    .get(0);
};

$(function() {
  var options = {
    requestUrl: 'product.json',
    productsContainer: $('[data-property=products'),
    filtersContainer: $('[data-property=filters]'),
    filterOptions: {
      'color': {
        viewTitle: 'Colors'
      },
      'brand': {
        viewTitle: 'Brands'
      },
      'sold_out': {
        viewTitle: 'Available',
        filterType: 'boolean',
        trueValue: '0',
        title: 'Exclude out of Stock'
      }
    },
    productAttributes: {
      class: 'product-item'
    }
  }
  var productGrid = new ProductGrid(options);
  var ajaxRequestHandler = new AjaxRequestHandler('product.json');
  ajaxRequestHandler.fetchData((function(response) {
    productGrid.init(response)
  }));
});
