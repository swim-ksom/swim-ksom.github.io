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

// Dynamically apply subject colors to Markdown-generated schedule tables
document.addEventListener('DOMContentLoaded', function() {
    const scheduleRows = document.querySelectorAll('.markdown-schedule tbody tr');
    
    // Helper function to color a specific cell and its inner bold/italic descendants
    let applyColorToCell = (td, bgClass, textClass) => {
        if (!td) return;
        td.classList.add(bgClass, textClass);
        // also color any bold/italic text inside the cell to match
        const children = td.querySelectorAll('strong, em, br');
        children.forEach(child => child.classList.add(textClass));
    };

    let determineColors = (text) => {
        if (text.includes("intro to univ math") || text.includes("introduction to university mathematics")) {
            return ['bg-amber-50', 'text-slate-800'];
        } else if (text.includes("linear algebra")) {
            return ['bg-emerald-50', 'text-slate-800'];
        } else if (text.includes("analysis")) {
            return ['bg-rose-50', 'text-slate-800'];
        } else if (text.includes("algebra")) {
            // 'algebra' shouldn't match 'linear algebra' but 'linear algebra' is checked first.
            return ['bg-indigo-50', 'text-slate-800'];
        }
        return null; // no color rule matched
    };

    scheduleRows.forEach(tr => {
        const tds = tr.querySelectorAll('td');
        if (tds.length >= 3) {
            // tds[0] is Date
            // tds[1] is Morning Session
            const mText = tds[1].textContent.toLowerCase();
            const mParams = determineColors(mText);
            if (mParams) {
                applyColorToCell(tds[1], mParams[0], mParams[1]);
            }

            // tds[2] is Afternoon Session
            const aText = tds[2].textContent.toLowerCase();
            const aParams = determineColors(aText);
            if (aParams) {
                applyColorToCell(tds[2], aParams[0], aParams[1]);
            }
        }
    });
});