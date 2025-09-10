// frontend/src/admin/pages/posts/post-create.js

function postCreate() {
    return {
        render: renderForm,
        init: init,
    }
}

function renderForm() {
    return /* html */ `
    <form id="postCreate">
        <h2>Post Create</h2>
        <input type="text" name="title"><br>
        <textarea name="description"></textarea><br>
        <button type="submit">Create</button>
    </form>
    `;
}

function init() {
    const form = document.getElementById('postCreate');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        requestServer(form)
    })
}

async function requestServer(form) {
    try {
        const response = await fetch('/api-admin/');

        // Check if the response is successful
        if (!response.ok) {
            // Log the status and status text to get more info
            console.error('Server responded with an error:', response.status, response.statusText);
            
            // Get the text of the response to see the HTML content
            const errorText = await response.text();
            console.error('Response content:', errorText);
            
            // Rethrow or handle the error appropriately
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check the Content-Type header to confirm it's JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const errorText = await response.text();
            console.error('Expected JSON, but received:', contentType);
            console.error('Response content:', errorText);
            throw new TypeError("Did not receive JSON from the server.");
        }

        const result = await response.json();
        console.log(result);

    } catch (error) {
        console.error('Fetch operation failed:', error);
    }
}

export {postCreate}