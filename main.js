let searchResults;

function FindBook()
{
    searchResults = document.getElementById("list");
    const searchInput = document.getElementById("main-search");
    const searchItem = searchInput.value;
    if (searchItem.trim() === ""){
       searchResults.innerHTML = ""; 
    }
    const apiUrlBooks = `https://openlibrary.org/search.json?q=${searchItem}&fields=*,availability&limit=10`;
    
    fetch(apiUrlBooks)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        const results = data.docs;
        ShowResults(results);
    })
    .catch(error => {
        console.error('Error:', error);
    }); 
}
function ShowResults(results){
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