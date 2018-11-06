/********************** Select Filter ********************/
function SelectFilter(filterData) {
  this.options = filterData.options;
  this.callback = filterData.callback;
  this.name = filterData.name;
  this.productAttribute = filterData.productAttribute;
  this.viewTitle = filterData.attributes.viewTitle;
  this.currentState = filterData.currentState;
}

SelectFilter.prototype.getView = function() {
  var filterViewTitle = this.createFilterTitle(this.name),
    filterOptionsView = this.createFilterOptionsView(this.name, this.options);
  this.filterView = $('<div>');
  this.bindEventListener();
  return this.filterView.append(filterViewTitle, filterOptionsView, '<br><br>').get(0);
};

SelectFilter.prototype.applyFilter = function(productsData) {
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

SelectFilter.prototype.getSelectedOptions = function() {
  var selectedOptions = {};
  $.each(this.filterView.find('input'), function(index, option) {
    if (option.checked)
      selectedOptions[option.value] = true;
  });
  return selectedOptions;
};

SelectFilter.prototype.bindEventListener = function() {
  var _this = this;
  this.filterView.on('click', 'input', function() {
    var __this = this,
      data = {
        name: _this.name,
        value: __this.value,
        checked: __this.checked
      }
    _this.callback(data);
  });
}

SelectFilter.prototype.createFilterTitle = function(filterName) {
  return $('<h2>').html(this.viewTitle);
};

SelectFilter.prototype.createFilterOptionsView = function(filterName, filterOptions) {
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
function BooleanFilter(filterData) {
  this.options = filterData.options;
  this.callback = filterData.callback;
  this.name = filterData.name
  this.productAttribute = filterData.productAttribute;
  this.viewTitle = filterData.attributes.viewTitle;
  this.trueValue = filterData.attributes.trueValue;
  this.currentState = filterData.currentState;
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
    var __this = this,
      data = {
        name: _this.name,
        value: __this.value,
        checked: __this.checked
      }
    _this.callback(data);
  });
}

BooleanFilter.prototype.applyFilter = function(productsData) {
  var _this = this;
  if (this.filterChecked()) {
    return productsData.filter(function(product) {
      return product[_this.productAttribute] == _this.trueValue;
    });
  } else {
    return productsData;
  }
};

BooleanFilter.prototype.filterChecked = function() {
  return this.filterView.find('input').get(0).checked;
};
