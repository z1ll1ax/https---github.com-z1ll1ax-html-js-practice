import { Library } from "./Library.js";
import { configureBookPage, loading } from "./render.js";
import { url } from "./url.js";
const library = new Library();
async function loadScreen() {
  let page = url.urlGetParam("p");
  if (!page || isNaN(page) || parseInt(page) < 1) {
    url.urlSetParam("p", 1);
  }
  let fav = url.urlGetParam("favorite");
  if (fav) {
    await handleClickFavorite();
  }
  let q = url.urlGetParam("q");
  if (q) {
    let searchInput = document.getElementById("main-input");
    searchInput.value = q;
    await handleClickSearch();
  }
  let sortBy = url.urlGetParam("sortBy");
  if (sortBy) {
    if (sortBy !== "author" || sortBy !== "title") sortBy = "title";
    handleClickSortOption(sortBy);
  }
  let order = url.urlGetParam("order");
  if (order) {
    if (sortBy !== "asc" || sortBy !== "desc") sortBy = "asc";
    if (order === "asc") {
    } else {
      flip();
    }
  }
}
async function getBooks(bookUrl) {
  const response = await fetch(bookUrl);
  const books = await response.json();
  return books;
}
function nextPage() {
  const books = library.getBooks();
  const itemsPerPage = library.getAmountPerPage();
  const currentPage = parseInt(url.urlGetParam("p"));
  if (books && currentPage !== Math.ceil(books.length / itemsPerPage)) {
    url.urlSetParam("p", currentPage + 1);
    configureBookPage(books, itemsPerPage, currentPage);
  }
}
function prevPage() {
  const books = library.getBooks();
  const currentPage = parseInt(url.urlGetParam("p"));
  if (books && currentPage !== 0) {
    url.urlSetParam("p", parseInt(currentPage) - 1);
    configureBookPage(books, library.getAmountPerPage(), currentPage);
  }
}
function pageTravelTo(id) {
  const buttons = document.getElementsByClassName("page-number");
  url.urlSetParam("p", buttons[id].innerText);
  configureBookPage(
    library.getBooks(),
    library.getAmountPerPage(),
    url.urlGetParam("p"),
  );
}
async function handleClickSearch() {
  const searchInput = document.getElementById("main-input");
  const amountInput = document.getElementById("input-number-found");
  if (searchInput.value.trim() === "") {
    searchInput.style.borderColor = "red";
    url.urlSetParam("q", "");
    return;
  }
  if (amountInput.value <= 0) {
    amountInput.value = 10;
  }
  searchInput.style.borderColor = "black";
  const bookUrl = `https://openlibrary.org/search.json?q=${searchInput.value}&fields=title,author_name,first_sentence,isbn&limit=${amountInput.value}`;
  loading("on");
  let response = await getBooks(bookUrl);
  library.setBooks(response.docs);
  loading("off");
  let curPage = url.urlGetParam("p");
  url.urlClear();
  url.urlSetParam("q", searchInput.value);
  if (
    curPage <= Math.ceil(library.getBooks().length / library.getAmountPerPage())
  ) {
    url.urlSetParam("p", curPage);
  } else {
    url.urlSetParam(
      "p",
      Math.ceil(library.getBooks().length / library.getAmountPerPage()),
    );
  }
  configureBookPage(
    library.getBooks(),
    library.getAmountPerPage(),
    url.urlGetParam("p"),
  );
}

async function handleClickFavorite() {
  let results = [];
  loading("on");
  for (let i = 0; i < localStorage.length; i++) {
    const bookUrl = `https://openlibrary.org/search.json?q=${localStorage.key(i)}&fields=title,author_name,first_sentence,isbn`;
    let response = await getBooks(bookUrl);
    results.push(response.docs[0]);
  }
  library.setBooks(results);
  loading("off");
  //change url
  url.urlClear();
  url.urlSetParam("favorite", true);
  url.urlSetParam("p", 1);
  //configureBookPage
  configureBookPage(
    library.getBooks(),
    library.getAmountPerPage(),
    url.urlGetParam("p"),
  );
}
function handleClickRemove() {
  const searchInput = document.getElementById("main-input");
  searchInput.value = "";
}
function handleClickSort() {
  let books = library.getBooks();
  if (!books || books.length === 0) {
    return;
  }
  let order = url.urlGetParam("order");
  if (order === "desc") {
    url.urlSetParam("order", "asc");
  }
  switch (url.urlGetParam("sortBy")) {
    case "author":
      books.sort((a, b) => {
        const authorNameA = a.author_name?.[0] || "";
        const authorNameB = b.author_name?.[0] || "";
        return authorNameA.localeCompare(authorNameB);
      });
      break;
    default:
    case "title":
      books.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
  url.urlSetParam("sortBy", url.urlGetParam("sortBy"));
  configureBookPage(
    library.getBooks(),
    library.getAmountPerPage(),
    url.urlGetParam("p"),
  );
}
function handleClickSortOption(option) {
  url.urlSetParam("sortBy", option);
  const but = document.getElementById("dropbtn");
  but.innerText = "Sort by " + url.urlGetParam("sortBy");
  handleClickSort();
}
function handleClickFlip() {
  let books = library.getBooks();
  if (!books || books.length === 0) {
    return;
  }
  library.setBooks(books.reverse());
  let order = url.urlGetParam("order");
  switch (order) {
    case "desc":
      url.urlSetParam("order", "asc");
      break;
    default:
    case "asc":
      url.urlSetParam("order", "desc");
      break;
  }
  configureBookPage(
    library.getBooks(),
    library.getAmountPerPage(),
    url.urlGetParam("p"),
  );
}
export {
  handleClickSearch,
  handleClickFavorite,
  handleClickRemove,
  handleClickSort,
  handleClickSortOption,
  handleClickFlip,
  loadScreen,
  pageTravelTo,
  nextPage,
  prevPage,
};
