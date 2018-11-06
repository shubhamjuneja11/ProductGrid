function Filter(filterData) {
  this.filterData = filterData
}

Filter.prototype.getView = function() {
  switch(this.filterData.attributes.type) {
    case 'select': this.filterObject = new SelectFilter(this.filterData);
      break;
    case 'boolean': this.filterObject = new BooleanFilter(this.filterData);
      break;
  }
  return this.filterObject.getView();
};

Filter.prototype.applyFilter = function(productsData) {
  return this.filterObject.applyFilter(productsData);
};

// Filter.prototype.getCurrentStatus = function() {
//   return this.filterObject.getCurrentStatus();
// };

// Filter.prototype.getName = function() {
//   return this.filterObject.getName();
// };
