// Execute on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Theme toggle setup
    const themeToggle = document.getElementById('theme-toggle');
    const logo = document.getElementById('logo');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        logo.src = document.body.classList.contains('dark-mode')
            ? 'Assets/KnowItDark.png'
            : 'Assets/KnowItLight.png';
    });
    // Set initial logo based on current theme
    logo.src = document.body.classList.contains('dark-mode')
        ? 'Assets/KnowItDark.png'
        : 'Assets/KnowItLight.png';
    // Close popup button
    const closeBtn = document.getElementById('close-btn');
    closeBtn.addEventListener('click', () => window.close());

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['readability.js']
    });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: scrapeShadowAwareArticle
    }, (results) => {
        // Hide phishing UI by default
        document.getElementById('phishing-check').style.display = 'none';
        document.getElementById('phishing-result').style.display = 'none';
        const content = results[0].result;
        // Start the loader
        // if there is content, make a post request to the server
        if (content && content.length > 0) {

            if (tab.url.includes("mail.google.com")) {
                document.getElementById('phishing-check').style.display = 'flex';

                document.getElementById('phishing-check').addEventListener('click', () => {
                    // Start the loader
                    document.getElementById('loader').style.display = 'flex';
                    document.getElementById('loaded-content').style.display = 'none';
                    const controller = new AbortController();
                    const timeoutDuration = 10000; // 10 seconds
                    const timeoutId = setTimeout(() => {
                        controller.abort();
                        // Set the loader to hidden
                        document.getElementById('loader').style.display = 'none';
                        // Show timeout message
                        document.getElementById('loaded-content').style.display = 'block';
                        document.getElementById('phishing-result').style.display = 'block';
                        document.getElementById('output').value = "Request timed out. Please try again.";
                    }, timeoutDuration);

                    fetch('http://localhost:4999/phishing', {
                        signal: controller.signal,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ content })
                    })
                        .then(response => response.json())
                        .then(data => {
                            // Clear timeout
                            clearTimeout(timeoutId);
                            // Set the loader to hidden
                            document.getElementById('loader').style.display = 'none';

                            // Populate data
                            document.getElementById('phishingScoreText').innerText = data.phishingsense
                            document.getElementById('phishingExplanationText').innerText = data.explanation
                            // Enable the loaded content
                            document.getElementById('loaded-content').style.display = 'block';
                            document.getElementById('phishing-result').style.display = 'flex';
                            document.getElementById('phishing-check').style.display = 'none';
                        })
                })
            } else {
                document.getElementById('loader').style.display = 'flex';

                const controller = new AbortController();
                const timeoutDuration = 10000; // 10 seconds
                const timeoutId = setTimeout(() => {
                    controller.abort();
                    // Set the loader to hidden
                    document.getElementById('loader').style.display = 'none';
                    // Show timeout message
                    document.getElementById('loaded-content').style.display = 'block';
                    document.getElementById('article-result').style.display = 'block';
                    document.getElementById('output').value = "Request timed out. Please try again.";
                }, timeoutDuration);


                fetch('http://localhost:4999/evaluate', {
                    signal: controller.signal,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content })
                })
                    .then(response => response.json())
                    .then(data => {
                        // Clear timeout
                        clearTimeout(timeoutId);
                        // Set the text area with the scraped content
                        document.getElementById('output').value = JSON.stringify(data);


                        // Set the loader to hidden
                        document.getElementById('loader').style.display = 'none';
                        // Enable the loaded content
                        document.getElementById('loaded-content').style.display = 'block';
                        document.getElementById('article-result').style.display = 'block';
                    })
                    .catch((error) => {
                        // Clear timeout
                        console.log('Error:', error);
                        document.getElementById('output').value = "Error scraping the content." + error;
                    });
            }
        } else {
            // If no content was scraped, show an error message
            document.getElementById('output').value = "No content was scraped.";
        }
    });
})

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