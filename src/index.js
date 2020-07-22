const quoteLikesUrl = 'http://localhost:3000/quotes?_embed=likes'
const quoteList = document.querySelector('#quote-list')
const newQuoteForm = document.querySelector('#new-quote-form')
const quotesUrl = 'http://localhost:3000/quotes'
const likesUrl = 'http://localhost:3000/likes'
document.addEventListener('DOMContentLoaded', (event) => {
    getQuotes()	
    newQuote()

});

const getQuotes = () => {
	fetch(quoteLikesUrl)
	.then(resp => resp.json())
	.then(quotes => renderQuotes(quotes))
}


const renderQuotes = (quotes) => {
	quotes.forEach(quote => renderQuote(quote))
}

const renderQuote = (quote) => {
	


	quoteLi = document.createElement('li')
	quoteLi.className = 'quote-card'
	quoteLi.innerHTML = `
 	<blockquote class="blockquote">
      <p class="mb-0"> ${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
	`

	quoteList.append(quoteLi)
	//creating button element
	const deleteButton = quoteLi.querySelector('.btn-danger')
	const likeButton = quoteLi.querySelector('.btn-success')
	
	deleteButton.addEventListener('click', e => {
		deleteQuote(quote)
	})
	


	likeButton.addEventListener('click', e => {
		likeQuote(quote, e)
	})

}

const newQuote = () => {
	submitButton = document.querySelector('input[type = submit]')
	// console.log(submitButton)
	document.addEventListener('submit', e => {
		e.preventDefault()
		let newQuote = e.srcElement[0].value 
		let author = e.srcElement[1].value 
		quoteObj = {
			quote: newQuote,
			author: author,
			likes: []
		}
		postQuote(quoteObj)
	})

}

const postQuote = (quoteObj) => {
	fetch(likesUrl, {
		method: 'POST', 
		headers: {
			'Content-Type': 'application/json',
			'Accepts': 'application/json'
		},
		body: JSON.stringify(quoteObj)
	})
	.then(resp => resp.json())
	.then(renderQuote)
}

const deleteQuote = (quote) => {
	fetch(`${quotesUrl}/${quote.id}`, {
		method: 'DELETE'
	})
	.then(resp => resp.json())
	.then(renderQuote)
	//still need to figure out how to delete without the page reload 
}

const likeQuote = (quote) => {	
	likeObj = {
		quoteId: quote.id
	}
	postLike(likeObj, e)
}

const postLike = (likeObj) => {
	fetch(`${likesUrl}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(likeObj)
	})
	.then(resp => resp.json())
	.then(resp => updateLikes(resp, e))
}








