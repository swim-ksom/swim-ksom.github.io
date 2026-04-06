// Base URL logic no longer required for static HTML header/footer fetching


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