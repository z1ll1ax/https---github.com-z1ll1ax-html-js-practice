let books;
const itemsPerPage = 10;
let currentPage = 0;
let sortOption = 'title';
let asc = true;
const urlParams = new URLSearchParams(window.location.search);
document.addEventListener('DOMContentLoaded', function() {
    loadScreen();
});
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
            console.log(1);
            showResults(books, currentPage);
            break;
        case 'sort':
            books = await(handleSort(books));
            showResults(books, currentPage);
            break;
        case 'flip':
            books = flipArray(books);
            showResults(books, currentPage);
            break; 
        case 'nextPage':
            nextPage();
            break;
        case 'prevPage':
            prevPage();
            break;  
    }
}
async function loadScreen(){
    const q = urlParams.get('q');
    if (q){
        let inp = document.getElementById('main-input');
        inp.value = q;
        await menu('search');
    }
    const page = urlParams.get('page');
    if (page){
        currentPage = page - 1;
    }
    const sortBy = urlParams.get('sortBy');
    if (sortBy){
        console.log(2);
        console.log(sortBy);
        sortOption = sortBy.toLowerCase();
        handleSortOption(sortOption);
        await menu('sort');
    }
    const order = urlParams.get('order');
    if (order){
        if (order == 'asc'){
            asc = true;
        }
        else{
            asc = false;
            menu('flip');
        }
    } 
}
function nextPage(){
    if (books && currentPage != Math.floor(books.length/itemsPerPage) - 1) {
        showResults(books, ++currentPage);
    }
}
function prevPage(){
    if (books && currentPage != 0) {
        showResults(books, --currentPage);
    }
}

function showResults(results, currentPage)
{
    const pageB = document.getElementById('page-number');
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
    }
    pageB.innerText = currentPage + 1;
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
        urlParams.values()[1] = searchInput.value;
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
        case 'author':
            results.sort((a, b) => a.author_name[0].localeCompare(b.author_name[0]));
            break;
        default:
        case 'title':
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
        asc = !asc;
        return results.reverse();
    }
}