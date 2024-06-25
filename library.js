export class Library {
  constructor() {
    this.books = null;
    this.amountPerPage = 24;
  }
  setBooks(books) {
    this.books = books;
  }
  getBooks() {
    return this.books;
  }
  setAmountPerPage(amountPerPage) {
    this.amountPerPage = amountPerPage;
  }
  getAmountPerPage() {
    return this.amountPerPage;
  }
}
