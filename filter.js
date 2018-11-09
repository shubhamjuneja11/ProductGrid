function Filter(filterOptions, filterData) {
  this.filterOptions = filterOptions;
  this.filterData = filterData;
}

Filter.prototype.getView = function() {
  switch (this.filterOptions.attributes.type) {
    case 'checkbox':
      this.filterObject = new CheckBoxFilter(this.filterOptions, this.filterData);
      break;
    case 'boolean':
      this.filterObject = new BooleanFilter(this.filterOptions, this.filterData);
      break;
  }
  return this.filterObject.getView();
};

Filter.prototype.applyFilter = function(productsData) {
  return this.filterObject.applyFilter(productsData);
};
