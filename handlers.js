import { Library } from "./library.js";
import { Sort } from "./sort.js";
import { render, loading } from "./render.js";
import { urlSetParam, urlGetParam, urlClear } from "./urlParams.js";
const library = new Library();
const sort = new Sort();
async function loadScreen() {
  let page = urlGetParam("p");
  if (!page || isNaN(page) || parseInt(page) < 1) {
    urlSetParam("p", 1);
  }
  let fav = urlGetParam("favorite");
  if (fav) {
    await handleClickFavorite();
  }
  let q = urlGetParam("q");
  if (q) {
    let searchInput = document.getElementById("main-input");
    searchInput.value = q;
    await handleClickSearch();
  }
  let sortBy = urlGetParam("sortBy");
  if (sortBy) {
    if (sortBy != "author" || sortBy != "title") sortBy = "title";
    handleClickSortOption(sortBy);
  }
  let order = urlGetParam("order");
  if (order) {
    if (sortBy != "asc" || sortBy != "desc") sortBy = "asc";
    if (order == "asc") {
    } else {
      flip();
    }
  }
}
async function getBooks(url) {
  const response = await fetch(url);
  const books = await response.json();
  return books;
}
function nextPage() {
  const books = library.getBooks();
  const itemsPerPage = library.getAmountPerPage();
  const currentPage = parseInt(urlGetParam("p"));
  if (books && currentPage != Math.ceil(books.length / itemsPerPage)) {
    urlSetParam("p", currentPage + 1);
    render(books, itemsPerPage);
  }
}
function prevPage() {
  const books = library.getBooks();
  const currentPage = parseInt(urlGetParam("p"));
  if (books && currentPage != 0) {
    urlSetParam("p", parseInt(currentPage) - 1);
    render(books, library.getAmountPerPage());
  }
}
function pageTravelTo(id) {
  const buttons = document.getElementsByClassName("page-number");
  urlSetParam("p", buttons[id].innerText);
  render(library.getBooks(), library.getAmountPerPage());
}
async function handleClickSearch() {
  const searchInput = document.getElementById("main-input");
  const amountInput = document.getElementById("input-number-found");
  if (searchInput.value.trim() === "") {
    searchInput.style.borderColor = "red";
    urlSetParam("q", "");
    return;
  }
  if (amountInput.value <= 0) {
    amountInput.value = 10;
  }
  searchInput.style.borderColor = "black";
  const url = `https://openlibrary.org/search.json?q=${searchInput.value}&fields=title,author_name,first_sentence,isbn&limit=${amountInput.value}`;
  loading("on");
  let response = await getBooks(url);
  library.setBooks(response.docs);
  loading("off");
  let curPage = urlGetParam("p");
  urlClear();
  urlSetParam("q", searchInput.value);
  if (
    curPage <= Math.ceil(library.getBooks().length / library.getAmountPerPage())
  ) {
    urlSetParam("p", curPage);
  } else {
    urlSetParam(
      "p",
      Math.ceil(library.getBooks().length / library.getAmountPerPage()),
    );
  }
  render(library.getBooks(), library.getAmountPerPage());
}

async function handleClickFavorite() {
  let results = [];
  loading("on");
  for (let i = 0; i < localStorage.length; i++) {
    const url = `https://openlibrary.org/search.json?q=${localStorage.key(i)}&fields=title,author_name,first_sentence,isbn`;
    let response = await getBooks(url);
    results.push(response.docs[0]);
  }
  library.setBooks(results);
  loading("off");
  //change url
  urlClear();
  urlSetParam("favorite", true);
  urlSetParam("p", 1);
  //render
  render(library.getBooks(), library.getAmountPerPage());
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
  switch (sort.getOption()) {
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
  urlSetParam("sortBy", sort.getOption());
  render(library.getBooks(), library.getAmountPerPage());
}
function handleClickSortOption(option) {
  sort.setOption(option);
  const but = document.getElementById("dropbtn");
  but.innerText = "Sort by " + sort.getOption();
  handleClickSort();
}
function handleClickFlip() {
  let books = library.getBooks();
  if (!books || books.length === 0) {
    return;
  }
  library.setBooks(books.reverse());
  render(library.getBooks(), library.getAmountPerPage());
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
