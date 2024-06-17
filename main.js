let books;
let currentPage = 0;
let sortOption = 'title';
let asc = true;
let itemsShown = 60;
const itemsPerPage = 10;
const path = window.location.href.split('?')[0];
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
            nextPage(books);
            break;
        case 'prevPage':
            prevPage(books);
            break;  
    }
}
async function loadScreen(){
    let shown = urlParams.get('shown');
    if (shown && !isNaN(shown)){
        if (parseInt(shown) < 1){
            shown = 60;
            urlParams.set('shown', shown);
            history.pushState({}, '', `${path}?${urlParams}`);
        } 
        const amountOfBooks = document.getElementById("input-number-found");
        amountOfBooks.value = itemsShown = shown;
    }
    let q = urlParams.get('q');
    if (q){
        let inp = document.getElementById('main-input');
        inp.value = q;
        await menu('search');
    }
    let page = urlParams.get('p');
    if (page && !isNaN(page)){
        if (parseInt(page) < 1){
            currentPage = 0;
            urlParams.set('p', currentPage + 1);
            history.pushState({}, '', `${path}?${urlParams}`);
        } 
        else currentPage = page - 1;
    }
    let sortBy = urlParams.get('sortBy');
    if (sortBy){
        if(sortBy != 'author' || sortBy != 'title') sortBy = 'author';
        sortOption = sortBy.toLowerCase();
        handleSortOption(sortOption);
        await menu('sort');
    }
    let order = urlParams.get('order');
    if (order){
        if(sortBy != 'asc' || sortBy != 'desc') sortBy = 'asc';
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
        urlParams.set('p', currentPage + 1);
        history.pushState({}, '', `${path}?${urlParams}`);
    }
}
function prevPage(){
    if (books && currentPage != 0) {
        showResults(books, --currentPage);
        urlParams.set('p', currentPage + 1);
        history.pushState({}, '', `${path}?${urlParams}`);
    }
}

function showResults(books, currentPage)
{
    const pageB = document.getElementById('page-number');
    const searchResults = document.getElementById("list");
    emptyPage();
    if (books.length === 0){
        const noBook = document.getElementById("no-book");
        noBook.style.display = 'block';
    }
    else{
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        books.forEach((result, index) => {
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
        searchInput.style.borderColor = 'black';
        loader.style.display = 'block';
        if(amountOfBooks.value <= 0){
            amountOfBooks.value = 10;
        } 
        results = await getBooks(searchItem, amountOfBooks.value);
        loader.style.display = 'none';
        urlParams.set('q', searchItem);
        urlParams.set('shown', amountOfBooks.value);
        history.pushState({}, '', `${path}?${urlParams}`);
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
function handleSort(books){
    switch(sortOption){
        case 'author':
            books.sort((a, b) => {
                const authorNameA = a.author_name?.[0] || '';
                const authorNameB = b.author_name?.[0] || '';
                return authorNameA.localeCompare(authorNameB);
            });
            break;
        default:
        case 'title':
            books.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
    urlParams.set('sortBy', sortOption);
    history.pushState({}, '', `${path}?${urlParams}`);
    return books;
}
function handleSortOption(option){
    let sortButton = document.getElementById('dropbtn');
    sortButton.innerHTML = `Sort by ${option}`;
    sortOption = option;
    menu('sort');
}
function flipArray(){
    if (books){
        asc = !asc;
        if (asc) urlParams.set('order', 'asc');
        else urlParams.set('order', 'desc');
        history.pushState({}, '', `${path}?${urlParams}`);
        return books.reverse();
    }
}