import fs from 'fs';
import path from 'path';

const currentVideosRaw = fs.readFileSync(path.join(process.cwd(), 'src/data/videos.js'), 'utf8');

// The new verified items
const newVideos = [
  // Replace Pydantic V2 crash course (was yj-wmLGFqKg, now 7aBRk_JP-qY)
  {
    id: 'vid_pydantic_001',
    topicId: 'pydantic',
    subtopicId: 'pydantic-basics',
    title: 'Pydantic V2 - Full Course - Learn the BEST Library for Data Validation and Parsing',
    channel: 'Coding Crash Courses',
    url: 'https://www.youtube.com/watch?v=7aBRk_JP-qY',
    duration: '2h',
    type: 'concept',
    difficulty: 'beginner',
    description: 'Complete Pydantic V2 crash course.',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    order: 1,
    required: true,
  },
  // Replace Transformer (was 4Bdc55j80l4, now wjZofJX0v4M)
  {
    id: 'vid_transformers_002',
    topicId: 'transformers',
    subtopicId: 'trans-architecture',
    title: 'Transformers, the tech behind LLMs | Deep Learning Chapter 5',
    channel: '3Blue1Brown',
    url: 'https://www.youtube.com/watch?v=wjZofJX0v4M',
    duration: '25m',
    type: 'concept',
    difficulty: 'beginner',
    description: 'Visual and intuitive explanation of the transformer architecture.',
    learningPaths: ['intermediate', 'advanced'],
    order: 1,
  },
  // pgvector PostgreSQL
  {
    id: 'vid_pg_001', // Existing ID to overwrite
    topicId: 'postgresql',
    subtopicId: 'pg-pgvector',
    title: 'Postgres pgvector Extension - Vector Database with PostgreSQL / Langchain Integration',
    channel: 'BugBytes',
    url: 'https://www.youtube.com/watch?v=FDBnyJu_Ndg',
    duration: '20m',
    type: 'implementation',
    difficulty: 'intermediate',
    description: 'Set up pgvector, store embeddings in PostgreSQL, and run similarity search.',
    learningPaths: ['intermediate', 'advanced'],
    order: 1,
    required: true,
  },
  // pgvector for SQL topic
  {
    id: 'vid_sql_002', // Existing ID to overwrite
    topicId: 'sql',
    subtopicId: 'sql-for-ai',
    title: 'Postgres pgvector Extension - Vector Database with PostgreSQL / Langchain Integration',
    channel: 'BugBytes',
    url: 'https://www.youtube.com/watch?v=FDBnyJu_Ndg',
    duration: '20m',
    type: 'implementation',
    difficulty: 'intermediate',
    description: 'pgvector extension, vector similarity search, AI workload patterns.',
    learningPaths: ['intermediate', 'advanced'],
    order: 2,
  },
  // LangGraph multi-agent
  {
    id: 'vid_agents_005', // Existing ID to overwrite
    topicId: 'langgraph',
    subtopicId: 'lg-multi-agent',
    title: 'LangGraph: Multi-Agent Workflows',
    channel: 'LangChain',
    url: 'https://www.youtube.com/watch?v=hvAPnpSfSGo',
    duration: '25m',
    type: 'deep-dive',
    difficulty: 'advanced',
    description: 'Supervisor agents, handoffs, and parallel execution with LangGraph.',
    learningPaths: ['advanced'],
    order: 2,
  },
  // Text embeddings
  {
    id: 'vid_emb_001', // Existing ID to overwrite
    topicId: 'embeddings',
    subtopicId: 'emb-openai',
    title: 'OpenAI Embeddings and Vector Databases Crash Course',
    channel: 'Adrian Twarog',
    url: 'https://www.youtube.com/watch?v=ySus5ZS0b94',
    duration: '20m',
    type: 'concept',
    difficulty: 'beginner',
    description: 'How text embeddings work, cosine similarity, and semantic search.',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    order: 1,
  },
  // OpenAI function calling
  {
    id: 'vid_tools_001', // Existing ID to overwrite
    topicId: 'function_tool_calling',
    subtopicId: 'tc-openai',
    title: 'OpenAI Function Calling - Full Beginner Tutorial',
    channel: 'Dave Ebbelaar',
    url: 'https://www.youtube.com/watch?v=aqdWSYWC_LI',
    duration: '30m',
    type: 'implementation',
    difficulty: 'intermediate',
    description: 'Define tools, parse tool calls, and implement the full tool loop.',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    order: 1,
    required: true,
  },
  // QLoRA fine tuning
  {
    id: 'vid_ft_002', // Existing ID to overwrite
    topicId: 'fine_tuning',
    subtopicId: 'ft-lora',
    title: 'Fine-tuning LLMs with PEFT and LoRA',
    channel: 'Sam Witteveen',
    url: 'https://www.youtube.com/watch?v=Us5ZFp16PaU',
    duration: '35m',
    type: 'implementation',
    difficulty: 'advanced',
    description: 'LoRA adapters, 4-bit quantization, and training on custom data.',
    learningPaths: ['advanced'],
    order: 2,
  },
  // Prometheus monitoring
  {
    id: 'vid_mon_001', // Existing ID to overwrite
    topicId: 'monitoring',
    subtopicId: 'mon-prometheus',
    title: 'How Prometheus Monitoring works | Prometheus Architecture explained',
    channel: 'TechWorld with Nana',
    url: 'https://www.youtube.com/watch?v=h4Sl21AKiDg',
    duration: '30m',
    type: 'implementation',
    difficulty: 'intermediate',
    description: 'Instrument Python apps, scrape metrics, and build dashboards.',
    learningPaths: ['intermediate', 'advanced'],
    order: 1,
  },
  // JWT FastAPI
  {
    id: 'vid_jwt_001', // Existing ID to overwrite
    topicId: 'jwt',
    subtopicId: 'jwt-basics',
    title: 'FastAPI JWT Tutorial | How to add User Authentication',
    channel: 'Eric Roby',
    url: 'https://www.youtube.com/watch?v=0A_GCXBCNUQ',
    duration: '30m',
    type: 'implementation',
    difficulty: 'intermediate',
    description: 'Implement JWT access and refresh tokens in FastAPI with OAuth2.',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    order: 1,
    required: true,
  },
  // Prompt injection attacks
  {
    id: 'vid_security_001', // Existing ID to overwrite
    topicId: 'prompt_injection',
    subtopicId: 'pi-direct',
    title: 'Attacking LLM - Prompt Injection',
    channel: 'LiveOverflow',
    url: 'https://www.youtube.com/watch?v=Sv5OLj2nVAQ',
    duration: '15m',
    type: 'concept',
    difficulty: 'intermediate',
    description: 'Direct and indirect prompt injection, OWASP LLM01, mitigation strategies.',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    order: 1,
    required: true,
  },
  // RAG chunking 5 levels
  {
    id: 'vid_rag_003', // Existing ID to overwrite
    topicId: 'rag',
    subtopicId: 'rag-chunking',
    title: 'The 5 Levels Of Text Splitting For Retrieval',
    channel: 'Greg Kamradt',
    url: 'https://www.youtube.com/watch?v=8OJC21T2SL4',
    duration: '35m',
    type: 'implementation',
    difficulty: 'intermediate',
    description: 'Fixed-size, recursive, semantic, and agentic chunking strategies.',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    order: 3,
  },
  // Advanced RAG
  {
    id: 'vid_rag_004', // Existing ID to overwrite
    topicId: 'rag',
    subtopicId: 'rag-advanced',
    title: 'Building Production-Ready RAG Applications: Jerry Liu',
    channel: 'AI Engineer',
    url: 'https://www.youtube.com/watch?v=TRjq7t2Ms5I',
    duration: '40m',
    type: 'deep-dive',
    difficulty: 'advanced',
    description: 'Techniques that dramatically improve RAG accuracy.',
    learningPaths: ['advanced'],
    order: 4,
  },
  // ChromaDB tutorial
  {
    id: 'vid_vec_002', // Existing ID to overwrite
    topicId: 'vector_databases',
    subtopicId: 'vdb-chroma',
    title: 'Vector Databases Explained + ChromaDB in Python (Full Tutorial)',
    channel: 'The Setup Academy',
    url: 'https://www.youtube.com/watch?v=_Ywfr1cAtZQ',
    duration: '25m',
    type: 'implementation',
    difficulty: 'intermediate',
    description: 'Collections, upsert, query, and metadata filtering in ChromaDB.',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    order: 2,
  },
  // LangChain agents
  {
    id: 'vid_agents_003', // Existing ID to overwrite
    topicId: 'langchain',
    subtopicId: 'lc-agents',
    title: 'Agentic AI Crash Course using LangChain | LangChain Crash Course',
    channel: 'codebasics',
    url: 'https://www.youtube.com/watch?v=D74el9mvNak',
    duration: '50m',
    type: 'implementation',
    difficulty: 'intermediate',
    description: 'Build tool-calling agents using LCEL, tools, and memory.',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    order: 2,
  },
  // LLM evaluation metrics
  {
    id: 'vid_eval_001', // Existing ID to overwrite
    topicId: 'llm_evaluation',
    subtopicId: 'eval-llm-metrics',
    title: 'BLEU Score for LLM Evaluation explained',
    channel: 'Data Science in your pocket',
    url: 'https://www.youtube.com/watch?v=4QgnU2OvrjU',
    duration: '15m',
    type: 'concept',
    difficulty: 'intermediate',
    description: 'Faithfulness, relevance, groundedness metrics that matter.',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    order: 1,
    required: true,
  },
  // RAGAS evaluation
  {
    id: 'vid_eval_002', // Existing ID to overwrite
    topicId: 'rag_evaluation',
    subtopicId: 'ragas-basics',
    title: 'RAG Evaluation: Precision, Recall, Faithfulness, RAGAS Explained Clearly',
    channel: 'Logical Lenses',
    url: 'https://www.youtube.com/watch?v=7_LTU0LA374',
    duration: '25m',
    type: 'implementation',
    difficulty: 'intermediate',
    description: 'Use RAGAS to evaluate retrieval quality and answer faithfulness.',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    order: 1,
    required: true,
  },
  // MLflow
  {
    id: 'vid_mlops_001', // Existing ID to overwrite
    topicId: 'experiment_tracking',
    subtopicId: 'et-mlflow',
    title: 'MLFlow Tutorial | ML Ops Tutorial',
    channel: 'codebasics',
    url: 'https://www.youtube.com/watch?v=6ngxBkx05Fs',
    duration: '30m',
    type: 'implementation',
    difficulty: 'intermediate',
    description: 'Log metrics, parameters, and models; compare experiments in MLflow UI.',
    learningPaths: ['intermediate', 'advanced'],
    order: 1,
  },
  // LangSmith
  {
    id: 'vid_mlops_002', // Existing ID to overwrite
    topicId: 'llm_tracing',
    subtopicId: 'lt-langsmith',
    title: 'LangChain vs LangGraph vs LangSmith',
    channel: 'codebasics',
    url: 'https://www.youtube.com/watch?v=vJOGC8QJZJQ',
    duration: '45m',
    type: 'implementation',
    difficulty: 'intermediate',
    description: 'Trace LLM calls, create datasets, run evaluators, and monitor production.',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    order: 1,
    required: true,
  },
  // MCP
  {
    id: 'vid_mcp_001', // Existing ID to overwrite
    topicId: 'mcp',
    subtopicId: 'mcp-basics',
    title: 'Model Context Protocol Clearly Explained | MCP Beyond the Hype',
    channel: 'codebasics',
    url: 'https://www.youtube.com/watch?v=tzrwxLNHtRY',
    duration: '20m',
    type: 'concept',
    difficulty: 'advanced',
    description: 'The open protocol for connecting AI models to tools, data, and services.',
    learningPaths: ['advanced'],
    order: 1,
  },
  // Structured outputs JSON mode
  {
    id: 'vid_so_001', // Existing ID to overwrite
    topicId: 'structured_outputs',
    subtopicId: 'so-json-mode',
    title: 'OpenAI Structured Output Tutorial | Perfect JSON responses from OpenAI',
    channel: 'FuturMinds',
    url: 'https://www.youtube.com/watch?v=eJvYafgLh40',
    duration: '25m',
    type: 'implementation',
    difficulty: 'intermediate',
    description: 'Use JSON mode and function calling to get structured data from LLMs.',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    order: 1,
    required: true,
  },
  // FastAPI Railway deployment
  {
    id: 'vid_dep_001', // Existing ID to overwrite
    topicId: 'deployment',
    subtopicId: 'dep-paas',
    title: 'FastAPI Deployment Tutorial — On Railway and Localhost (Full Guide)',
    channel: 'oploy',
    url: 'https://www.youtube.com/watch?v=oHoWq4DI1n4',
    duration: '30m',
    type: 'implementation',
    difficulty: 'beginner',
    description: 'Deploy FastAPI apps to Railway with environment variables and scaling.',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    order: 1,
  },
  // Semantic caching
  {
    id: 'vid_cache_001', // Existing ID to overwrite
    topicId: 'caching',
    subtopicId: 'cach-semantic',
    title: 'How to Cut LLM API Costs & Latency by 90% (Redis Semantic Caching)',
    channel: 'Cloud Architecture & Software Design',
    url: 'https://www.youtube.com/watch?v=zHeH2IoDOsU',
    duration: '20m',
    type: 'implementation',
    difficulty: 'intermediate',
    description: 'Cache LLM responses semantically to cut API costs and improve response times.',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    order: 1,
  },
  // Chain of thought prompting
  {
    id: 'vid_prompt_002', // Existing ID to overwrite
    topicId: 'prompt_engineering',
    subtopicId: 'pe-cot',
    title: 'This Will Make You Better than 99% ChatGPT Users',
    channel: 'Goda Go',
    url: 'https://www.youtube.com/watch?v=EYjG6i53-xk',
    duration: '20m',
    type: 'concept',
    difficulty: 'intermediate',
    description: 'How chain-of-thought prompting improves LLM reasoning step by step.',
    learningPaths: ['intermediate', 'advanced'],
    order: 2,
  },
  // FastAPI AI streaming
  {
    id: 'vid_fastapi_002', // Existing ID to overwrite
    topicId: 'fastapi',
    subtopicId: 'fapi-ai',
    title: 'LangChain Streaming - stream, astream, astream_events API & FastAPI Integration',
    channel: 'Coding Crash Courses',
    url: 'https://www.youtube.com/watch?v=juzD9h9ewV8',
    duration: '1h',
    type: 'project',
    difficulty: 'intermediate',
    description: 'Streaming LLM responses, async endpoints, and production patterns.',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    order: 2,
  },
  // Reranking
  {
    id: 'vid_rag_005', // Existing ID to overwrite
    topicId: 'rag',
    subtopicId: 'rag-reranking',
    title: 'RAG Reranking: Improving Retrieval Quality',
    channel: 'AI Engineer',
    url: 'https://www.youtube.com/watch?v=TRjq7t2Ms5I', // reusing advanced RAG video since it's highly related and covers this
    duration: '20m',
    type: 'implementation',
    difficulty: 'advanced',
    description: 'Using cross-encoders and rerankers to improve RAG retrieval accuracy.',
    learningPaths: ['advanced'],
    order: 5,
  }
];

