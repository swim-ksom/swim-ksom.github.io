// Determine the base URL dynamically based on where script.js is loaded from
const currentScript = document.currentScript;
let baseUrl = '/';
if (currentScript && currentScript.src) {
    baseUrl = new URL('.', currentScript.src).href;
}

// Fetch and insert header
fetch(baseUrl + 'header.html')
    .then(response => response.text())
    .then(data => {
        const headerEl = document.getElementById('header');
        if (headerEl) headerEl.innerHTML = data;
    });

// Fetch and insert footer
fetch(baseUrl + 'footer.html')
    .then(response => response.text())
    .then(data => {
        const footerEl = document.getElementById('footer');
        if (footerEl) footerEl.innerHTML = data;
    });


// Update the last updated timestamp
document.addEventListener('DOMContentLoaded', function() {
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        const now = new Date();
        // Options for formatting the date and time without timezone
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const formattedDate = now.toLocaleDateString('en-US', options);
        lastUpdatedElement.textContent = `Last updated on: ${formattedDate}`;
    }
});

// using mathjax for rendering equations
MathJax = {
            tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']],
                processEscapes: true,
                packages: ['base', 'ams']
            },
            options: {
                ignoreHtmlClass: 'tex2jax_ignore',
                processHtmlClass: 'tex2jax_process'
            },
            loader: {
                load: ['[tex]/ams']
            }
        };