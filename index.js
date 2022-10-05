#!/usr/bin/env node
import inquirer from 'inquirer';
import inquirerRawListPrompt from 'inquirer/lib/prompts/rawlist.js';
import SearchListPrompt from 'inquirer-search-list';
import PromptCommands from './utils/PromptCommands.js';
import GameState from './GameState.js';
import titleScreen from './components/titleScreen.js';
import welcome from './components/welcome.js';
import loadScene from './actions/loadScene.js';
import PressToContinuePrompt from "./utils/PressToContinuePrompt.js";

inquirer.registerPrompt('rawlist', PromptCommands.from(inquirerRawListPrompt));
inquirer.registerPrompt('continue', PromptCommands.from(PressToContinuePrompt));
inquirer.registerPrompt('search-list', SearchListPrompt);

/* setup game */
GameState.load();
if (!GameState.created) {
   GameState.create();
}

await titleScreen();

if (!GameState.player) await welcome();
else console.clear();

await loadScene(GameState.player.location);
