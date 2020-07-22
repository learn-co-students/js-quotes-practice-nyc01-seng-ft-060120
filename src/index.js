document.addEventListener('DOMContentLoaded', () => {
    
    const baseURL = "http://localhost:3000/quotes/";
    const quoteULElement = document.getElementById('quote-list');
    const quoteForm = document.getElementById('new-quote-form');
    const containerElement = document.getElementById('container');

    containerElement.querySelector('button').addEventListener('click', sortQuotes);

    function getQuotes() {
        fetch(baseURL).then(resp => resp.json())
        .then(quotes => loadQuotes(quotes))
    }
    function loadQuotes(quotes) {
        quoteULElement.innerHTML = "";
        quotes.forEach(quote => {
            quoteULElement.innerHTML +=
            `
            <li class='quote-card'>
                <blockquote class="blockquote" data-id = ${quote.id}>
                    <p class="mb-0">${quote.quote}</p>
                    <footer class="blockquote-footer">${quote.author}</footer>
                    <br>
                    <button class='btn-success'>Likes: <span>${quote.likes || 0}</span></button>
                    <button class='btn-danger'>Delete</button>
                </blockquote>
            </li>
            `
        });
    }
    function addLike(element) {
        const quoteId = element.parentNode.dataset.id;
        const newTextContentObject = updateLikeButtonText(element.textContent);
        element.textContent = newTextContentObject.text;

        fetch(baseURL + quoteId, {
            method: 'PATCH',
            headers: {'content-type' : 'application/json'},
            body: JSON.stringify({likes: newTextContentObject.likes})
        })
    }

    function updateLikeButtonText(text) {
        // Cuts the text content of the like button and increases the likes
        let likePart = text.substr(0, 7);
        let number = parseInt(text.substr(7), 10) + 1;
        return {text: likePart + number, likes: number};
    }

    function handleDelete(element) {
        const quoteId = element.parentNode.dataset.id;
        fetch(baseURL + quoteId, {
            method: 'DELETE',
            headers: {'content-type' : 'application/json'}
        }).then(success => getQuotes());
    }

    function addQuote(event) {
        event.preventDefault();
        const quote = quoteForm.quote.value;
        const author = quoteForm.author.value;

        fetch(baseURL, {
            method: 'POST',
            headers: {'content-type' : 'application/json'},
            body: JSON.stringify({quote, author})
        }).then(success => getQuotes());

        quoteForm.reset();
    }

    quoteULElement.addEventListener('click', (event) => {
        const target = event.target;
        if (target.nodeName === 'BUTTON') {
            if (target.textContent.includes('Likes')) {
                addLike(target);
            } else if  (target.textContent.includes('Delete')) {
                handleDelete(target);
            }
        }
    })

    function sortQuotes(event) {
        const spanElement = event.target;
        if (spanElement.textContent === "OFF") {
            spanElement.textContent = "ON";
        } else if (spanElement.textContent === "ON") {
            spanElement.textContent = "OFF";
        }
    }

    quoteForm.addEventListener('submit', addQuote);

    getQuotes();
})