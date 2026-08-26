import assert from 'node:assert/strict';
import { briefText, commerceBriefLines, contactUrl, firstGap, projectSignal } from './app.js';

assert.equal(projectSignal([]).band, 'discovery');
assert.equal(projectSignal(['outcome', 'journey', 'content']).band, 'definition');
assert.equal(projectSignal(['outcome', 'journey', 'content', 'editing', 'integrations', 'quality']).band, 'handoff');
assert.match(firstGap(['outcome']), /priority audience/i);
assert.match(contactUrl('automation', ['outcome']), /utm_content=automation_discovery/);
assert.match(briefText('commerce', ['outcome']), /Project type: commerce/);
assert.match(briefText('commerce', ['outcome'], { catalog: '26–100 products', fulfillment: 'Multiple zones' }), /Catalog scale: 26–100 products/);
assert.match(briefText('commerce', ['outcome'], { catalog: '26–100 products', fulfillment: 'Multiple zones' }), /Fulfillment: Multiple zones/);
assert.doesNotMatch(briefText('company', ['outcome'], { catalog: '26–100 products' }), /Commerce boundaries/);
assert.equal(commerceBriefLines({ payments: 'One standard payment gateway' }).length, 6);
assert.match(briefText('automation', ['outcome', 'journey']), /This is a scope signal, not a price estimate or contract/);
console.log('website-project-brief-builder tests passed');
