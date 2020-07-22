const URL = "http://localhost:3000/"
const qURL = URL + "quotes"
const lURL = URL + "likes/"
const qlURL = qURL + "?_embed=likes"

let fetchQuotes = () => {
    return fetch(qlURL)
    .then(res => res.json())
    .then(quotes => renderQuotes(quotes))
}

let renderQuotes = (quotes) => {
    let ul = document.querySelector('#quote-list')
    ul.innerHTML = ''
    quotes.forEach(quote => {
        let li = document.createElement('li')
        li.className = 'quote-card';
        li.innerHTML = `
        <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
            <button class='btn-warning'>Edit</button>
            <button class='btn-danger'>Delete</button>
        </blockquote>
        `
        ul.appendChild(li)
        let likeBttn = li.querySelector('.btn-success')
        let editBttn = li.querySelector('.btn-warning')
        let delBttn = li.querySelector('.btn-danger')
        likeBttn.addEventListener('click', (e) => {
            postLike(quote.id)
        })
        editBttn.addEventListener('click', (e) => {
            if (!li.children[1]) {
                let editForm = document.createElement('form')
                editForm.innerHTML = `
                <form id="edit-quote-form">
                <div class="form-group">
                    <label for="edit-quote">Edit Quote</label>
                    <input name="quote" type="text" class="form-control" id="edit-quote">
                </div>
                <div class="form-group">
                    <label for="Author">Author</label>
                    <input name="author" type="text" class="form-control" id="edit-author">
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
                </form>
                `
                editForm.querySelector('#edit-quote').value = quote.quote
                editForm.querySelector('#edit-author').value = quote.author
                editForm.addEventListener('submit', (e) => {
                    e.preventDefault()
                    patchQuote(quote.id, e.target.querySelector('#edit-quote').value, e.target.querySelector('#edit-author').value)
                })
                li.appendChild(editForm)
            } else {
                let editForm = li.querySelector('form')
                editForm.remove()
            }
            
        })
        delBttn.addEventListener('click', (e) => {
            delQuote(quote.id)
        })
    })
}

let postLike = (id) => {
    return fetch(lURL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({
            quoteId: id,
            createdAt: Date.now() 
        })
    }).then(res => res.json())
    .then(data => fetchQuotes())
}

let patchQuote = (id, content, author) => {
    return fetch(qURL + `/${id}`, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({
            quote: content,
            author: author
        })
    }).then(res => res.json())
    .then(data => fetchQuotes())
}

let delQuote = (id) => {
    return fetch(qURL + `/${id}`, {
        method: 'DELETE'
    }).then(res => res.json())
    .then(data => fetchQuotes())
}

let postQuote = (content, author) => {
    return fetch(qURL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({
            quote: content,
            author: author
        })
    }).then(res => res.json())
    .then(data => fetchQuotes())
}


document.addEventListener('DOMContentLoaded', () => {
    fetchQuotes()
    let form = document.querySelector('#new-quote-form')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        postQuote(e.target.querySelector('#new-quote').value, e.target.querySelector('#author').value)
    })
})