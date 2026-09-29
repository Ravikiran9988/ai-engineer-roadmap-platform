/**
 * CENTRALIZED DOCUMENTATION DATABASE
 * ============================================================
 * All official docs and key reading resources per topic.
 *
 * URL CONVENTION:
 *   Use the real official documentation URL.
 *   Only use RESOURCE_URL_PENDING if the real URL is unknown.
 * ============================================================
 */

export const DOCUMENTATION = [

  // ─── PYTHON ────────────────────────────────────────────────
  { id: 'doc_python_001', topicId: 'python', title: 'Official Python Documentation', url: 'https://docs.python.org/3/', description: 'The authoritative Python reference.', isPrimary: true },
  { id: 'doc_python_002', topicId: 'python', title: 'Real Python — Tutorials', url: 'https://realpython.com/', description: 'In-depth practical tutorials for every Python topic.', isPrimary: false },

  // ─── PYDANTIC ─────────────────────────────────────────────
  { id: 'doc_pydantic_001', topicId: 'pydantic', title: 'Pydantic V2 Documentation', url: 'https://docs.pydantic.dev/latest/', description: 'Official Pydantic docs — models, validators, serialization.', isPrimary: true },

  // ─── GIT / GITHUB ─────────────────────────────────────────
  { id: 'doc_git_001', topicId: 'git_github', title: 'Pro Git Book', url: 'https://git-scm.com/book/en/v2', description: 'The definitive free book on Git.', isPrimary: true },
  { id: 'doc_git_002', topicId: 'git_github', title: 'GitHub Docs', url: 'https://docs.github.com/en', description: 'Official GitHub documentation.', isPrimary: false },

  // ─── LINUX ────────────────────────────────────────────────
  { id: 'doc_linux_001', topicId: 'linux_basics', title: 'The Linux Command Line', url: 'https://linuxcommand.org/tlcl.php', description: 'Free online book covering the command line thoroughly.', isPrimary: true },

  // ─── SQL ──────────────────────────────────────────────────
  { id: 'doc_sql_001', topicId: 'sql', title: 'PostgreSQL Documentation', url: 'https://www.postgresql.org/docs/', description: 'Official PostgreSQL docs.', isPrimary: true },
  { id: 'doc_sql_002', topicId: 'sql', title: 'SQLZoo — Interactive Exercises', url: 'https://sqlzoo.net/', description: 'Practice SQL interactively.', isPrimary: false },

  // ─── REST APIs ────────────────────────────────────────────
  { id: 'doc_rest_001', topicId: 'rest_apis', title: 'HTTP — MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', description: 'HTTP spec, status codes, headers — all in one place.', isPrimary: true },

  // ─── NUMPY / PANDAS ───────────────────────────────────────
  { id: 'doc_numpy_001', topicId: 'numpy', title: 'NumPy Documentation', url: 'https://numpy.org/doc/stable/', description: 'Official NumPy reference.', isPrimary: true },
  { id: 'doc_pandas_001', topicId: 'pandas', title: 'Pandas Documentation', url: 'https://pandas.pydata.org/docs/', description: 'Official Pandas reference.', isPrimary: true },

  // ─── PYTORCH ──────────────────────────────────────────────
  { id: 'doc_pytorch_001', topicId: 'pytorch', title: 'PyTorch Documentation', url: 'https://pytorch.org/docs/stable/index.html', description: 'Official PyTorch API and tutorials.', isPrimary: true },

  // ─── TRANSFORMERS ─────────────────────────────────────────
  { id: 'doc_hf_001', topicId: 'hugging_face', title: 'HuggingFace Documentation', url: 'https://huggingface.co/docs/transformers/index', description: 'Full HuggingFace Transformers library docs.', isPrimary: true },
  { id: 'doc_hf_002', topicId: 'transformers', title: 'Attention is All You Need — Paper', url: 'https://arxiv.org/abs/1706.03762', description: 'The original Transformer paper by Vaswani et al.', isPrimary: false },

  // ─── LLM FUNDAMENTALS ─────────────────────────────────────
  { id: 'doc_llm_001', topicId: 'llm_fundamentals', title: 'OpenAI API Reference', url: 'https://platform.openai.com/docs/api-reference', description: 'Complete OpenAI API documentation.', isPrimary: true },
  { id: 'doc_llm_002', topicId: 'llm_fundamentals', title: 'Anthropic Claude API Docs', url: 'https://docs.anthropic.com/en/api/getting-started', description: 'Claude API reference and guides.', isPrimary: false },

  // ─── PROMPT ENGINEERING ───────────────────────────────────
  { id: 'doc_prompt_001', topicId: 'prompt_engineering', title: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai/', description: 'Community-curated guide to prompting techniques.', isPrimary: true },
  { id: 'doc_prompt_002', topicId: 'prompt_engineering', title: 'Anthropic Prompt Library', url: 'https://docs.anthropic.com/en/prompt-library/library', description: 'Real-world prompt examples from Anthropic.', isPrimary: false },

  // ─── RAG ──────────────────────────────────────────────────
  { id: 'doc_rag_001', topicId: 'rag', title: 'LangChain RAG How-to Guides', url: 'https://python.langchain.com/docs/how_to/#qa-with-rag', description: 'Official LangChain RAG guides.', isPrimary: true },

  // ─── VECTOR DATABASES ────────────────────────────────────
  { id: 'doc_vec_001', topicId: 'vector_databases', title: 'ChromaDB Documentation', url: 'https://docs.trychroma.com/', description: 'Official ChromaDB docs for local vector storage.', isPrimary: true },
  { id: 'doc_vec_002', topicId: 'vector_databases', title: 'Pinecone Documentation', url: 'https://docs.pinecone.io/', description: 'Official Pinecone docs for managed vector search.', isPrimary: false },

  // ─── LANGCHAIN ────────────────────────────────────────────
  { id: 'doc_lc_001', topicId: 'langchain', title: 'LangChain Python Documentation', url: 'https://python.langchain.com/docs/introduction/', description: 'Official LangChain docs.', isPrimary: true },

  // ─── LANGGRAPH ────────────────────────────────────────────
  { id: 'doc_lg_001', topicId: 'langgraph', title: 'LangGraph Documentation', url: 'https://langchain-ai.github.io/langgraph/', description: 'Official LangGraph docs for agentic workflows.', isPrimary: true },

  // ─── MCP ──────────────────────────────────────────────────
  { id: 'doc_mcp_001', topicId: 'mcp', title: 'Model Context Protocol Spec', url: 'https://modelcontextprotocol.io/', description: 'Official MCP specification and documentation.', isPrimary: true },

  // ─── FINE-TUNING ──────────────────────────────────────────
  { id: 'doc_ft_001', topicId: 'fine_tuning', title: 'HuggingFace PEFT Documentation', url: 'https://huggingface.co/docs/peft', description: 'LoRA, QLoRA, and adapter methods via HuggingFace PEFT.', isPrimary: true },

  // ─── EVALUATION ───────────────────────────────────────────
  { id: 'doc_eval_001', topicId: 'llm_evaluation', title: 'RAGAS Documentation', url: 'https://docs.ragas.io/en/latest/', description: 'Official RAGAS framework docs for RAG evaluation.', isPrimary: true },

  // ─── FASTAPI ──────────────────────────────────────────────
  { id: 'doc_fapi_001', topicId: 'fastapi', title: 'FastAPI Documentation', url: 'https://fastapi.tiangolo.com/', description: 'Official FastAPI docs — tutorial, advanced usage, deployment.', isPrimary: true },

  // ─── DOCKER ───────────────────────────────────────────────
  { id: 'doc_docker_001', topicId: 'docker', title: 'Docker Documentation', url: 'https://docs.docker.com/', description: 'Official Docker docs.', isPrimary: true },
];

/**
 * Helper: get all documentation links for a topic.
 */
export function getDocsForTopic(topicId) {
  return DOCUMENTATION.filter(d => d.topicId === topicId);
}
