let searchResults;

async function searchButton()
{
    searchResults = document.getElementById("list");
    const searchInput = document.getElementById("main-search");
    const searchItem = searchInput.value;
    if (searchItem.trim() === ""){
       searchResults.innerHTML = ""; 
    }
    const results = await getBooks(searchItem);
    showResults(results.docs);
}
async function getBooks(searchItem)
{
    const apiUrlBooks = `https://openlibrary.org/search.json?q=${searchItem}&fields=*,availability&limit=10`;
    const response = await fetch(apiUrlBooks);
    const results = await response.json();
    console.log(results);
    return results;
}
function showResults(results)
{
    searchResults = document.getElementById("list");
    searchResults.innerHTML='';
    results.forEach(result => {
        const listBook = document.createElement("li");
        const author = document.createElement("p");
        listBook.textContent = '"' + result.title + '"';
        author.textContent = 'by ' + result.author_name;
        listBook.appendChild(author);
        searchResults.appendChild(listBook);
    });
}