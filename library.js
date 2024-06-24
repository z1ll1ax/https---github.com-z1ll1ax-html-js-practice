let books = null;
let currentPage = 0;
let sortOption = "title";
let asc = true;
let itemsShown = 60;
const itemsPerPage = 24;
const path = window.location.href.split("?")[0];
const urlParams = new URLSearchParams(window.location.search);

async function search() {
  books = await handleClickSearch();
  showResults(books);
}
function sortBooks() {
  showResults(handleSort());
}
function flip() {
  showResults(flipArray());
}
async function loadScreen() {
  let shown = urlParams.get("total");
  if (shown && !isNaN(shown)) {
    if (parseInt(shown) < 1) {
      shown = 60;
      urlParams.set("total", shown);
      history.pushState({}, "", `${path}?${urlParams}`);
    }
    const amountOfBooks = document.getElementById("input-number-found");
    amountOfBooks.value = itemsShown = shown;
  }
  let page = urlParams.get("p");
  if (page && !isNaN(page)) {
    if (parseInt(page) < 1) {
      currentPage = 0;
      urlParams.set("p", currentPage + 1);
      history.pushState({}, "", `${path}?${urlParams}`);
    } else currentPage = page - 1;
  } else {
    urlParams.set("p", 1);
    history.pushState({}, "", `${path}?${urlParams}`);
  }
  let q = urlParams.get("q");
  if (q) {
    let inp = document.getElementById("main-input");
    inp.value = q;
    await search();
  }
  let sortBy = urlParams.get("sortBy");
  if (sortBy) {
    if (sortBy != "author" || sortBy != "title") sortBy = "author";
    sortOption = sortBy.toLowerCase();
    handleSortOption(sortOption);
    await sortBooks();
  }
  let order = urlParams.get("order");
  if (order) {
    if (sortBy != "asc" || sortBy != "desc") sortBy = "asc";
    if (order == "asc") {
      asc = true;
    } else {
      asc = false;
      flip();
    }
  }
}
function nextPage() {
  if (books && currentPage != Math.ceil(books.length / itemsPerPage) - 1) {
    ++currentPage;
    showResults(books);
    urlParams.set("p", currentPage + 1);
    history.pushState({}, "", `${path}?${urlParams}`);
  }
}
function prevPage() {
  if (books && currentPage != 0) {
    --currentPage;
    showResults(books);
    urlParams.set("p", currentPage + 1);
    history.pushState({}, "", `${path}?${urlParams}`);
  }
}
async function showResults(books) {
  const searchResults = document.getElementById("list");
  const prevNextButtons = document.getElementsByClassName("move-page");
  const pagesAmount = document.getElementsByClassName("pages-amount");
  emptyPage();
  prevNextButtons[0].id = prevNextButtons[1].id = "";
  if (!books || books.length === 0) {
    emptyPage();
    const noBook = document.getElementById("no-book");
    noBook.style.display = "block";
  } else {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let lastindex;
    books.forEach((result, index) => {
      const listBook = document.createElement("li");
      listBook.className = "newBornBook";
      const img = document.createElement("img");
      if (index < startIndex || index >= endIndex) {
        listBook.id = "hidden";
      }
      img.src = `imgs/empty-book.png`;
      img.onload = function () {
        if (this.naturalWidth === 1 && this.naturalHeight === 1) {
          img.src = `imgs/empty-book.png`;
          img.onload = null;
          return;
        } else if (result && result.isbn && result.isbn[0]) {
          img.src = `https://covers.openlibrary.org/b/isbn/${result.isbn[0]}-M.jpg`;
        } else {
          img.src = `imgs/empty-book.png`;
        }
      };
      img.onerror = function () {
        img.onload = null;
        img.src = `imgs/empty-book.png`;
      };
      const imgContainer = document.createElement("div");
      imgContainer.className = "img-book";
      const textContainer = document.createElement("div");
      textContainer.className = "text-field";
      const topicContainer = document.createElement("div");
      topicContainer.className = "topic-field";
      const titleContainer = document.createElement("div");
      titleContainer.className = "title-author-fields";
      const descriptContainer = document.createElement("div");
      descriptContainer.className = "description-fields";
      const favButton = document.createElement("button");
      const heartPict = document.createElement("img");
      heartPict.src = "imgs/favorite.png";
      favButton.appendChild(heartPict);
      for (let i = 0; i < localStorage.length; i++) {
        if (result.isbn && localStorage.key(i) == result.isbn[0]) {
          heartPict.src = "imgs/favorite-choosed.png";
          break;
        } else {
          heartPict.src = "imgs/favorite.png";
        }
      }
      favButton.addEventListener("click", () => {
        if (heartPict.src.includes("imgs/favorite.png")) {
          heartPict.src = "imgs/favorite-choosed.png";
          makeFavorite(result.isbn[0]);
        } else {
          heartPict.src = "imgs/favorite.png";
          unmakeFavorite(result.isbn[0]);
        }
      });
      const title = document.createElement("p");
      title.className = "title-book";
      const author = document.createElement("p");
      author.className = "author-book";
      const description = document.createElement("p");
      description.className = "describe-book";
      title.textContent = `${index + 1}.\"` + result.title + '"';
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
      searchResults.appendChild(listBook);
      if (result.author_name && result.author_name.length > 3) {
        author.textContent =
          "by " + result.author_name.slice(0, 3) + " and others...";
        const seeMoreAuthors = document.createElement("a");
        seeMoreAuthors.className = "see-more";
        seeMoreAuthors.textContent = "See more...";
        seeMoreAuthors.href = "#";
        titleContainer.appendChild(seeMoreAuthors);
        seeMoreAuthors.onclick = function (event) {
          event.preventDefault();
          if (seeMoreAuthors.className === "see-more") {
            seeMoreAuthors.className = "see-less";
            seeMoreAuthors.textContent = "See less";
            author.textContent = "by " + result.author_name;
          } else if (seeMoreAuthors.className === "see-less") {
            seeMoreAuthors.className = "see-more";
            seeMoreAuthors.textContent = "See more...";
            author.textContent =
              "by " + result.author_name.slice(0, 3) + " and others...";
          }
        };
      } else author.textContent = "by " + result.author_name;
      let descript = result.first_sentence || ["No description"];
      if (descript[0].length >= 200) {
        description.textContent = "";
        description.textContent = descript[0].substring(0, 200) + "...";
        const seeMoreDescript = document.createElement("a");
        seeMoreDescript.className = "see-more";
        seeMoreDescript.textContent = "See more...";
        seeMoreDescript.href = "#";
        descriptContainer.appendChild(seeMoreDescript);
        seeMoreDescript.onclick = function (event) {
          event.preventDefault();
          if (seeMoreDescript.className === "see-more") {
            seeMoreDescript.className = "see-less";
            seeMoreDescript.textContent = "See less";
            description.textContent = result.first_sentence;
          } else if (seeMoreDescript.className === "see-less") {
            seeMoreDescript.className = "see-more";
            seeMoreDescript.textContent = "See more...";
            description.textContent = descript[0].substring(0, 200) + "...";
          }
        };
      } else description.textContent = descript[0];
      lastindex = index;
    });
    pagination();
    if (currentPage === 0) prevNextButtons[0].id = "disabled";
    let amount = Math.ceil(books.length / itemsPerPage);
    if (currentPage === amount - 1) prevNextButtons[1].id = "disabled";
    pagesAmount[0].id = "";
    pagesAmount[0].innerText = `${startIndex + 1}-${lastindex + 1} of ${books.length} total`;
    console.log(books.slice(0, 5));
    console.log(books.slice(1, 3));
  }
}
function makeFavorite(isbn) {
  localStorage.setItem(isbn, true);
}
function unmakeFavorite(isbn) {
  localStorage.removeItem(isbn);
}
async function seeFavorite() {
  const loader = document.getElementById("loader");
  emptyPage();
  loader.style.display = "block";
  books = await getFavoriteBooks();
  loader.style.display = "none";
  showResults(books);
  // urlParams.set('favorite', true);
  // history.replaceState({}, '', `${path}?${urlParams}`);
}
async function getFavoriteBooks() {
  let results = [];
  for (let i = 0; i < localStorage.length; i++) {
    const apiUrlBook = `https://openlibrary.org/search.json?q=${localStorage.key(i)}&fields=title,author_name,first_sentence,isbn`;
    const response = await fetch(apiUrlBook);
    const result = await response.json();
    results.push(result.docs[0]);
  }
  return results;
}
async function getBooks(searchItem, numberResults) {
  const apiUrlBooks = `https://openlibrary.org/search.json?q=${searchItem}&fields=title,author_name,first_sentence,isbn&limit=${numberResults}`;
  const response = await fetch(apiUrlBooks);
  const results = await response.json();
  return results.docs;
}
async function handleClickSearch() {
  const searchResults = document.getElementById("list");
  const loader = document.getElementById("loader");
  const searchInput = document.getElementById("main-input");
  const amountOfBooks = document.getElementById("input-number-found");
  emptyPage();
  const searchItem = searchInput.value;
  if (searchItem.trim() === "") {
    searchResults.innerHTML = "";
    searchInput.style.borderColor = "red";
    return [];
  } else {
    searchInput.style.borderColor = "black";
    loader.style.display = "block";
    if (amountOfBooks.value <= 0) {
      amountOfBooks.value = 10;
    }
    let results = await getBooks(searchItem, amountOfBooks.value);
    loader.style.display = "none";
    urlParams.set("q", searchItem);
    urlParams.set("total", amountOfBooks.value);
    history.pushState({}, "", `${path}?${urlParams}`);
    return results;
  }
}
function handleClickRemove() {
  const searchInput = document.getElementById("main-input");
  searchInput.value = "";
}
function emptyPage() {
  const searchResults = document.getElementById("list");
  const noBook = document.getElementById("no-book");
  const pageMenu = document.getElementById("page-menu");
  searchResults.innerHTML = "";
  noBook.style.display = "none";
  pageMenu.style.display = "none";
}
function handleSort() {
  if (books) {
    switch (sortOption) {
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
    urlParams.set("sortBy", sortOption);
    history.pushState({}, "", `${path}?${urlParams}`);
  }
  return books;
}
function handleSortOption(option) {
  let sortButton = document.getElementById("dropbtn");
  sortButton.innerHTML = `Sort by ${option}`;
  sortOption = option;
  sortBooks();
}
function flipArray() {
  if (!books || books.length === 0) {
    return;
  }
  asc = !asc;
  if (asc) urlParams.set("order", "asc");
  else urlParams.set("order", "desc");
  history.pushState({}, "", `${path}?${urlParams}`);
  return books.reverse();
}
function pagination() {
  const pageMenu = document.getElementById("page-menu");
  pageMenu.style.display = "inline";
  if (!books || books.length === 0) {
    return;
  }
  const amountOfButtons = 9;
  const buttons = document.getElementsByClassName("page-number");
  for (const button of buttons) {
    button.id = "";
  }
  let amount = Math.ceil(books.length / itemsPerPage);
  switch (true) {
    case amount === 1:
      buttons[0].innerText = 1;
      for (let i = 1; i < amountOfButtons; i++) {
        buttons[i].id = "hidden";
      }
      break;
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
      if (currentPage < 4) {
        for (let i = 1; i < 7; i++) {
          buttons[i].innerText = i + 1;
        }
        buttons[amountOfButtons - 2].innerText = "...";
        buttons[amountOfButtons - 2].id = "disabled";
      } else if (currentPage > amount - 6) {
        for (let i = 2; i < amountOfButtons - 1; i++) {
          buttons[i].innerText = amount + i - 8;
        }
        buttons[1].innerText = "...";
        buttons[1].id = "disabled";
      } else {
        for (let i = 2; i < amountOfButtons - 2; i++) {
          buttons[i].innerText = currentPage - 3 + i;
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
    if (button.innerText == currentPage + 1) {
      button.id = "active";
      break;
    }
  }
}
function pageTravelTo(id) {
  const buttons = document.getElementsByClassName("page-number");
  currentPage = parseInt(buttons[id].innerText) - 1;
  urlParams.set("p", currentPage + 1);
  history.pushState({}, "", `${path}?${urlParams}`);
  showResults(books);
}
export {
  search,
  sortBooks,
  flip,
  loadScreen,
  nextPage,
  prevPage,
  seeFavorite,
  handleClickRemove,
  handleSortOption,
  pageTravelTo,
};
