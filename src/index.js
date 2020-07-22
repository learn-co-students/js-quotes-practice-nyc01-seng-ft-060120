document.addEventListener('DOMContentLoaded', (e) => {

    const quotesAndLikesUrl = 'http://localhost:3000/quotes?_embed=likes'
    const quotesUrl = 'http://localhost:3000/quotes'

    const quotesContainer = document.getElementById('quote-list')

    const quotesForm = document.getElementById('new-quote-form')

    let quotes;

    const fetchQuotes = () => {
        fetch(quotesAndLikesUrl)
        .then(response => response.json())
        .then(quotesArray => {
            quotes = quotesArray
            quotes.forEach(quote => renderQuote(quote))
        })
    }

    const renderQuote = (quote) => {

        const quoteLi = document.createElement('li')
        quoteLi.className = 'quote-card'

        const blockquote = document.createElement('blockquote')
        blockquote.className = 'blockquote'
        quoteLi.append(blockquote)
        
        const quoteBody = document.createElement('p')
        quoteBody.className = 'mb-0'
        quoteBody.innerText = quote.quote
        blockquote.append(quoteBody)

        const quoteFooterAuthor = document.createElement('footer')
        quoteFooterAuthor.className = 'blockquote-footer'
        quoteFooterAuthor.innerText = quote.author 
        blockquote.append(quoteFooterAuthor)

        const quoteBreak = document.createElement('br')
        blockquote.append(quoteBreak)

        const likeButton = document.createElement('button')
        likeButton.className = 'btn-success'
        likeButton.dataset.id = quote.id
        likeButton.textContent = `Likes:`

        let likesSpan = document.createElement('span')
        let totalLikes = quote.likes.length
        if (totalLikes === 0) {
            likesSpan.innerText = 0
        } else {
            likesSpan.innerText = totalLikes
        }
        likeButton.append(likesSpan)
        blockquote.append(likeButton)

        const deleteButton = document.createElement('delete')
        deleteButton.className = 'btn-danger'
        deleteButton.dataset.id = quote.id
        deleteButton.innerText =`Delete`
        blockquote.append(deleteButton)

        quotesContainer.append(blockquote)

        deleteQuote(deleteButton)

        likeQuote(likeButton)
    }

    const submitForm = () => {
        quotesForm.addEventListener('submit', (e) => {
            e.preventDefault()
            fetch(quotesUrl, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify({
                    quote: quotesForm.quote.value,
                    author: quotesForm.author.value,
                    likes: 0
                })
            })
            .then(response => response.json())
            .then(quoteObject => {
                quotes.push(quoteObject)    
                renderQuote(quoteObject)})
        })
    }

    const deleteQuote = (deleteButton) => {
        deleteButton.addEventListener('click', (e) => {
            e.preventDefault()
            let currentQuote = e.target.dataset.id
            let quoteNow = quotes.find(quote => quote.id == currentQuote)
            console.log(quotes)
            
            fetch(`${quotesUrl}/${quoteNow.id}`, {
                method: "DELETE"
            })
            deleteButton.parentNode.remove()
        })
    }

    const likeQuote = (likeButton) => {
        likeButton.addEventListener('click', e => {
            e.preventDefault()
            let currentQuote = e.target.dataset.id
            let quoteNow = quotes.find(quote => quote.id == currentQuote)
            let newLikes = quoteNow.likes.length + 1
            console.log(newLikes)
            console.log(`${quotesUrl}/${quoteNow.id}`)
            fetch(`${quotesUrl}/${quoteNow.id}`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                    "accepts": "application/json"
                },
                body: JSON.stringify({quoteNow})
            })
            .then(response => response.json())
            .then(fetchQuotes())
        })
    }

    submitForm()

    fetchQuotes()


})