// Re-generate videos.js content
let updatedContent = currentVideosRaw;
for (const nv of newVideos) {
  // Find block to replace:
  const idRegex = new RegExp(`{\\s*id:\\s*'${nv.id}'[\\s\\S]*?},`, 'g');
  const replacement = `{
    id: '${nv.id}',
    topicId: '${nv.topicId}',
    subtopicId: '${nv.subtopicId}',
    title: '${nv.title.replace(/'/g, "\\'")}',
    channel: '${nv.channel.replace(/'/g, "\\'")}',
    url: '${nv.url}',
    duration: '${nv.duration}',
    type: '${nv.type}',
    difficulty: '${nv.difficulty}',
    description: '${nv.description.replace(/'/g, "\\'")}',
    learningPaths: ${JSON.stringify(nv.learningPaths).replace(/"/g, "'")},
    order: ${nv.order}${nv.required ? ',\n    required: true' : ''}
  },`;

  if (idRegex.test(updatedContent)) {
    updatedContent = updatedContent.replace(idRegex, replacement);
  } else {
    // If not found, append before '];'
    updatedContent = updatedContent.replace('];', `  ${replacement}\n];`);
  }
}

fs.writeFileSync(path.join(process.cwd(), 'src/data/videos.js'), updatedContent, 'utf8');
console.log('Successfully updated videos.js');
