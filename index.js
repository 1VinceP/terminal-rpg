#!/usr/bin/env node
import GameState from './GameState.js';
import titleScreen from './components/titleScreen.js';
import welcome from './components/welcome.js';
import loadScene from './actions/loadScene.js';

/* setup game */
GameState.load();
if (!GameState.created) {
   GameState.create();
}

await titleScreen();

if (!GameState.player) await welcome();
else console.clear();

await loadScene(GameState.player.location);
