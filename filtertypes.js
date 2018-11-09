/********************** Select Filter ********************/
function CheckBoxFilter(filterOptions, filterData) {
  this.filterData = filterData;
  this.options = filterOptions.options;
  this.callback = filterOptions.callback;
  this.name = filterOptions.name;
  this.productAttribute = filterOptions.productAttribute;
  this.viewTitle = filterOptions.attributes.viewTitle;
  this.currentState = filterOptions.currentState;
}

CheckBoxFilter.prototype.getView = function() {
  var filterViewTitle = this.createFilterTitle(this.name),
    filterOptionsView = this.createFilterOptionsView(this.name, this.options);
  this.filterView = $('<div>');
  this.bindEventListener();
  return this.filterView.append(filterViewTitle, filterOptionsView, '<br><br>');
};

CheckBoxFilter.prototype.applyFilter = function(productsData) {
  var selectedOptions = this.getSelectedOptions(),
    _this = this;
  if (Object.keys(selectedOptions).length > 0) {
    return productsData.filter(function(product) {
      return selectedOptions[product[_this.productAttribute]] == true;
    });
  } else {
    return productsData;
  }
};

CheckBoxFilter.prototype.getSelectedOptions = function() {
  var selectedOptions = {};
  $.each(this.filterView.find('input'), function(index, option) {
    if (option.checked){
      selectedOptions[option.value] = true;
    }
  });
  return selectedOptions;
};

CheckBoxFilter.prototype.bindEventListener = function() {
  var _this = this;
  this.filterView.on('click', 'input', function() {
    var __this = this;
    _this.filterData[this.value] = this.checked;
    _this.callback();
  });
}

CheckBoxFilter.prototype.createFilterTitle = function(filterName) {
  return $('<h2>').html(this.viewTitle);
};

CheckBoxFilter.prototype.createFilterOptionsView = function(filterName, filterOptions) {
  var parentContainer = $('<div>'),
    _this = this;
  $.each(filterOptions, function(option, _) {
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
    if (_this.currentState[checkBoxView.val()]) {
      checkBoxView.attr('checked', 'true');
    }
    parentContainer.append(checkBoxView.get(0)).append(label).append('<br>');
  });
  return parentContainer;
};

/***************** Boolean Filter ********************************/
function BooleanFilter(filterOptions, filterData) {
  this.filterData = filterData;
  this.options = filterOptions.options;
  this.callback = filterOptions.callback;
  this.name = filterOptions.name
  this.productAttribute = filterOptions.productAttribute;
  this.viewTitle = filterOptions.attributes.viewTitle;
  this.trueValue = filterOptions.attributes.trueValue;
  this.currentState = filterOptions.currentState;
}

BooleanFilter.prototype.getView = function() {
  this.filterView = $('<div>');
  this.bindEventListener();
  var _this = this,
    checkBoxView = $('<input>', {
      type: 'checkbox',
      value: _this.trueValue,
      id: _this.name,
      'filter-name': _this.name,
      'filter-type': 'boolean'
    }),
    label = $('<label>', {
      for: _this.name,
      text: _this.viewTitle
    });
  if (_this.currentState[checkBoxView.val()]) {
    checkBoxView.attr('checked', 'true');
  }
  this.filterView.append(checkBoxView, label, '<br>');
  return this.filterView.get(0);
};

BooleanFilter.prototype.bindEventListener = function() {
  var _this = this;
  this.filterView.on('click', 'input', function() {
    _this.filterData[this.value] = this.checked;
    _this.callback();
  });
}

BooleanFilter.prototype.applyFilter = function(productsData) {
  var _this = this;
  if (this.filterData[this.trueValue]) {
    return productsData.filter(function(product) {
      return product[_this.productAttribute] == _this.trueValue;
    });
  } else {
    return productsData;
  }
};
