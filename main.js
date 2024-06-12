let searchResults;

async function handleClickSearch()
{
    searchResults = document.getElementById("list");
    const loader = document.getElementById("loader");
    const searchInput = document.getElementById("main-search");
    emptyPage();
    const searchItem = searchInput.value;
    if (searchItem.trim() === ""){
       searchResults.innerHTML = ""; 
    }
    loader.style.display = 'block';
    const results = await getBooks(searchItem);
    loader.style.display = 'none';
    showResults(results.docs);
}
async function getBooks(searchItem)
{
    const apiUrlBooks = `https://openlibrary.org/search.json?q=${searchItem}&fields=*,availability&limit=10`;
    const response = await fetch(apiUrlBooks);
    const results = await response.json();
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
            const author = document.createElement("p");
            listBook.textContent = '"' + result.title + '"';
            author.textContent = 'by ' + result.author_name;
            listBook.appendChild(author);
            searchResults.appendChild(listBook);
        });
    }
}
function handleClickRemove(){
    const searchInput = document.getElementById("main-search");
    searchInput.value = '';
}
function emptyPage(){
    searchResults = document.getElementById("list");
    const noBook = document.getElementById("no-book");
    searchResults.innerHTML='';
    noBook.style.display = 'none';
}