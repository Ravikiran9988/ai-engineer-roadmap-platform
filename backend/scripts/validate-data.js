const fs = require('fs');
const path = require('path');

const read = file => fs.readFileSync(path.join(__dirname, '..', '..', file), 'utf8');
const topics = read('frontend/src/data/topics.js');
const assignments = read('frontend/src/data/assignments.js');
const videos = read('frontend/src/data/videos.js');
const docs = read('frontend/src/data/documentation.js');

const topicIds = new Set(
  [...topics.matchAll(/subtopicIds:\s*\[([^\]]*)\]/g)]
    .flatMap(m => [...m[1].matchAll(/'([^']+)'/g)].map(m => m[1]))
);

const topicMismatches = [];
for (const m of topics.matchAll(/\{\s*\n\s*id:\s*'([^']+)'[\s\S]*?subtopicIds:\s*\[([^\]]*)\],\s*\n\s*subtopics:\s*\[([^\]]*)\]/g)) {
  const ids = [...m[2].matchAll(/'([^']+)'/g)].map(x => x[1]);
  const names = [...m[3].matchAll(/'((?:\\'|[^'])*)'/g)].map(x => x[1]);
  if (ids.length !== names.length) topicMismatches.push(`${m[1]}: ${ids.length} ids / ${names.length} names`);
}

const videoIds = new Set([...videos.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]));
const docIds = new Set([...docs.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]));
const missing = [];

for (const m of assignments.matchAll(/\{\s*id:\s*'([^']+)'[\s\S]*?subtopicId:\s*'([^']+)'[\s\S]*?requiredVideoIds:\s*\[([^\]]*)\][\s\S]*?requiredDocIds:\s*\[([^\]]*)\]/g)) {
  const id = m[1];
  if (!topicIds.has(m[2])) missing.push(`${id}: missing subtopic ${m[2]}`);
  for (const v of [...m[3].matchAll(/'([^']+)'/g)].map(x => x[1])) if (!videoIds.has(v)) missing.push(`${id}: missing video ${v}`);
  for (const d of [...m[4].matchAll(/'([^']+)'/g)].map(x => x[1])) if (!docIds.has(d)) missing.push(`${id}: missing doc ${d}`);
}

if (topicMismatches.length || missing.length) {
  console.error('Data integrity check failed.');
  [...topicMismatches, ...missing].forEach(x => console.error(' -', x));
  process.exit(1);
}

console.log(`Data integrity OK: ${topicIds.size} unique subtopics, ${videoIds.size} videos, ${docIds.size} docs.`);
