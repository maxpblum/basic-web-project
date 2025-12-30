import {getGreeting} from './lib.mjs';

const greeting = document.createElement('div');
greeting.innerText = getGreeting('Max');
document.body.appendChild(greeting);
