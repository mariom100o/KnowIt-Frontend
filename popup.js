document.getElementById('scrape-btn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['readability.js']
    });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: scrapeShadowAwareArticle
    }, (results) => {
        const content = results[0].result;

        console.log("Scraped content:", content);

        // if there is content, make a post request to the server
        if (content && content.length > 0) {
            fetch('http://localhost:4999/evaluate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            })
                .then(response => response.json())
                .then(data => {
                    // Set the text area with the scraped content
                    document.getElementById('output').value = JSON.stringify(data);
                })
                .catch((error) => {
                    console.log('Error:', error);
                    document.getElementById('output').value = "Error scraping the content." + error;
                });
        } else {
            // If no content was scraped, show an error message
            document.getElementById('output').value = "No content was scraped.";
        }
    });
});

function scrapeShadowAwareArticle() {
    // First try Readability
    const article = new Readability(document.cloneNode(true)).parse();
    if (article && article.textContent && article.textContent.trim().replace(/\r?\n/g, '').length > 200) {
        console.log("Readability succeeded");
        return article.textContent.trim();
    }

    // If readability fails, scrape Shadow DOM recursively
    function getAllParagraphs(node) {
        let paragraphs = [];
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches('p')) {
                paragraphs.push(node.innerText.trim());
            }
            // Handle shadow DOM
            if (node.shadowRoot) {
                paragraphs = paragraphs.concat(getAllParagraphs(node.shadowRoot));
            }
            // Traverse children
            node.childNodes.forEach(child => {
                paragraphs = paragraphs.concat(getAllParagraphs(child));
            });
        }
        return paragraphs;
    }

    const paragraphs = getAllParagraphs(document)
        .filter(text => text.length > 50);

    if (paragraphs.length > 0) {
        return paragraphs.join('\n\n');
    }

    // The 
    return "This website was not able to be scraped."
}