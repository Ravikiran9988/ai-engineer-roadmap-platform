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
const videoMeta = new Map(
  [...videos.matchAll(/\{\s*id:\s*'([^']+)'[\s\S]*?topicId:\s*'([^']+)'[\s\S]*?subtopicId:\s*'([^']+)'[\s\S]*?\}/g)]
    .map(m => [m[1], { topicId: m[2], subtopicId: m[3] }])
);
const docMeta = new Map(
  [...docs.matchAll(/\{\s*id:\s*'([^']+)'[\s\S]*?topicId:\s*'([^']+)'(?:[\s\S]*?subtopicId:\s*'([^']+)')?[\s\S]*?\}/g)]
    .map(m => [m[1], { topicId: m[2], subtopicId: m[3] || null }])
);
const missing = [];

for (const m of assignments.matchAll(/\{\s*id:\s*'([^']+)'[\s\S]*?subtopicId:\s*'([^']+)'[\s\S]*?requiredVideoIds:\s*\[([^\]]*)\][\s\S]*?requiredDocIds:\s*\[([^\]]*)\]/g)) {
  const id = m[1];
  if (!topicIds.has(m[2])) missing.push(`${id}: missing subtopic ${m[2]}`);
  for (const v of [...m[3].matchAll(/'([^']+)'/g)].map(x => x[1])) {
    if (!videoIds.has(v)) missing.push(`${id}: missing video ${v}`);
    else if (videoMeta.get(v) && videoMeta.get(v).subtopicId !== m[2]) missing.push(`${id}: video ${v} belongs to ${videoMeta.get(v).subtopicId}, not ${m[2]}`);
  }
  for (const d of [...m[4].matchAll(/'([^']+)'/g)].map(x => x[1])) {
    if (!docIds.has(d)) missing.push(`${id}: missing doc ${d}`);
    else if (docMeta.get(d)?.topicId && docMeta.get(d).topicId !== (m[2])) {
      // Assignments currently attach to a subtopic; topic-level validation is performed below when available.
      const assignmentBlock = m[0];
      const topicMatch = assignmentBlock.match(/topicId:\s*'([^']+)'/);
      if (topicMatch && docMeta.get(d).topicId !== topicMatch[1]) missing.push(`${id}: doc ${d} belongs to ${docMeta.get(d).topicId}, not ${topicMatch[1]}`);
    }
  }
}

const duplicateSubtopics = [...topicIds].length !== [...topics.matchAll(/subtopicIds:\s*\[([^\]]*)\]/g)].flatMap(m => [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1])).length;
if (duplicateSubtopics) missing.push('duplicate subtopic IDs detected');

if (topicMismatches.length || missing.length) {
  console.error('Data integrity check failed.');
  [...topicMismatches, ...missing].forEach(x => console.error(' -', x));
  process.exit(1);
}

console.log(`Data integrity OK: ${topicIds.size} unique subtopics, ${videoIds.size} videos, ${docIds.size} docs.`);
