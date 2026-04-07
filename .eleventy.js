const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  // Let eleventy know what formats we expect
  eleventyConfig.setTemplateFormats([
    "md",
    "njk",
    "html"
  ]);

  // Passthrough copy for CSS, JS, and global config files
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/script.js");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy("src/.nojekyll");
  
  eleventyConfig.addPassthroughCopy("src/**/*.pdf");
  eleventyConfig.addPassthroughCopy("src/**/*.jpg");
  eleventyConfig.addPassthroughCopy("src/**/*.png");
  eleventyConfig.addPassthroughCopy("src/**/*.jpeg");

  // Prevent 11ty from building individual pages for data markdown, but still watch them for changes
  eleventyConfig.ignores.add("src/**/*.md");
  eleventyConfig.addWatchTarget("src/**/*.md");

  // Setup markdown-it to allow classes, etc. 
  let mdOptions = {
    html: true,
    breaks: true,
    linkify: true
  };
  let markdownLib = markdownIt(mdOptions);
  eleventyConfig.setLibrary("md", markdownLib);
  
  // Custom filter to render markdown inside njk tags
  eleventyConfig.addFilter("markdown", (content) => {
    return markdownLib.render(content);
  });

  const fs = require("fs");
  eleventyConfig.addShortcode("renderMarkdown", function(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    let rendered = markdownLib.render(content);

    // Identify rows starting with 'Week' in schedule.md and merge columns
    if (filePath.includes("schedule.md")) {
      rendered = rendered.replace(
        /<tr[^>]*>\s*<td[^>]*>Week\s+([^<]+)<\/td>\s*<td[^>]*>\s*<\/td>\s*<td[^>]*>\s*<\/td>\s*<\/tr>/gi,
        '<tr class="schedule-week-row"><td colspan="3">Week $1</td></tr>'
      );
    }

    // Process speakers.md to merge adjacent identical cells in the first column
    if (filePath.includes("speakers.md")) {
      const tableMatch = rendered.match(/<tbody[^>]*>([\s\S]*)<\/tbody>/i);
      if (tableMatch) {
        let tbody = tableMatch[1];
        const rows = tbody.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
        
        let processedRows = [];
        let currentVal = null;
        let lastUniqueRowIdx = -1;
        let rowSpanCount = 0;

        for (let i = 0; i < rows.length; i++) {
          let row = rows[i];
          const tdMatch = row.match(/<td[^>]*>(.*?)<\/td>/i);
          
          if (tdMatch) {
            const val = tdMatch[1].trim();

            if (val === currentVal && lastUniqueRowIdx !== -1) {
              rowSpanCount++;
              // Remove the duplicate first cell
              row = row.replace(/<td[^>]*>.*?<\/td>/i, '');
              // Update the last unique cell's rowspan
              processedRows[lastUniqueRowIdx] = processedRows[lastUniqueRowIdx].replace(
                /<td([^>]*)>/i,
                (match, p1) => {
                  let attributes = p1.trim();
                  if (attributes.includes('rowspan')) {
                    return `<td ${attributes.replace(/rowspan="\d+"/, `rowspan="${rowSpanCount}"`)}>`;
                  }
                  return `<td ${attributes} rowspan="${rowSpanCount}">`;
                }
              );
            } else {
              currentVal = val;
              rowSpanCount = 1;
              lastUniqueRowIdx = processedRows.length;
              // Add a divider class to the first row of each week (except the very first)
              if (i > 0) {
                row = row.replace(/<tr([^>]*)>/i, '<tr class="week-divider" $1>');
              }
            }
          }
          processedRows.push(row);
        }
        rendered = rendered.replace(tbody, processedRows.join('\n'));
      }
    }

    return rendered;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    passthroughFileCopy: true,
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
