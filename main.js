let books;
let currentPage = 0;
let sortOption = 'title';
let asc = true;
let itemsShown = 60;
const itemsPerPage = 24;
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
        menu('search');
    }
});
async function menu(menuOption){
    switch(menuOption){
        case 'search':
            books = await handleClickSearch();
            showResults(books);
            break;
        case 'sort':
            books = await(handleSort(books));
            showResults(books);
            break;
        case 'flip':
            books = flipArray(books);
            showResults(books);
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
    let shown = urlParams.get('total');
    if (shown && !isNaN(shown)){
        if (parseInt(shown) < 1){
            shown = 60;
            urlParams.set('total', shown);
            history.pushState({}, '', `${path}?${urlParams}`);
        } 
        const amountOfBooks = document.getElementById("input-number-found");
        amountOfBooks.value = itemsShown = shown;
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
    else {
        urlParams.set('p', 1);
        history.pushState({}, '', `${path}?${urlParams}`);
    }
    let q = urlParams.get('q');
    if (q){
        let inp = document.getElementById('main-input');
        inp.value = q;
        await menu('search');
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
    if (books && currentPage != Math.ceil(books.length/itemsPerPage) - 1) {
        ++currentPage
        showResults(books);
        urlParams.set('p', currentPage + 1);
        history.pushState({}, '', `${path}?${urlParams}`);
    }
}
function prevPage(){
    if (books && currentPage != 0) {
        --currentPage;
        showResults(books);
        urlParams.set('p', currentPage + 1);
        history.pushState({}, '', `${path}?${urlParams}`);
    }
}

async function showResults(books)
{
    const searchResults = document.getElementById("list");
    const prevNextButtons = document.getElementsByClassName("move-page");
    const pagesAmount = document.getElementsByClassName("pages-amount");
    emptyPage();
    prevNextButtons[0].id = prevNextButtons[1].id = '';
    if (books.length === 0){
        const noBook = document.getElementById("no-book");
        noBook.style.display = 'block';
        prevNextButtons[0].id = prevNextButtons[1].id = pagesAmount[0].id = 'hidden';
        pagination();
    }
    else{
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        books.forEach((result, index) => {
            const listBook = document.createElement("li");
            const img = document.createElement("img");
            if (index < startIndex || index >= endIndex){
                listBook.id = 'hidden';
            }
            img.src = `imgs/empty-book.png`;
            img.onload = function() {
                if (this.naturalWidth === 1 && this.naturalHeight === 1) {
                    img.src = `imgs/empty-book.png`;
                    img.onload = null;
                    return;
                } else if (result && result.isbn && result.isbn.length > 0) {
                    img.src = `https://covers.openlibrary.org/b/isbn/${result.isbn[0]}-M.jpg`;
                } else {
                    img.src = `imgs/empty-book.png`;
                }
            };
            img.onerror = function() {
                img.src = `imgs/empty-book.png`;
            }
            const imgContainer = document.createElement("div");
            imgContainer.className = 'img-book';
            const textContainer = document.createElement("div");
            textContainer.className = 'text-field';
            const topicContainer = document.createElement("div");
            topicContainer.className = 'topic-field';
            const titleContainer = document.createElement("div");
            titleContainer.className = 'title-author-fields';
            const favButton = document.createElement("button");
            favButton.innerHTML = '<img src="imgs/favorite.png">';
            const title = document.createElement("p");
            const author = document.createElement("p");
            const description = document.createElement("p");
            listBook.className = 'newBornBook';
            title.textContent = `${index+1}.\"` + result.title + '\"';
            title.className = 'title-book';
            author.textContent = 'by ' + result.author_name;
            author.className = 'author-book';
            description.className = 'describe-book';
            let descript = result.first_sentence || ['No description'];
            if (descript[0].length >= 200) descript[0] = descript[0].substring(0, 200);
            description.textContent = descript[0];
            imgContainer.appendChild(img);
            titleContainer.appendChild(title);
            titleContainer.appendChild(author);
            topicContainer.appendChild(titleContainer);
            topicContainer.appendChild(favButton);
            textContainer.appendChild(topicContainer);
            textContainer.appendChild(description);
            listBook.appendChild(imgContainer);
            listBook.appendChild(textContainer);
            searchResults.appendChild(listBook);
        });
        pagination();
        if (currentPage === 0) prevNextButtons[0].id = 'disabled';
        let amount = Math.ceil(books.length/itemsPerPage);
        if (currentPage === amount - 1) prevNextButtons[1].id = 'disabled';
        pagesAmount[0].id = '';
        pagesAmount[0].innerText = `${startIndex + 1}-${endIndex} of ${books.length} total`;
    }
}
async function getBooks(searchItem, numberResults)
{
    const apiUrlBooks = `https://openlibrary.org/search.json?q=${searchItem}&fields=title,author_name,first_sentence,isbn&limit=${numberResults}`;
    const response = await fetch(apiUrlBooks);
    const results = await response.json();
    return results;
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
        urlParams.set('total', amountOfBooks.value);
        history.pushState({}, '', `${path}?${urlParams}`);
        return results.docs;
    }
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
function pagination(){
    const amountOfButtons = 9;
    const buttons = document.getElementsByClassName('page-number');
    for (const button of buttons){
        button.id = '';
    }
    let amount = Math.ceil(books.length/itemsPerPage);
    switch(true){
        case (amount === 1):
            buttons[0].innerText = 1;
            for (let i = 1; i < amountOfButtons; i++){
                buttons[i].id = 'hidden';
            }
            break;
        case (amount >= 1 && amount <= amountOfButtons):
            for (let i = 0; i < amountOfButtons; i++){
                if (i > amount - 1){
                    buttons[i].id = 'hidden';
                }
                else{
                    buttons[i].innerText = i + 1;
                }
            }
            break;
        case (amount > amountOfButtons):
            buttons[0].innerText = 1;
            buttons[amountOfButtons - 1].innerText = amount;
            if (currentPage < 4){
                for (let i = 1; i < 7; i++){
                    buttons[i].innerText = i + 1;
                }
                buttons[amountOfButtons - 2].innerText = '...';
                buttons[amountOfButtons - 2].id = 'disabled';
            }
            else if (currentPage > amount - 6){
                for (let i = 2; i < amountOfButtons - 1; i++){
                    buttons[i].innerText = amount + i - 8;
                }
                buttons[1].innerText = '...';
                buttons[1].id = 'disabled';
            }
            else {
                for (let i = 2; i < amountOfButtons - 2; i++){
                    buttons[i].innerText = currentPage - 3 + i;
                }    
                buttons[1].innerText = buttons[amountOfButtons - 2].innerText = '...';
                buttons[1].id = buttons[amountOfButtons - 2].id = 'disabled';
            }
            break;
        default:
            for (let i = 0; i < amountOfButtons; i++){
                buttons[i].id = 'hidden';
            }
            return;
    }
    for (button of buttons){
        if (button.innerText == currentPage + 1){
            button.id = 'active';
            break;
        }
    }
}
function pageTravelTo(id){
    const buttons = document.getElementsByClassName('page-number');
    currentPage = parseInt(buttons[id].innerText) - 1;
    urlParams.set('p', currentPage + 1);
    history.pushState({}, '', `${path}?${urlParams}`);
    showResults(books);
}