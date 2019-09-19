const {
  parseOniSave,
  writeOniSave,
  getBehavior,
  AIAttributeLevelsBehavior,
  parseSaveGame,
  MinionIdentityBehavior,
  AI_TRAIT_IDS,
  AITraitsBehavior,
  writeSaveGame,
  MinionSkillGroupNames,
  MinionResumeBehavior
} = require("oni-save-parser");

const { readFileSync, writeFileSync } = require("fs");

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
let topTraits = {}
let topApitudeBy = {}
const minionsGameObjects = minions.gameObjects;
for (const minion of minionsGameObjects) {
  const name = getMinionIdentifier(minion);
  const minionResume = getBehavior(minion, MinionResumeBehavior)
  const {AptitudeBySkillGroup} = minionResume.templateData
  if (name === 'Marie') {
    topApitudeBy = AptitudeBySkillGroup
  } else {
    minionResume.templateData.AptitudeBySkillGroup = topApitudeBy
  }
  setAttrLvl(minion);
  cloneTraits(minion, name);
}
saveFile(`${fileName}-001`, saveData)

function setAttrLvl(minion) {
  const skillBehavior = getBehavior(minion, AIAttributeLevelsBehavior);
  // Set each attribute to 100
  for (const attribute of skillBehavior.templateData.saveLoadLevels) {
    attribute.level = 100;
  }
}

function cloneTraits(minion, name) {
  const traits = getBehavior(minion, AITraitsBehavior);
  const { TraitIds } = traits.templateData;
  if (name === 'Marie') {
    topTraits = TraitIds;
  }
  else {
    traits.templateData.TraitIds = topTraits;
  }
}

function getMinionIdentifier(minion) {
  const minionIdentifier = getBehavior(minion, MinionIdentityBehavior);
  const templateData = minionIdentifier.templateData;
  const name = templateData.name;
  return name;
}
