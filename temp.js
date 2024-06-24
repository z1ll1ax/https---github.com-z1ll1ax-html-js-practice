let Library = (function () {
  let books;
  const amountPerPage = 24;
  function setBooks(newBooks) {
    books = newBooks;
  }
  return {
    setBooks: setBooks,
    getBooks: function () {
      return books;
    },
    getAmountPerPage: function () {
      return amountPerPage;
    },
    render: function () {
      const list = document.getElementById("list");
      const pageMenu = document.getElementById("page-menu");
      list.innerHTML = "";
      const noBook = document.getElementById("no-book");
      pageMenu.style.display = noBook.style.display = "none";
      if (!books) {
        return;
      }
      if (books.length === 0) {
        noBook.style.display = "block";
        return;
      }
      const page = urlGetParam("p") - 1;
      let startIndex = page * amountPerPage;
      let endIndex = startIndex + amountPerPage;
      if (endIndex > books.length) {
        endIndex = books.length;
      }
      for (let i = startIndex; i < endIndex; i++) {
        renderLi(i, isFavoriteImage(books[i]));
      }
      //pagination
      pagination();
    },
  };
})();
let Sort = (function () {
  let sortOption = "title";
  let sortOrder = "asc";
  function setOption(newSortOption) {
    sortOption = newSortOption;
  }
  function setOrder(newOrder) {
    sortOsortOrdertion = newOrder;
  }
  return {
    setOption: setOption,
    getOption: function () {
      return sortOption;
    },
    setOrder: setOrder,
    getOrder: function () {
      return sortOrder;
    },
  };
})();
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
//redo the getBooks
async function getBooks(url) {
  const response = await fetch(url);
  const books = await response.json();
  return books;
}
// async function getBooks(searchItem, amount){
//     const apiUrlBooks = `https://openlibrary.org/search.json?q=${searchItem}&fields=title,author_name,first_sentence,isbn&limit=${amount}`;
//     const response = await fetch(apiUrlBooks);
//     const books = await response.json();
//     return books.docs;
// }
async function getFavoriteBooks() {
  let books = [];
  for (let i = 0; i < localStorage.length; i++) {
    const apiUrlBook = `https://openlibrary.org/search.json?q=${localStorage.key(i)}&fields=title,author_name,first_sentence,isbn`;
    const response = await fetch(apiUrlBook);
    const result = await response.json();
    books.push(result.docs[0]);
  }
  return books;
}
function nextPage() {
  const books = Library.getBooks();
  const itemsPerPage = Library.getAmountPerPage();
  const currentPage = parseInt(urlGetParam("p"));
  if (books && currentPage != Math.ceil(books.length / itemsPerPage)) {
    urlSetParam("p", currentPage + 1);
    Library.render();
  }
}
function prevPage() {
  const books = Library.getBooks();
  const currentPage = parseInt(urlGetParam("p"));
  if (books && currentPage != 0) {
    urlSetParam("p", parseInt(currentPage) - 1);
    Library.render();
  }
}
function pageTravelTo(id) {
  const buttons = document.getElementsByClassName("page-number");
  urlSetParam("p", buttons[id].innerText);
  Library.render();
}
function pagination() {
  const books = Library.getBooks();
  const itemsPerPage = Library.getAmountPerPage();
  const currentPage = parseInt(urlGetParam("p"));
  const pageMenu = document.getElementById("page-menu");
  pageMenu.style.display = "inline";
  if (!books || books.length === 0) {
    return;
  }
  const buttons = document.getElementsByClassName("page-number");
  for (const button of buttons) {
    button.id = "";
  }
  const prevNextbuttons = document.getElementsByClassName("move-page");
  for (const button of prevNextbuttons) {
    button.id = "";
  }
  const amountOfButtons = buttons.length;
  let amount = Math.ceil(books.length / itemsPerPage);
  switch (true) {
    case amount >= 1 && amount <= amountOfButtons:
      for (let i = 0; i < amountOfButtons; i++) {
        if (i > amount - 1) {
          buttons[i].id = "hidden";
        } else {
          buttons[i].innerText = i + 1;
        }
      }
      break;
    case amount > amountOfButtons:
      buttons[0].innerText = 1;
      buttons[amountOfButtons - 1].innerText = amount;
      if (currentPage < 5) {
        for (let i = 1; i < 7; i++) {
          buttons[i].innerText = i + 1;
        }
        buttons[amountOfButtons - 2].innerText = "...";
        buttons[amountOfButtons - 2].id = "disabled";
      } else if (currentPage > amount - 5) {
        for (let i = 2; i < amountOfButtons - 1; i++) {
          buttons[i].innerText = amount + i - 8;
        }
        buttons[1].innerText = "...";
        buttons[1].id = "disabled";
      } else {
        for (let i = 2; i < amountOfButtons - 2; i++) {
          buttons[i].innerText = currentPage - 4 + i;
        }
        buttons[1].innerText = buttons[amountOfButtons - 2].innerText = "...";
        buttons[1].id = buttons[amountOfButtons - 2].id = "disabled";
      }
      break;
    default:
      for (let i = 0; i < amountOfButtons; i++) {
        buttons[i].id = "hidden";
      }
      return;
  }
  for (let button of buttons) {
    if (button.innerText == currentPage) {
      button.id = "active";
      break;
    }
  }
}
function isFavoriteImage(book) {
  let src = "imgs/favorite-empty.png";
  for (let i = 0; i < localStorage.length; i++) {
    if (book && book.isbn && localStorage.key(i) == book.isbn[0]) {
      src = "imgs/favorite-choosed.png";
      break;
    }
  }
  return src;
}
//NEED REFACTOR
async function getBookCover(book, imgElement) {
  let src = `imgs/empty-book.png`;
  imgElement.onload = function () {
    if (this.naturalWidth === 1 && this.naturalHeight === 1) {
      src = `imgs/empty-book.png`;
    } else if (book && book.isbn && book.isbn[0]) {
      src = `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`;
    } else {
      imgElement.src = `imgs/empty-book.png`;
    }
    imgElement.onload = null;
  };
  imgElement.onerror = function () {
    imgElement.onload = null;
    src = `imgs/empty-book.png`;
  };
  return src;
}
function createElementForPage(type, className) {
  const el = document.createElement(type);
  el.className = className;
  return el;
}
//REFACTOR Too heavy, split into some f
async function renderLi(index, isFavorite) {
  let book = Library.getBooks()[index];
  //loadPict
  const img = document.createElement("img");
  img.src = await getBookCover(book, img);
  //isFav
  const favButton = document.createElement("button");
  const heartPict = document.createElement("img");
  favButton.appendChild(heartPict);
  favButton.addEventListener("click", () => {
    if (heartPict.src.includes("imgs/favorite-empty.png")) {
      heartPict.src = "imgs/favorite-choosed.png";
      makeFavorite(book.isbn[0]);
    } else {
      heartPict.src = "imgs/favorite-empty.png";
      unmakeFavorite(book.isbn[0]);
    }
  });
  heartPict.src = isFavorite;
  //render
  const listBook = createElementForPage("li", "newBornBook");
  const imgContainer = createElementForPage("div", "img-book");
  const textContainer = createElementForPage("div", "text-field");
  const topicContainer = createElementForPage("div", "topic-field");
  const titleContainer = createElementForPage("div", "title-author-fields");
  const descriptContainer = createElementForPage("div", "description-fields");
  const title = createElementForPage("p", "title-book");
  const author = createElementForPage("p", "author-book");
  const description = createElementForPage("p", "describe-book");
  title.textContent = `${index + 1}.\"` + book.title + '"';
  imgContainer.appendChild(img);
  titleContainer.appendChild(title);
  titleContainer.appendChild(author);
  topicContainer.appendChild(titleContainer);
  topicContainer.appendChild(favButton);
  descriptContainer.appendChild(description);
  textContainer.appendChild(topicContainer);
  textContainer.appendChild(descriptContainer);
  listBook.appendChild(imgContainer);
  listBook.appendChild(textContainer);
  const searchResults = document.getElementById("list");
  searchResults.appendChild(listBook);
  if (book.author_name && book.author_name.length > 3) {
    author.textContent =
      "by " + book.author_name.slice(0, 3) + " and others...";
    const seeMoreAuthors = createElementForPage("a", "see-more");
    seeMoreAuthors.textContent = "See more...";
    seeMoreAuthors.href = "#";
    titleContainer.appendChild(seeMoreAuthors);
    seeMoreAuthors.onclick = function (event) {
      event.preventDefault();
      if (seeMoreAuthors.className === "see-more") {
        seeMoreAuthors.className = "see-less";
        seeMoreAuthors.textContent = "See less";
        author.textContent = "by " + book.author_name;
      } else if (seeMoreAuthors.className === "see-less") {
        seeMoreAuthors.className = "see-more";
        seeMoreAuthors.textContent = "See more...";
        author.textContent =
          "by " + book.author_name.slice(0, 3) + " and others...";
      }
    };
  } else author.textContent = "by " + book.author_name;
  let descript = book.first_sentence || ["No description"];
  if (descript[0].length >= 200) {
    description.textContent = "";
    description.textContent = descript[0].substring(0, 200) + "...";
    const seeMoreDescript = createElementForPage("a", "see-more");
    seeMoreDescript.textContent = "See more...";
    seeMoreDescript.href = "#";
    descriptContainer.appendChild(seeMoreDescript);
    seeMoreDescript.onclick = function (event) {
      event.preventDefault();
      if (seeMoreDescript.className === "see-more") {
        seeMoreDescript.className = "see-less";
        seeMoreDescript.textContent = "See less";
        description.textContent = book.first_sentence;
      } else if (seeMoreDescript.className === "see-less") {
        seeMoreDescript.className = "see-more";
        seeMoreDescript.textContent = "See more...";
        description.textContent = descript[0].substring(0, 200) + "...";
      }
    };
  } else description.textContent = descript[0];
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
  const url = `https://openlibrary.org/search.json?q=${searchInput.value}&fields=title,author_name,first_sentence,isbn&limit=${amountInput.value}`;
  loading("on");
  let response = await getBooks(url);
  Library.setBooks(response.docs);
  loading("off");
  urlClear();
  urlSetParam("q", searchInput.value);
  urlSetParam("p", 1);
  Library.render();
}
function loading(onOff) {
  const loader = document.getElementById("loader");
  const mainContent = document.getElementById("main-content");
  const noBook = document.getElementById("no-book");
  const pageMenu = document.getElementById("page-menu");
  pageMenu.style.display = noBook.style.display = "none";
  if (onOff === "on") {
    mainContent.style.display = "none";
    loader.style.display = "block";
  } else {
    mainContent.style.display = "block";
    loader.style.display = "none";
  }
}
async function handleClickFavorite() {
  let results = [];
  loading("on");
  for (let i = 0; i < localStorage.length; i++) {
    const url = `https://openlibrary.org/search.json?q=${localStorage.key(i)}&fields=title,author_name,first_sentence,isbn`;
    let response = await getBooks(url);
    results.push(response.docs[0]);
  }
  Library.setBooks(results);
  loading("off");
  //change url
  urlClear();
  urlSetParam("favorite", true);
  urlSetParam("p", 1);
  //render
  Library.render();
}
function makeFavorite(isbn) {
  localStorage.setItem(isbn, true);
}
function unmakeFavorite(isbn) {
  localStorage.removeItem(isbn);
}
function handleClickRemove() {
  const searchInput = document.getElementById("main-input");
  searchInput.value = "";
}
function handleClickSort() {
  let books = Library.getBooks();
  if (!books || books.length === 0) {
    return;
  }
  switch (Sort.getOption()) {
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
  urlSetParam("sortBy", Sort.getOption());
  Library.render();
}
function handleClickSortOption(option) {
  Sort.setOption(option);
  const but = document.getElementById("dropbtn");
  but.innerText = "Sort by " + Sort.getOption();
  handleClickSort();
}
function handleClickFlip() {
  let books = Library.getBooks();
  if (!books || books.length === 0) {
    return;
  }
  Library.setBooks(books.reverse());
  Library.render();
}
function urlSetParam(param, value) {
  const path = window.location.href.split("?")[0];
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(param, value);
  history.pushState({}, "", `${path}?${urlParams}`);
}
function urlGetParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
function urlClear() {
  const path = window.location.href.split("?")[0];
  history.replaceState({}, "", `${path}`);
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
