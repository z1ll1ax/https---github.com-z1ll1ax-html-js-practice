import './style.css';
import 
{
    handleClickRemove,
    handleSortOption,
    search,
    sortBooks,
    flip,
    pageTravelTo
} from 
'./library';
// document.addEventListener('DOMContentLoaded', () => {
//   const removeButton = document.getElementById('remove-button');
//   const searchButton = document.getElementById('search-button');
//   const upDownSortButton = document.getElementById('up-down-sort');
//   const sortButton = document.getElementById('dropbtn');
//   const sortTitleButton = document.querySelector('.dropdown-content button:nth-child(2)');
//   const sortAuthorButton = document.querySelector('.dropdown-content button:nth-child(1)');
//   const pageButtons = document.querySelectorAll('.page-number');
  
//   removeButton.addEventListener('click', handleClickRemove);
//   searchButton.addEventListener('click', () => search());
//   upDownSortButton.addEventListener('click', () => flip());
//   sortButton.addEventListener('click', () => sortBooks());
//   sortTitleButton.addEventListener('click', () => handleSortOption('title'));
//   sortAuthorButton.addEventListener('click', () => handleSortOption('author'));
  
//   pageButtons.forEach((button, index) => {
//       button.addEventListener('click', () => pageTravelTo(index));
//   });
// });
