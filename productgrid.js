function ProductGrid(options) {
  this.$filtersContainer = options.filterOptions.$filtersContainer;
  this.$pagesContainer = options.pagesContainer;
  this.filters = Object.keys(options.filterOptions);
  this.paginationAttributes = options.gridViewOptions.paginationAttributes;
  this.products = [];
  this.gridView = new GridView(options.gridViewOptions);
  this.filterManager = new FilterManager(options.filterOptions);
  this.sortingOptions = options.gridViewOptions.sortingOptions;
  this.urlHandler = new UrlHandler();
  this.attributesMap = new AttributesMap(options.jsonKeys);
  this.currentStatus = this.urlHandler.getDataFromUrl();
}

ProductGrid.prototype.refreshViewCallback = function() {
  var _this = this;
  return function(productsData, filtersData) {
    _this.filteredProducts = productsData;
    if (filtersData) {
      _this.updateFiltersCurrentStatus(filtersData);
    }
    _this.updateCurrentPageNumberStatus(1);
    var sortedProductsData = _this.sortProducts(productsData, _this.currentStatus['sort']);
    _this.gridView.refreshView(sortedProductsData);
  }
};

ProductGrid.prototype.init = function(response) {
  this.responseData = response;
  this.createProducts();
  var _this = this,
    filterManagerOptions = {
      productsData: _this.products,
      refreshCallback: _this.refreshViewCallback(),
      currentStateOptions: _this.currentStatus['filterData']
    };
  this.filteredData = this.filterManager.init(filterManagerOptions);
  this.addSorting();
  this.addPagination();
  var sortedProductsData = _this.sortProducts(_this.filteredData, _this.currentStatus['sort']),
    gridViewOptions = {
      products: sortedProductsData,
      pagination: true,
      pageChangeCallback: _this.pageChangeCallback.bind(_this),
      currentStateOptions: {
        'page': _this.currentStatus['page'],
        'maxProductsPerPage': parseInt(this.currentStatus['productsPerPage'])
      }
    };
  this.gridView.init(gridViewOptions);

};

ProductGrid.prototype.createProducts = function() {
  var _this = this;
  $.each(this.responseData, function(index, productData) {
    _this.products.push(new Product(productData));
  });
};

ProductGrid.prototype.pageChangeCallback = function(pageNumber) {
  this.updateCurrentPageNumberStatus(pageNumber);
  this.gridView.pageChange(pageNumber);
};

/*********************Pagination*************************/

ProductGrid.prototype.addPagination = function() {
  this.createPagesDropDown();
  this.bindPagesEventListener();
};

ProductGrid.prototype.createPagesDropDown = function() {
  var optionsList = this.paginationAttributes.pagesValues,
    _this = this;
  this.paginationDropDownList = $('<select>');
  $.each(optionsList, function(index, pageValue) {
    var option = $('<option>', {
      value: pageValue,
      text: pageValue
    });
    if (_this.currentStatus['productsPerPage'] == pageValue) {
      option.attr('selected', 'selected');
    }
    _this.paginationDropDownList.append(option);
  });
  this.$filtersContainer.append(this.paginationDropDownList);
};

ProductGrid.prototype.bindPagesEventListener = function() {
  var _this = this;
  this.paginationDropDownList.on('change', function() {
    _this.gridView.changeMaxProducts(this.value);
    _this.updateCurrentPageNumberStatus(1);
    _this.updateViewManipulatorsCurrentState('productsPerPage', this.value);
  });

};

ProductGrid.prototype.getDropDownCurrentStatus = function(key, dropDown) {
  return {
    name: key,
    selected: dropDown.val()
  }
};

/****************************Sorting*************************************/
ProductGrid.prototype.addSorting = function() {
  this.createSortDropDown();
  this.bindSortEventListener();
};

ProductGrid.prototype.createSortDropDown = function() {
  var optionsList = this.sortingOptions.values,
    _this = this;
  this.sortingDropDownList = $('<select>');
  $.each(optionsList, function(index, sortValue) {
    var option = $('<option>', {
      value: AttributesMap.getJsonMappedAttribute(sortValue),
      text: 'Sort by ' + AttributesMap.getJsonMappedAttribute(sortValue)
    });
    if (_this.currentStatus['sort'] === sortValue) {
      option.attr('selected', 'selected');
    }
    _this.sortingDropDownList.append(option);
  });
  this.$filtersContainer.append(this.sortingDropDownList);
};

ProductGrid.prototype.bindSortEventListener = function() {
  var _this = this;
  this.sortingDropDownList.on('change', function() {
    var sortProperty = this.value,
      sortedProductsData = _this.sortProducts(_this.filteredData, sortProperty);
    _this.updateViewManipulatorsCurrentState('sort', sortProperty);
    _this.gridView.refreshView(sortedProductsData);
  });
};

ProductGrid.prototype.sortProducts = function(productsData, sortProperty) {
  return productsData.slice(0).sort(function(product1, product2) {
    var prop1 = product1[sortProperty],
      prop2 = product2[sortProperty];
    return prop1 > prop2 ? 1 : -1;
  });
};

/*********************************Status*********************/
ProductGrid.prototype.updateCurrentPageNumberStatus = function(pageNumber) {
  this.currentStatus['page'] = pageNumber;
  this.urlHandler.update(this.currentStatus);
};

ProductGrid.prototype.updateFiltersCurrentStatus = function(filtersData) {
  this.currentStatus['filterData'] = filtersData;
  this.urlHandler.update(this.currentStatus);
};

ProductGrid.prototype.updateViewManipulatorsCurrentState = function(manipulatorName, manipulatorValue) {
  this.currentStatus[manipulatorName] = manipulatorValue;
  if (manipulatorName === 'sort') {
    this.updateCurrentPageNumberStatus(1);
  }
  this.urlHandler.update(this.currentStatus);
};

/*****************************Main**************************************/
$(function() {
  var options = {
    jsonKeys: ['name','url','color','brand','sold_out'],
    pagesContainer: $('[data-property=pages]'),
    filterOptions: {
      $filtersContainer: $('[data-property=filters]'),
      filters: {
        'color': {
          viewTitle: 'Colors',
          type: 'select'
        },
        'brand': {
          viewTitle: 'Brands',
          type: 'select'
        },
        'sold_out': {
          viewTitle: 'Available',
          filterType: 'boolean',
          trueValue: '0',
          title: 'Exclude out of Stock',
          type: 'boolean'
        }
      },
    },
    gridViewOptions: {
      class: 'product-item',
      $viewContainer: $('[data-property=grid]'),
      paginationAttributes: {
        pagesValues: [3, 6, 9],
        defaultValue: 3
      },
      sortingOptions: {
        values: ['name', 'color', 'brand', 'sold_out']
      }
    },
  }
  var productGrid = new ProductGrid(options);
  var ajaxRequestHandler = new AjaxRequestHandler('product.json');
  ajaxRequestHandler.fetchData((function(response) {
    productGrid.init(response)
  }));
});