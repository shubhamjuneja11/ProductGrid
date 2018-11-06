function FilterManager(options) {
  this.$filtersContainer = options.$filtersContainer;
  this.availableFilters = options.filters;
  this.filtersNames = Object.keys(options.filters);
  this.filters = [];
  this.filtersData = {};
  var _this = this;
  $.each(this.filtersNames, function(index, filter) {
    _this.filtersData[filter] = {};
  });
}

FilterManager.prototype.init = function(options) {
  this.productsData = options.productsData;
  this.refreshData = options.refreshCallback;
  if (options.currentStateOptions) {
    this.filtersData = options.currentStateOptions;
  }
  this.createFilters();
  return this.getFilteredData();
};

FilterManager.prototype.createFilters = function() {
  this.setFiltersData();
  this.createFilterObjects();
  this.createFilterViews();
};

FilterManager.prototype.setFiltersData = function() {
  var _this = this;
  $.each(this.productsData, function(index, product) {
    $.each(_this.filtersNames, function(index, filterName) {
      var productAttributeValue = product[AttributesMap.getJsonMappedAttribute(filterName)];
      if (!_this.filtersData[filterName][productAttributeValue])
        _this.filtersData[filterName][productAttributeValue] = false;
    });
  });
};

FilterManager.prototype.createFilterObjects = function() {
  var _this = this;
  $.each(_this.filtersData, function(filterName, filterOptions) {
    var optionCurrentState = _this.filtersData[filterName],
      newFilterOptions = {
        attributes: _this.availableFilters[filterName],
        options: filterOptions,
        callback: _this.filterCallback(),
        productAttribute: AttributesMap.getJsonMappedAttribute(filterName),
        name: filterName,
        currentState: optionCurrentState
      }
    _this.filters.push(new Filter(newFilterOptions));
  });
};

FilterManager.prototype.getFilteredData = function() {
  var filteredData = this.productsData,
    _this = this;
  $.each(_this.filters, function(index, filter) {
    filteredData = filter.applyFilter(filteredData);
  });
  return filteredData;
};

FilterManager.prototype.filterCallback = function() {
  var _this = this;
  return function(options) {
    var filteredData = _this.getFilteredData();
    _this.updateCurrentStateData(options);
    _this.refreshData(filteredData, _this.filtersData);
  }
};

FilterManager.prototype.createFilterViews = function() {
  var filterFragment = document.createDocumentFragment();
  $.each(this.filters, function(index, filterObject) {
    filterFragment.append(filterObject.getView());
  });
  this.$filtersContainer.append(filterFragment);
};

FilterManager.prototype.updateCurrentStateData = function(options) {
  this.filtersData[options.name][options.value] = options.checked;
};
