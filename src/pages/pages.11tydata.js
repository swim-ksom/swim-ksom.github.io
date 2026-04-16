module.exports = {
  eleventyComputed: {
    edition: data => data.editionData ? data.editionData.year : undefined,
    edInfo: data => data.editionData ? data.editionData.edInfo : undefined,
    speakers: data => data.editionData ? data.editionData.speakers : undefined,
    schedules: data => data.editionData ? data.editionData.schedules : undefined,
    participants: data => data.editionData ? data.editionData.participants : undefined,
    organizers: data => data.editionData ? data.editionData.organizers : undefined
  }
};
