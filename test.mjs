import assert from 'node:assert/strict';
import { briefText, contactUrl, firstGap, projectSignal } from './app.js';

assert.equal(projectSignal([]).band, 'discovery');
assert.equal(projectSignal(['outcome', 'journey', 'content']).band, 'definition');
assert.equal(projectSignal(['outcome', 'journey', 'content', 'editing', 'integrations', 'quality']).band, 'handoff');
assert.match(firstGap(['outcome']), /priority audience/i);
assert.match(contactUrl('automation', ['outcome']), /utm_content=automation_discovery/);
assert.match(briefText('commerce', ['outcome']), /Project type: commerce/);
assert.match(briefText('automation', ['outcome', 'journey']), /This is a scope signal, not a price estimate or contract/);
console.log('website-project-brief-builder tests passed');
