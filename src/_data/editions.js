const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

module.exports = function() {
  const srcDir = path.join(__dirname, '..');
  const editionsList = [];
  
  // Find all year folders (4 digits)
  const folders = fs.readdirSync(srcDir).filter(file => /^\d{4}$/.test(file));
  
  folders.forEach(folder => {
    const dataDir = path.join(srcDir, folder, 'data');
    const dataPath = path.join(dataDir, 'data.yaml');
    const speakersPath = path.join(dataDir, 'speakers.yaml');
    const schedulePath = path.join(dataDir, 'schedule.yaml');
    const participantsPath = path.join(dataDir, 'participants.yaml');
    
    let edData = {};
    if (fs.existsSync(dataPath)) {
      try {
        edData = yaml.load(fs.readFileSync(dataPath, 'utf8')) || {};
      } catch (e) { console.error(`Error parsing ${dataPath}:`, e); }
    }
    
    let speakers = [], schedules = [], participants = {};
    if (fs.existsSync(speakersPath)) {
        try { speakers = yaml.load(fs.readFileSync(speakersPath, 'utf8')) || []; } catch(e) {}
    }
    if (fs.existsSync(schedulePath)) {
        try { schedules = yaml.load(fs.readFileSync(schedulePath, 'utf8')) || []; } catch(e) {}
    }
    if (fs.existsSync(participantsPath)) {
        try { participants = yaml.load(fs.readFileSync(participantsPath, 'utf8')) || {}; } catch(e) {}
    }

    editionsList.push({
      ...edData,
      edInfo: edData,
      year: String(edData.year || folder),
      url: edData.url || `/${folder}/`,
      speakers,
      schedules,
      participants
    });
  });

  // Sort by year descending
  editionsList.sort((a, b) => Number(b.year) - Number(a.year));

  // Load site config to find upcoming edition
  let upcoming = null;
  const siteConfigPath = path.join(__dirname, 'site.yaml');
  if (fs.existsSync(siteConfigPath)) {
    const siteConfig = yaml.load(fs.readFileSync(siteConfigPath, 'utf8'));
    if (siteConfig.current_edition) {
      const currentYear = String(siteConfig.current_edition);
      upcoming = editionsList.find(e => String(e.year) === currentYear);
    }
  }

  const editionsMap = {};
  editionsList.forEach(ed => {
    editionsMap[ed.year] = ed;
  });

  return {
    list: editionsList,
    map: editionsMap,
    upcoming: upcoming
  };
};
