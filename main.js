let books;
let sortOption = 'Title';
const itemsPerPage = 10;
let currentPage = 0;
let url = new URL(window.location.href);
let input = document.querySelector('q');
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        handleClickRemove();
    }
    if (event.key === "Enter"){
        handleClickSearch();
    }
});

async function menu(menuOption){
    switch(menuOption){
        case 'search':
            books = await handleClickSearch();
            showResults(books, currentPage);
            createPageButtons(books);
            updateActiveButtonStates();
            break;
        case 'sort':
            showResults(handleSort(books), currentPage);
            break;
        case 'flip':
            showResults(flipArray(books), currentPage);
            break;   
    }
}

function createPageButtons(books) {
    const totalPages = Math.ceil(books.length / itemsPerPage);
    const paginationContainer = document.getElementById('pageButtons');
    paginationContainer.innerHTML = '';
    paginationContainer.classList.add('pagination');
    for (let i = 0; i < totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i + 1;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            showResults(books, currentPage);
            updateActiveButtonStates();
        });
        paginationContainer.appendChild(pageButton);
    }
}
function updateActiveButtonStates() {
    const pageButtons = document.querySelectorAll('.pagination button');
    pageButtons.forEach((button, index) => {
      if (index === currentPage) {
        button.classList.add('active');
      } 
      else {
        button.classList.remove('active');
      }
    });
}
function showResults(results, currentPage)
{
    const searchResults = document.getElementById("list");
    emptyPage();
    if (results.length === 0){
        const noBook = document.getElementById("no-book");
        noBook.style.display = 'block';
    }
    else{
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        results.forEach((result, index) => {
            const listBook = document.createElement("li");
            const title = document.createElement("p");
            const author = document.createElement("p");
            if (index < startIndex || index >= endIndex){
                listBook.id = 'hidden';
            }
            listBook.className = 'newBornBook';
            title.textContent = '\"' + result.title + '\"';
            title.className = 'titleBook';
            author.textContent = 'by ' + result.author_name;
            author.className = 'authorBook';
            listBook.appendChild(title);
            listBook.appendChild(author);
            searchResults.appendChild(listBook);
        });
        updateActiveButtonStates();
    }
}

async function handleClickSearch()
{
    const searchResults = document.getElementById("list");
    const loader = document.getElementById("loader");
    const searchInput = document.getElementById("main-input");
    const amountOfBooks = document.getElementById("input-number-found");
    emptyPage();
    const searchItem = searchInput.value;
    if (searchItem.trim() === ""){
       searchResults.innerHTML = ""; 
       searchInput.style.borderColor = 'red';
       return [];
    }
    else{
        searchInput.style.borderColor = 'black';
        loader.style.display = 'block';
        if(amountOfBooks.value <= 0){
            amountOfBooks.value = 10;
        } 
        results = await getBooks(searchItem, amountOfBooks.value);
        loader.style.display = 'none';
        return results.docs;
    }
}
async function getBooks(searchItem, numberResults)
{
    const apiUrlBooks = `https://openlibrary.org/search.json?q=${searchItem}&fields=title,author_name&limit=${numberResults}`;
    const response = await fetch(apiUrlBooks);
    const results = await response.json();
    console.log(results);
    return results;
}
function handleClickRemove(){
    const searchInput = document.getElementById("main-input");
    searchInput.value = '';
}
function emptyPage(){
    const searchResults = document.getElementById("list");
    const noBook = document.getElementById("no-book");
    searchResults.innerHTML='';
    noBook.style.display = 'none';
}
function handleSort(results){
    switch(sortOption){
        case 'Author':
            results.sort((a, b) => a.author_name[0].localeCompare(b.author_name[0]));
            break;
        default:
        case 'Title':
            results.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
    return results;
}
function handleSortOption(option){
    let sortButton = document.getElementById('dropbtn');
    sortButton.innerHTML = `Sort by ${option}`;
    sortOption = option;
}
function flipArray(results){
    if (results){
        return results.reverse();
    }
}