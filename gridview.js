function GridView(options) {
  this.productOptions = options;
  this.$productsContainer = options.productsContainer;
  this.$navigatorContainer = options.navigatorContainer;
}

GridView.prototype.init = function(options) {
  this.productsData = options.products;
  this.pageChangeCallback = options.pageChangeCallback;
  this.currentStateOptions = options.currentStateOptions;
  this.paginationExist = options.pagination;
  if (this.paginationExist) {
    this.addPagination(options.currentStateOptions['page'], options.currentStateOptions['maxProductsPerPage']);
  } else {
    this.setProductsData(this.productsData);
  }
};

GridView.prototype.setProductsData = function(productsData) {
  var _this = this,
    container = $('<div>');
  $.each(productsData, function(index, product) {
    container.append(_this.loadProductToView(product));
  });
  this.$productsContainer.html(container.html());
};

GridView.prototype.loadProductToView = function(product) {
  return $('<div>', {
      class: this.productOptions['class']
    })
    .append($('<div>').append($('<img>', {
      src: product.url
    })))
    .append($('<div>', {
      'data-property': 'product-name',
      text: product.name
    }));
};
/******************** Pagination ************************************/
GridView.prototype.changeMaxProducts = function(maxProductsPerPage) {
  this.maxProductsPerPage = maxProductsPerPage;
  this.refreshNavigators();
};

GridView.prototype.refreshView = function(productsData) {
  this.productsData = productsData;
  if(this.paginationExist){
    this.refreshNavigators();
  } else {
    this.setProductsData(productsData);
  }
};

GridView.prototype.refreshNavigators = function(pageNumber) {
  this.setCurrentPage(pageNumber);
  this.createPageNavigators();
};

GridView.prototype.addPagination = function(page, maxProductsPerPage) {
  if (maxProductsPerPage) {
    this.maxProductsPerPage = maxProductsPerPage
  } else {
    this.maxProductsPerPage = this.productOptions.paginationAttributes.defaultValue;
  }
  this.bindPagesEventListener();
  this.refreshNavigators(page);
};

GridView.prototype.setCurrentPage = function(pageNumber = 1) {
  this.currentPage = pageNumber;
};

GridView.prototype.pageChange = function(pageNumber) {
  this.setCurrentPage(pageNumber);
  this.filterPageData();
  this.highlightSelectedPage(pageNumber);
};

GridView.prototype.bindPagesEventListener = function() {
  var _this = this;
  this.$navigatorContainer.on('click', 'a', function(event) {
    event.preventDefault();
    _this.pageChangeCallback($(this).attr('value'));
  });
};

GridView.prototype.createPageNavigators = function() {
  this.pagesCount = Math.ceil(Object.keys(this.productsData).length / this.maxProductsPerPage),
    pagesNavigator = $('<div>');
  for (var pageCount = 1; pageCount <= this.pagesCount; pageCount++) {
    pagesNavigator.append($('<a>', {
      'data-property': 'page-switcher',
      'page-count': pageCount,
      text: pageCount,
      value: pageCount,
      href: '#'
    }));
  }
  this.$navigatorContainer.html(pagesNavigator.html());
  this.filterPageData();
  this.highlightSelectedPage(this.currentPage);
};

GridView.prototype.filterPageData = function() {
  var firstProductIndex = (this.currentPage - 1) * this.maxProductsPerPage,
    lastProductindex = firstProductIndex + this.maxProductsPerPage;
  this.setProductsData(this.productsData.slice(firstProductIndex, lastProductindex));
};

GridView.prototype.highlightSelectedPage = function(pageNumber) {
  this.$navigatorContainer.find('.current-page').removeClass('current-page');
  this.$navigatorContainer.find('[page-count="' + pageNumber + '"]').addClass('current-page');
};
