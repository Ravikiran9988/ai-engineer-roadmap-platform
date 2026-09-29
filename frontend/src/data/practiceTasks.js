/**
 * CENTRALIZED PRACTICE TASKS DATABASE
 * ============================================================
 * Standalone practice exercises per topic/subtopic.
 * These are distinct from assignments (which have GitHub submissions).
 *
 * DIFFICULTY: 'beginner' | 'intermediate' | 'advanced'
 * LEARNING PATH: 'job_ready' | 'intermediate' | 'advanced'
 * ============================================================
 */

export const PRACTICE_TASKS = [

  // ─── PYTHON ────────────────────────────────────────────────
  {
    id: 'prac_python_001',
    topicId: 'python',
    subtopicId: 'core_python',
    title: 'CLI Data Processor',
    task: 'Build a script that reads a JSON file of user records, filters by age > 25, sorts by name, and writes results to a new JSON file.',
    requirements: ['Use type hints', 'Use pathlib for file handling', 'Handle file-not-found gracefully'],
    difficulty: 'beginner',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    estimatedTime: '1h',
  },
  {
    id: 'prac_python_002',
    topicId: 'python',
    subtopicId: 'oop',
    title: 'Design a Document Store Class',
    task: 'Create a DocumentStore class with methods to add, retrieve, and delete documents by ID. Use dataclasses for the document model.',
    requirements: ['Use dataclasses', 'Implement __repr__', 'Add error handling for missing IDs'],
    difficulty: 'beginner',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    estimatedTime: '1.5h',
  },
  {
    id: 'prac_python_003',
    topicId: 'python',
    subtopicId: 'async_python',
    title: 'Async API Fetcher',
    task: 'Fetch data from 5 public APIs concurrently using asyncio and aiohttp. Time the total duration and compare vs sequential.',
    requirements: ['Use asyncio.gather', 'Handle timeouts', 'Print total time'],
    difficulty: 'intermediate',
    learningPaths: ['intermediate', 'advanced'],
    estimatedTime: '2h',
  },

  // ─── PYDANTIC ─────────────────────────────────────────────
  {
    id: 'prac_pydantic_001',
    topicId: 'pydantic',
    subtopicId: 'pydantic_basics',
    title: 'LLM Response Validator',
    task: 'Create Pydantic models to validate and parse structured LLM responses. Handle optional fields and nested models.',
    requirements: ['Use Field with descriptions', 'Add custom validators', 'Test with invalid input'],
    difficulty: 'beginner',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    estimatedTime: '1h',
  },

  // ─── SQL ──────────────────────────────────────────────────
  {
    id: 'prac_sql_001',
    topicId: 'sql',
    subtopicId: 'sql_basics',
    title: 'Query an AI Models Database',
    task: 'Given a database of AI models (name, organization, release_date, params), write queries to: rank by params, find models per org, and get the newest model per provider.',
    requirements: ['Use window functions', 'Use GROUP BY and HAVING', 'Write all as a single SQL file'],
    difficulty: 'beginner',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    estimatedTime: '2h',
  },

  // ─── RAG ──────────────────────────────────────────────────
  {
    id: 'prac_rag_001',
    topicId: 'rag',
    subtopicId: 'rag_chunking',
    title: 'Implement 3 Chunking Strategies',
    task: 'Load a plain-text document and implement fixed-size, recursive, and semantic chunking. Print chunk count and average length for each strategy.',
    requirements: ['Use LangChain text splitters', 'Compare results in a table', 'Choose the best strategy and explain why'],
    difficulty: 'intermediate',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    estimatedTime: '2h',
  },
  {
    id: 'prac_rag_002',
    topicId: 'rag',
    subtopicId: 'rag_implementation',
    title: 'Build a Simple RAG Q&A System',
    task: 'Load any documentation, embed it in ChromaDB, and answer 5 test questions. Log retrieved chunks for each query.',
    requirements: ['Use LangChain + ChromaDB', 'Use OpenAI or local embeddings', 'Evaluate 3 answers manually'],
    difficulty: 'intermediate',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    estimatedTime: '3h',
  },

  // ─── VECTOR DATABASES ─────────────────────────────────────
  {
    id: 'prac_vec_001',
    topicId: 'vector_databases',
    subtopicId: 'vector_db_concepts',
    title: 'Explore Embedding Similarity',
    task: 'Embed 20 sentences using an embedding model. Find the top-3 most similar pairs using cosine similarity. Visualize with a heatmap.',
    requirements: ['Use sentence-transformers or OpenAI embeddings', 'Use numpy for cosine similarity', 'Print results in a table'],
    difficulty: 'beginner',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    estimatedTime: '1.5h',
  },

  // ─── AI AGENTS ────────────────────────────────────────────
  {
    id: 'prac_agents_001',
    topicId: 'ai_agents',
    subtopicId: 'agent_concepts',
    title: 'Build a Tool-Calling Agent',
    task: 'Create an agent with 3 custom tools: web_search, calculator, and file_writer. Test it with a complex prompt that requires multiple tool calls.',
    requirements: ['Use LangChain tools', 'Log each tool call', 'Handle tool errors gracefully'],
    difficulty: 'intermediate',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    estimatedTime: '3h',
  },

  // ─── FASTAPI ──────────────────────────────────────────────
  {
    id: 'prac_fastapi_001',
    topicId: 'fastapi',
    subtopicId: 'fastapi_basics',
    title: 'Build an AI Chat Endpoint',
    task: 'Create a FastAPI app with a /chat POST endpoint. Accept a message, call an LLM, and return a streamed response. Add input validation with Pydantic.',
    requirements: ['Use StreamingResponse', 'Validate with Pydantic', 'Add basic rate limiting header'],
    difficulty: 'intermediate',
    learningPaths: ['job_ready', 'intermediate', 'advanced'],
    estimatedTime: '2h',
  },
];

/**
 * Helper: get practice tasks for a topic.
 */
export function getPracticeForTopic(topicId, { path } = {}) {
  return PRACTICE_TASKS
    .filter(p => p.topicId === topicId)
    .filter(p => !path || p.learningPaths.includes(path));
}
