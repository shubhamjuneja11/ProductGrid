function GridView(options) {
  this.productOptions = options;
  this.$viewContainer = options.$viewContainer
  this.$productsContainer = this.$viewContainer.find('[data-property="products"]');
}

GridView.prototype.init = function(options) {
  this.productsData = options.products;
  this.pageChangeCallback = options.pageChangeCallback;
  this.currentStateOptions = options.currentStateOptions;
  if (options.pagination) {
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
  this.refreshNavigators(1);
};

GridView.prototype.refreshView = function(productsData) {
  this.productsData = productsData;
  this.refreshNavigators(1);
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
  this.$navigatorContainer = this.$viewContainer.find('[data-property="pages"]');
  this.bindPagesEventListener();
  this.refreshNavigators(page);
};

GridView.prototype.setCurrentPage = function(pageNumber) {
  if (pageNumber) {
    this.currentPage = pageNumber;
  } else {
    this.currentPage = 1;
  }
};

GridView.prototype.pageChange = function(pageNumber) {
  this.setCurrentPage(pageNumber);
  this.filterPageData();
  this.highlightSelectedPage(pageNumber);
};

GridView.prototype.bindPagesEventListener = function() {
  var _this = this;
  this.$navigatorContainer.on('click', 'a', function(event) {
    _this.pageChangeCallback($(this).attr('value'));
    event.preventDefault();
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
