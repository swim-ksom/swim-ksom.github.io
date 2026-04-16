module.exports = {
  eleventyComputed: {
    edition: data => {
      // 1. Check if explicitly set in frontmatter
      if (data.edition) return data.edition;
      // 2. Check if available via pagination (editionData)
      if (data.editionData) return data.editionData.year;
      // 3. Fallback: extract year from folder path (e.g., /2025/algebra.md)
      if (data.page && data.page.filePathStem) {
        const match = data.page.filePathStem.match(/^\/(\d{4})\//);
        if (match) return match[1];
      }
      return undefined;
    },
    // Consolidate edition-specific data from global editions.map or editionData
    currentEditionData: data => {
      if (data.editionData) return data.editionData;
      const year = data.edition;
      if (year && data.editions && data.editions.map) {
        return data.editions.map[year];
      }
      return undefined;
    },
    edInfo: data => data.currentEditionData ? data.currentEditionData.edInfo : data.edInfo,
    speakers: data => data.currentEditionData ? data.currentEditionData.speakers : data.speakers,
    schedules: data => data.currentEditionData ? data.currentEditionData.schedules : data.schedules,
    participants: data => data.currentEditionData ? data.currentEditionData.participants : data.participants,
    organizers: data => data.currentEditionData ? data.currentEditionData.organizers : data.organizers
  }
};
