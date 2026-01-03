import { getGraph } from './lib.mjs';

const graph = getGraph();

document.getElementById('playbutton')?.addEventListener('click', graph.play);
document.getElementById('stopbutton')?.addEventListener('click', graph.stop);
