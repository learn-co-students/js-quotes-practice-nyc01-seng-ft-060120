document.addEventListener('DOMContentLoaded', ()=>{

    const url = "http://localhost:3000/quotes?_embed=likes"
    const quoteList = document.getElementById('quote-list')
    const form = document.getElementById('new-quote-form')
 

    function fetchQuotes() {
        fetch(url)
        .then(resp => resp.json())
        .then(quotes => quotes.forEach(quote=>renderQuotes(quote)))
    }

    function renderQuotes(quote) {
        const quoteCard = document.createElement('li')
        quoteCard.className = 'quote-card'
        quoteCard.innerHTML = `
            <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button  id='${quote.id}' class='btn-success'>Likes: <span>0</span></button>
            <button id='${quote.id}' class='btn-danger'>Delete</button>
            </blockquote>
        `
        quoteList.append(quoteCard)
    }

    function postQuote(quote, author) {
        fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              'quote': quote,
              'author': author
            })
          })
          .then(resp => resp.json())
          .then(newQuote => renderQuotes(newQuote))
    }


    //listners
    form.addEventListener("submit", function(e){
        e.preventDefault();

        let quote = form.quote.value
        let author = form.author.value

        postQuote(quote, author)
        form.reset()
    })

    document.addEventListener("click", function(e){
        e.preventDefault();
        if (e.target.matches('.btn-danger')){
            deleteQuote(e.target.id)
            e.target.parentElement.parentElement.remove()     
        }
        else if (e.target.matches('.btn-success')){
            likeQuote(e.target.id)
            e.target.innerHTML = +1
        }
    
    })
    


    function deleteQuote(id){
        fetch(`http://localhost:3000/quotes/${id}`, {method: "DELETE"})
     }

    function likeQuote(id) {
            fetch(`http://localhost:3000/likes/${id}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            'body': JSON.stringify({
                "id": 1,
                "quoteId": id,
            })
        
            })
    }


    fetchQuotes()


})