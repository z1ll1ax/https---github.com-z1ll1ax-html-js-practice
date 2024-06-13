let searchResults;
let sortOption = 'Title';
let results;
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        handleClickRemove();
    }
    if (event.key === "Enter"){
        handleClickSearch();
    }
});
async function handleClickSearch()
{
    searchResults = document.getElementById("list");
    const loader = document.getElementById("loader");
    const searchInput = document.getElementById("main-input");
    const amountOfBooks = document.getElementById("input-number-found");
    emptyPage();
    const searchItem = searchInput.value;
    if (searchItem.trim() === ""){
       searchResults.innerHTML = ""; 
       searchInput.style.borderColor = 'red';
    }
    else{
        searchInput.style.borderColor = 'black';
        loader.style.display = 'block';
        if(amountOfBooks.value <= 0){
            amountOfBooks.value = 10;
        } 
        results = await getBooks(searchItem, amountOfBooks.value);
        loader.style.display = 'none';
        showResults(results.docs);
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
function showResults(results)
{
    searchResults = document.getElementById("list");
    emptyPage();
    if (results.length === 0){
        const noBook = document.getElementById("no-book");
        noBook.style.display = 'block';
    }
    else{
        results.forEach(result => {
            const listBook = document.createElement("li");
            const title = document.createElement("p");
            const author = document.createElement("p");
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
    
}

function handleClickRemove(){
    const searchInput = document.getElementById("main-input");
    searchInput.value = '';
}
function emptyPage(){
    searchResults = document.getElementById("list");
    const noBook = document.getElementById("no-book");
    searchResults.innerHTML='';
    noBook.style.display = 'none';
}
function handleSort(){
    switch(sortOption){
        case 'Author':
            results.docs.sort((a, b) => a.author_name[0].localeCompare(b.author_name[0]));
            break;
        case 'Title':
            results.docs.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
    showResults(results.docs);
}
function handleSortOption(option){
    let sortButton = document.getElementById('dropbtn');
    sortButton.innerHTML = `Sort by ${option}`;
    sortOption = option;
}
function flipArray(){
    if (results){
        results.docs.reverse();
        showResults(results.docs);
    }
}