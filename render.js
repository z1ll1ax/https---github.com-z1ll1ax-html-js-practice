import { MyReact } from "./MyReact.js";
function configureBookPage(books, amountPerPage, page) {
  if (!books || books.length === 0) return;
  const list = document.getElementById("list");
  list.innerHTML = "";
  const pageMenu = document.getElementById("page-menu");
  const noBook = document.getElementById("no-book");
  pageMenu.style.display = noBook.style.display = "none";
  let startIndex = (page - 1) * amountPerPage,
    endIndex;
  startIndex + amountPerPage > books.length
    ? (endIndex = books.length)
    : (endIndex = startIndex + amountPerPage);
  for (let i = startIndex; i < endIndex; i++) {
    MyReact.render(configureBookElement(books[i], i), list);
    // const favButton = document.getElementById('favorite-button');
    // favButton.onclick = configureOnClickFavorite(books[i],
    //   document.getElementById('favorite-image'));
  }
  pagination(books, amountPerPage, page);
}
function configureBookElement(book, index) {
  let author, desript;
  const el = MyReact.createElement(
    "li",
    { className: "newBornBook" },
    MyReact.createElement(
      "div",
      { className: "img-book" },
      MyReact.createElement("img", {
        src:
          //`https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg` ||
          `imgs/empty-book.png`,
      }), //img config
    ),
    MyReact.createElement(
      "div",
      { className: "text-field" },
      MyReact.createElement(
        "div",
        { className: "topic-field" },
        MyReact.createElement(
          "div",
          { className: "title-author-fields" },
          MyReact.createElement("p", {
            className: "title-book",
            textContent: `${index + 1}.\"` + book.title + '"',
          }),
          (author = MyReact.createElement("p", {})),
        ),
        MyReact.createElement(
          "button",
          {
            id: "favorite-button",
            //onclick: configureOnClickFavorite(noBook)
          },
          MyReact.createElement("img", {}),
        ),
      ),
      MyReact.createElement(
        "div",
        { className: "description-fields" },
        MyReact.createElement("p", {
          id: "describe-book",
          textContent: "", //configureDesription(book)
        }),
      ),
    ),
  );
  let text;
  if (book && book.author_name && book.author_name.length > 3) {
    text = "by " + book.author_name.slice(0, 3) + " and others...";
  } else text = "by " + book.author_name;
  MyReact.updateProps(author, {
    className: "author-book",
    textContent: text,
  });
  return el;
}
function configureOnClickFavorite(book, heartPict) {
  if (isFavoriteImage(book) === "imgs/favorite-empty.png") {
    heartPict.src = "imgs/favorite-choosed.png";
    makeFavorite(book.isbn[0]);
  } else {
    heartPict.src = "imgs/favorite-empty.png";
    unmakeFavorite(book.isbn[0]);
  }
}
function configureAuthorName(author_name, authorElement) {
  let text = author_name;
  if (author_name && author_name.length > 3) {
    text = "by " + author_name.slice(0, 3) + " and others...";

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
  } else text = "by " + book.author_name;
}
function configureDesription() {}
//REFACTOR Too heavy, split into some f
// async function render(book, index) {
//   //loadPict
//   const img = document.createElement("img");
//   img.src = `imgs/empty-book.png`;
//   img.onload = function() {
//       if (this.naturalWidth === 1 && this.naturalHeight === 1) {
//           img.src = `imgs/empty-book.png`;
//           img.onload = null;
//           return;
//       } else if (book && book.isbn && book.isbn[0]) {
//           img.src = `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`;
//       } else {
//           img.src = `imgs/empty-book.png`;
//       }
//   };
//   img.onerror = function() { img.src = `imgs/empty-book.png`; }
//   //isFav
//   const favButton = document.createElement("button");
//   const heartPict = document.createElement("img");
//   favButton.appendChild(heartPict);
//   favButton.addEventListener("click", () => {
//     if (heartPict.src.includes("imgs/favorite-empty.png")) {
//       heartPict.src = "imgs/favorite-choosed.png";
//       makeFavorite(book.isbn[0]);
//     } else {
//       heartPict.src = "imgs/favorite-empty.png";
//       unmakeFavorite(book.isbn[0]);
//     }
//   });
//   heartPict.src = isFavoriteImage(book);
//   //displayPage
//   const listBook = createElementForPage("li", "newBornBook");
//   const imgContainer = createElementForPage("div", "img-book");
//   const textContainer = createElementForPage("div", "text-field");
//   const topicContainer = createElementForPage("div", "topic-field");
//   const descriptContainer = createElementForPage("div", "description-fields");
//   const titleContainer = createElementForPage("div", "title-author-fields");
//   const title = createElementForPage("p", "title-book");
//   const author = createElementForPage("p", "author-book");
//   const description = createElementForPage("p", "describe-book");
//   title.textContent = `${index + 1}.\"` + book.title + '"';
//   imgContainer.appendChild(img);
//   titleContainer.appendChild(title);
//   titleContainer.appendChild(author);
//   topicContainer.appendChild(titleContainer);
//   topicContainer.appendChild(favButton);
//   descriptContainer.appendChild(description);
//   textContainer.appendChild(topicContainer);
//   textContainer.appendChild(descriptContainer);
//   listBook.appendChild(imgContainer);
//   listBook.appendChild(textContainer);
//   const searchResults = document.getElementById("list");
//   searchResults.appendChild(listBook);
//   let descript = book.first_sentence || ["No description"];
//   if (descript[0].length >= 200) {
//     description.textContent = "";
//     description.textContent = descript[0].substring(0, 200) + "...";
//     const seeMoreDescript = createElementForPage("a", "see-more");
//     seeMoreDescript.textContent = "See more...";
//     seeMoreDescript.href = "#";
//     descriptContainer.appendChild(seeMoreDescript);
//     seeMoreDescript.onclick = function (event) {
//       event.preventDefault();
//       if (seeMoreDescript.className === "see-more") {
//         seeMoreDescript.className = "see-less";
//         seeMoreDescript.textContent = "See less";
//         description.textContent = book.first_sentence;
//       } else if (seeMoreDescript.className === "see-less") {
//         seeMoreDescript.className = "see-more";
//         seeMoreDescript.textContent = "See more...";
//         description.textContent = descript[0].substring(0, 200) + "...";
//       }
//     };
//   } else description.textContent = descript[0];
// }
function isFavoriteImage(book) {
  let src = "imgs/favorite-empty.png";
  for (let i = 0; i < localStorage.length; i++) {
    if (book && book.isbn && localStorage.key(i) === book.isbn[0]) {
      src = "imgs/favorite-choosed.png";
      break;
    }
  }
  return src;
}
function makeFavorite(isbn) {
  localStorage.setItem(isbn, true);
}
function unmakeFavorite(isbn) {
  localStorage.removeItem(isbn);
}

function createElementForPage(type, className) {
  const el = document.createElement(type);
  el.className = className;
  return el;
}
function pagination(books, amountPerPage, currentPage) {
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
  let amount = Math.ceil(books.length / amountPerPage);
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
    if (button.innerText === currentPage) {
      button.id = "active";
      break;
    }
  }
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
export { configureBookPage, loading };
