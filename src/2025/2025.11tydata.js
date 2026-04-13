const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");

module.exports = function() {
  const speakersPath = path.join(__dirname, "data/speakers.yaml");
  const schedulesPath = path.join(__dirname, "data/schedule.yaml");
  const participantsPath = path.join(__dirname, "data/participants.yaml");

  const speakers = yaml.load(fs.readFileSync(speakersPath, "utf8"));
  const schedules = yaml.load(fs.readFileSync(schedulesPath, "utf8"));
  const participants = yaml.load(fs.readFileSync(participantsPath, "utf8"));

  return {
    speakers: speakers,
    schedules: schedules,
    participants: participants
  };
};
