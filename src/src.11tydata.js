module.exports = {
  eleventyComputed: {
    edition: data => {
      if (data.edition) return data.edition;
      if (data.page && data.page.filePathStem) {
        const match = data.page.filePathStem.match(/^\/(\d{4})\//);
        if (match) return match[1];
      }
      return undefined;
    },
    // Populate edition-specific data from the global editions object
    currentEditionData: data => {
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
