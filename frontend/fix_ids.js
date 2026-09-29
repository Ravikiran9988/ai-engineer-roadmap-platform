import fs from 'fs';
import path from 'path';

const replaceInFile = (filePath, replacements) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  for (const [bad, good] of Object.entries(replacements)) {
    content = content.split(bad).join(good);
  }
  fs.writeFileSync(filePath, content);
};

const fixMappings = {
  "'vec-concepts'": "'vdb-concepts'",
  "'vec-chroma'": "'vdb-chroma'",
  "'agt-concepts'": "'ag-architecture'",
  "'agt-langchain'": "'lc-agents'",
  "'agt-langgraph'": "'lg-basics'",
  "'agt-advanced-langgraph'": "'lg-multi-agent'",
  "'eval-metrics-llm'": "'eval-llm-metrics'",
  "'eval-ragas'": "'ragas-basics'",
  "'api-fastapi'": "'fapi-basics'",
  "'api-ai-models'": "'fapi-ai'",
  "'dep-docker'": "'docker-basics'"
};

const dataDir = './src/data';
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  replaceInFile(filePath, fixMappings);
});

console.log('Fixed IDs Phase 2');
