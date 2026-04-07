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
