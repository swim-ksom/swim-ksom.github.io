const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

module.exports = function() {
  const srcDir = path.join(__dirname, '..');
  const editionsList = [];
  
  // Find all year folders (4 digits)
  const folders = fs.readdirSync(srcDir).filter(file => /^\d{4}$/.test(file));
  
  folders.forEach(folder => {
    const dataPath = path.join(srcDir, folder, 'data', 'data.yaml');
    if (fs.existsSync(dataPath)) {
      try {
        const data = yaml.load(fs.readFileSync(dataPath, 'utf8'));
        // Basic folder-based attributes if missing
        editionsList.push({
          ...data,
          year: data.year || folder,
          url: data.url || `/${folder}/`
        });
      } catch (e) {
        console.error(`Error parsing ${dataPath}:`, e);
      }
    }
  });

  // Sort by year descending
  editionsList.sort((a, b) => b.year - a.year);

  // Load site config to find upcoming edition
  let upcoming = null;
  const siteConfigPath = path.join(__dirname, 'site.yaml');
  if (fs.existsSync(siteConfigPath)) {
    const siteConfig = yaml.load(fs.readFileSync(siteConfigPath, 'utf8'));
    if (siteConfig.current_edition) {
      upcoming = editionsList.find(e => e.year === siteConfig.current_edition);
    }
  }

  return {
    list: editionsList,
    upcoming: upcoming
  };
};
