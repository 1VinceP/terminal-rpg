#!/usr/bin/env node
import GameState from './GameState.js';
import titleScreen from './components/titleScreen.js';
import welcome from './components/welcome.js';

/* setup game */
GameState.load();
if (!GameState.created) {
   GameState.create();
}

await titleScreen();

if (!GameState.player) await welcome();

await loadScene();
