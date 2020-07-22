document.addEventListener("DOMContentLoaded", function() {
    const QUOTE_URL = "http://localhost:3000/quotes"
    const LIKE_URL = "http://localhost:3000/likes"
    const quoteList = document.getElementById('quote-list')
    const quoteForm = document.getElementById('new-quote-form')

    let allLikes = []

    function getLikes() {
        fetch(`${LIKE_URL}`)
            .then(resp => resp.json())
            .then(json => {
                for (const like in json) {
                    allLikes.push(json[like])
                }
            })
    }

    function getQuotes() {
        fetch(QUOTE_URL)
            .then(resp => resp.json())
            .then(json => {
                for (const newQuote in json) {
                    addQuoteToList(json[newQuote])
                }
            })
    }

    function addQuoteToList(obj) {
        const quote = document.createElement('li')
        quote.classList.add('quote-card')
        quote.dataset.id = obj["id"]
        quote.innerHTML = `
        <blockquote class="blockquote">
            <p class="mb-0">${obj["quote"]}</p>
            <footer class="blockquote-footer">${obj["author"]}</footer>
            <br>
            <button class='btn-success'>Likes: <span>0</span></button>
            <button class='btn-danger'>Delete</button>
        </blockquote>
        `
        const likeNumber = quote.querySelector('span')
        assignLikes(quote, likeNumber)
        quoteList.append(quote)
        likeOrDelete(quote)
    }

    function assignLikes(quote, likeNumber) {
        for (const like in allLikes) {
            if (allLikes[like]["quoteId"] === parseInt(quote.dataset.id)) {
                let likeInt = parseInt(likeNumber.innerText)
                likeInt += 1
                likeNumber.innerText = likeInt
            }
        }
    }

    function likeOrDelete(quote) {
        quote.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-success')) {
                likeQuote(quote)
                const likeNumber = quote.querySelector('span')
                likeNumber.innerText = parseInt(likeNumber.innerText) + 1
            } else if (e.target.classList.contains('btn-danger')) {
                deleteQuote(quote)
            }
        })
    }

    function likeQuote(quote) {
        let formData = {
            quoteId: parseInt(quote.dataset.id), 
            createdAt: Date.now()
        }
        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }, 
            body: JSON.stringify(formData)
        }
        fetch(LIKE_URL, configObj)
            .then(resp => resp.json())
            .then(json => {
                console.log(quote.querySelector('span'))
            })
    }

    function deleteQuote(quote) {
        let configObj = {
            method: "DELETE", 
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }
        fetch(`${QUOTE_URL}/${quote.dataset.id}`, configObj)
            .then(quote.remove())
    }

    function createQuote(event) {
        let formData = {
            quote: event.target["new-quote"].value, 
            author: event.target["author"].value
        }
        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }, 
            body: JSON.stringify(formData)
        }
        fetch(QUOTE_URL, configObj)
            .then(resp => resp.json())
            .then(json => addQuoteToList(json))
    }

    getLikes()
    getQuotes()

    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault()
        createQuote(e)
    })

})