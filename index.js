const {
  parseOniSave,
  writeOniSave,
  getBehavior,
  AIAttributeLevelsBehavior,
  parseSaveGame,
  MinionIdentityBehavior,
  AI_TRAIT_IDS,
  AITraitsBehavior
} = require("oni-save-parser");

const { readFileSync } = require("fs");

function loadFile(fileName) {
  const fileData = readFileSync(`./test-data/${fileName}.sav`);
  return parseSaveGame(fileData.buffer);
}

function saveFile(fileName, save) {
  const fileData = writeSaveGame(save);
  writeFileSync(`./test-data/${fileName}.sav`, new Uint8Array(fileData));
}

const fileName = "Abode";
const saveData = loadFile(fileName);
const gameObjects = saveData.gameObjects;
// Duplicant
const minions = saveData.gameObjects.find(x => x.name === "Minion");

const CANDIDATE_TRAITS = AI_TRAIT_IDS.filter(x => x !== "None");

const minionsGameObjects = minions.gameObjects;
for (const minion of minionsGameObjects) {
  const name = getMinionIdentifier(minion);
  console.log(name);
}
function getMinionIdentifier(minion) {
  const minionIdentifier = getBehavior(minion, MinionIdentityBehavior);
  const templateData = minionIdentifier.templateData;
  const name = templateData.name;
  return name;
}
