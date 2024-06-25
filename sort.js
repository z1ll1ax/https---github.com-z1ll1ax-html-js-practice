export class Sort {
  constructor() {
    this.sortOption = "title";
    this.sortOrder = "asc";
  }
  setOption(sortOption) {
    this.sortOption = sortOption;
  }
  getOption() {
    return this.sortOption;
  }
  setOrder(newOrder) {
    sortOsortOrdertion = newOrder;
  }
  getOrder() {
    return this.sortOrder;
  }
}
