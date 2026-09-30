import { TOPICS } from './src/data/topics.js';
import { VIDEOS } from './src/data/videos.js';

const videoSubtopics = new Set(VIDEOS.map(v => v.subtopicId));
let missing = [];

TOPICS.forEach(topic => {
  topic.subtopicIds.forEach((subId, idx) => {
    if (!videoSubtopics.has(subId)) {
      missing.push({
        topic: topic.id,
        subtopicId: subId,
        subtopicName: topic.subtopics[idx]
      });
    }
  });
});

console.log(`Missing subtopics count: ${missing.length}`);
console.log(JSON.stringify(missing, null, 2));
