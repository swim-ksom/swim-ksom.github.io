const markdownIt = require("markdown-it");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  
  // Register YAML support for data files
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

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
  
  eleventyConfig.addPassthroughCopy("src/**/*.{pdf,jpg,png,jpeg,webp}");

  // Prevent 11ty from building individual pages for data markdown, but still watch them for changes
  eleventyConfig.ignores.add("src/**/data/*.md");
  eleventyConfig.addWatchTarget("src/**/*.md");
  eleventyConfig.addWatchTarget("src/**/*.yaml");

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
    if (!fs.existsSync(filePath)) return "";
    let content = fs.readFileSync(filePath, 'utf8');
    return markdownLib.render(content);
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
