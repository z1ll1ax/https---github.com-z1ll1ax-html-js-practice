function FindBook()
{
    const searchInput = document.getElementById("main-search");
    const searchResults = document.getElementById("list");
    console.log(2);
    const searchItem = searchInput.value;
    console.log(searchItem);
    if (searchItem.trim() === ""){
       searchResults.innerHTML = ""; 
    }
    //const apiUrlBooks = 'https://openlibrary.org/search.json?format=json&action=query&list=search&utf8=1&srsearch=${searchItem}';
    const apiUrlBooks = `https://openlibrary.org/search.json?q=${searchItem}&fields=*,availability&limit=1`;
    
    fetch(apiUrlBooks)
    .then(response => {
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Data not found');
              } else if (response.status === 500) {
                throw new Error('Server error');
              } else {
                throw new Error('Network response was not ok');
              }
        }
        return response.json();
    })
    .then(data => {
        //searchResults.innerHTML= JSON.stringify(data, null, 2);
        console.log(data);
        const results = data.query.search;
        ShowResults(results);
    })
    .catch(error => {
        console.error('Error:', error);
    }); 
}
function ShowResults(results){
    searchResults.innerHTML='';
    results.forEach(result => {
        const listBook = document.createElement("li");
        const author = document.createElement("p");
        listBook.textContent = result.title;
        author.textContent = result.author;
    });
}