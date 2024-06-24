// import {
//     search,
//     sortBooks,
//     flip,
//     loadScreen,
//     nextPage,
//     prevPage,
//     seeFavorite,
//     handleClickRemove,
//     handleSortOption,
//     pageTravelTo
// } from './library.js';
import {
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
} from "./temp.js";
document.addEventListener("DOMContentLoaded", function () {
  loadScreen();
});
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    handleClickRemove();
  }
  if (event.key === "Enter") {
    handleClickSearch();
  }
});

document
  .getElementById("favorites-button")
  .addEventListener("click", handleClickFavorite);
document
  .getElementById("remove-button")
  .addEventListener("click", handleClickRemove);
document
  .getElementById("search-button")
  .addEventListener("click", handleClickSearch);
document
  .getElementById("up-down-sort")
  .addEventListener("click", handleClickFlip);
document.getElementById("dropbtn").addEventListener("click", handleClickSort);
document.getElementById("sort-author").addEventListener("click", (event) => {
  handleClickSortOption("author");
});
document.getElementById("sort-title").addEventListener("click", (event) => {
  handleClickSortOption("title");
});
document.querySelectorAll(".page-number").forEach((button, index) => {
  button.addEventListener("click", () => {
    pageTravelTo(index);
  });
});
document.querySelectorAll(".move-page").forEach((button) => {
  button.addEventListener("click", (event) => {
    if (event.target.textContent === "Next") {
      nextPage();
    } else {
      prevPage();
    }
  });
});
// document.getElementById('favorites-button').addEventListener('click', seeFavorite);
// document.getElementById('remove-button').addEventListener('click', handleClickRemove);
// document.getElementById('search-button').addEventListener('click', search);
// document.getElementById('up-down-sort').addEventListener('click', flip);
// document.getElementById('dropbtn').addEventListener('click', sortBooks);
// document.querySelectorAll('.dropdown-content button').forEach(button => {
//     button.addEventListener('click', (event) => {
//         handleSortOption(event.target.textContent.split(' ')[2].toLowerCase());
//     });
// });
// document.querySelectorAll('.page-number').forEach((button, index) => {
//     button.addEventListener('click', () => {
//         pageTravelTo(index);
//     });
// });
// document.querySelectorAll('.move-page').forEach(button => {
//     button.addEventListener('click', (event) => {
//         if (event.target.textContent === 'Next') {
//             nextPage();
//         } else {
//             prevPage();
//         }
//     });
// });
