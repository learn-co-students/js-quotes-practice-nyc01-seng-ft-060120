document.addEventListener('DOMContentLoaded', function(){

    // Populate page with quotes with a `GET` request to
        //   `http://localhost:3000/quotes?_embed=likes`. The query string in this URL tells 
        //   `json-server` to include the likes for a quote in the JSON of the response. You
        //   should not use this query string when creating or deleting a quote.

    getQuotes()

    function getQuotes(){
        fetch(`http://localhost:3000/quotes?_embed=likes`)
        .then(resp => resp.json())
        .then(quotes => renderQuotes(quotes))
    }

    // * Each quote should have the following structure:
        //   ```html
        //     <li class='quote-card'>
        //       <blockquote class="blockquote">
        //         <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
        //         <footer class="blockquote-footer">Someone famous</footer>
        //         <br>
        //         <button class='btn-success'>Likes: <span>0</span></button>
        //         <button class='btn-danger'>Delete</button>
        //       </blockquote>
        //     </li>
        //   ```

    quotesDiv = document.querySelector("#quote-list")
    function renderQuotes(quotes){
        quotes.forEach(quote => {
            quoteLi = document.createElement('li')
            quoteLi.class='quote-card'
            quoteLi.innerHTML = `
                <blockquote id=${quote.id} class="blockquote">
                    <p class="mb-0">${quote.quote}</p>
                    <footer class="blockquote-footer">${quote.author}</footer>
                    <br>
                    <button class='btn-success'>Likes: <span id=like${quote.id}>${quote.likes.length}</span></button>
                    <button class='btn-danger'>Delete</button>
                </blockquote>
            `
            quotesDiv.append(quoteLi)
        })
    }

    // * Submitting the form creates a new quote and adds it to the list of quotes
    //   without having to refresh the page. Pessimistic rendering is reccommended.

    const newQuoteForm = document.getElementById("new-quote-form")
    newQuoteForm.id = 'formData'

    document.addEventListener('submit', formData);
    function formData(e){
        e.preventDefault();
        let quote = document.getElementById('new-quote').value; 
        let author = document.getElementById('author').value;
        fetch('http://localhost:3000/quotes', {
            method: 'POST',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Accept: "application/json"
            },
            body: JSON.stringify({
                quote:quote, author:author
            })
        })
        .then(r => r.json())
        newQuoteForm.reset()
    }

// * Clicking the delete button should delete the respective quote from the
//   API and remove it from the page without having to refresh.


    document.querySelector("#quote-list").addEventListener('click', function(e){
        let blockQuote = e.target.parentElement
        let id = parseInt(blockQuote.id)
        if(e.target.className === "btn-danger"){
            fetch('http://localhost:3000/quotes/'+`${id}`, {
            method: 'DELETE'
            })
            blockQuote.parentElement.remove()
        } else if(e.target.className === "btn-success") {
            let date = Date.now()
            fetch('http://localhost:3000/likes/', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    quoteId:id, createdAt:date
                })
            })
            .then(r => r.json())
            .then()

            const likeSpan = document.getElementById(`like${id}`)
            fetch(`http://localhost:3000/likes/?quoteId=${id}`)
            .then(r => r.json())
            .then(likes => updateLikes(likes))

            function updateLikes(likes){
                likeSpan.textContent = likes.length
                console.log(likes)
            }
            
            //span.textContent = likes.length
            //number of likes is the total of like objects with same quoteId = span.id
            //fetch GET request, like objects, with attribute of quoteId
            //add up the number of quotes for that quoteId and render it on the like button
            //span.textContent = number of likes
        }
    })
})

    // * Clicking the like button will create a like for this particular quote in the
        //   API and update the number of likes displayed on the page without having to
        //   refresh.
        //   * Use a `POST` request to `http://localhost:3000/likes`
        //   * The body of the request should be a JSON object containing a key of
        //     `quoteId`, with an _integer_ value. Use the ID of the quote you're creating the like for — e.g. 
        //  `{ quoteId: 5 }` to create a like for quote 5. 
        //     * IMPORTANT: if the `quoteID` is a string for some reason (for example, 
        //  if you've pulled the ID from a dataset) the index page will not include the 
        //  like you create on _any_ quote.
        //   * Bonus (not required): add a `createdAt` key to your object to track when
        //     the like was created. Use [UNIX time][] (the number of seconds since
        //     January 1, 1970). The  [documentation][] for the JS `Date` class may be
        //     helpful here!

    




// ## Extend Your Learning

// * Add an edit button to each quote-card that will allow the editing of a quote. _(Hint: there is no 'correct' way to do this. You can try creating a hidden form that will only show up when hitting the edit button.)_
// * Currently, the number of likes of each post does not persist on the frontend after we refresh, as we set the beginning value to 0. Include an additional fetch to always have an updated number of likes for each post. You will send a GET request to `http://localhost:3000/likes?quoteId=` and interpolate the id of a given post.
// * Add a sort button that can be toggled on or off. When off the list of quotes will appear sorted by the ID. When the sort is active, it will display the quotes by author's name, alphabetically.
//   * One way of doing this is to sort the quotes in JS after you've retrieved them from the API. Try this way first.
//   * Another way of doing this is to make a fetch to `http://localhost:3000/quotes?_sort=author`
//   * What are the pros and cons in doing the sorting on the client vs. the server? Discuss with a partner.