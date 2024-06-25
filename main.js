import {
  loadScreen,
  handleClickSearch,
  handleClickFavorite,
  handleClickRemove,
  handleClickSort,
  handleClickSortOption,
  handleClickFlip,
  pageTravelTo,
  nextPage,
  prevPage,
} from "./handlers.js";
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
