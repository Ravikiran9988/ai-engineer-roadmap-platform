/**
 * contentData.js — Knowledge Base folder structure.
 *
 * This file now ONLY provides KNOWLEDGE_BASE_FOLDERS.
 * All resource URLs are managed in the canonical data files:
 *   videos.js, documentation.js, githubNotes.js, playlists.js
 *
 * DO NOT add fake/placeholder URLs here.
 */

export const KNOWLEDGE_BASE_FOLDERS = [
  {
    id: 'foundations',
    name: '01 Foundations',
    topics: ['python', 'pydantic', 'git_github', 'linux_basics', 'sql', 'rest_apis', 'http', 'testing', 'numpy', 'pandas', 'dsa', 'math_stats'],
  },
  {
    id: 'machine_learning',
    name: '02 Machine Learning',
    topics: ['ml_fundamentals', 'supervised_learning', 'unsupervised_learning', 'regression', 'sl-classification', 'clustering', 'feature_engineering', 'model_evaluation_ml', 'cross_validation', 'hyperparameter_tuning', 'scikit_learn'],
  },
  {
    id: 'deep_learning',
    name: '03 Deep Learning',
    topics: ['neural_networks', 'backpropagation', 'loss_functions', 'optimizers', 'regularization', 'cnn_basics', 'rnn_lstm_basics', 'pytorch'],
  },
  {
    id: 'nlp_transformers',
    name: '04 NLP & Transformers',
    topics: ['text_preprocessing', 'tokenization_nlp', 'nlp_embeddings', 'text_classification', 'attention', 'transformers', 'bert', 'gpt', 'hugging_face'],
  },
  {
    id: 'computer_vision',
    name: '05 Computer Vision',
    topics: ['image_processing', 'ocr', 'object_detection_basics', 'vision_language_models'],
  },
  {
    id: 'generative_ai',
    name: '06 Generative AI',
    topics: ['llm_fundamentals', 'trans-architecture', 'tokenization_genai', 'context_windows', 'inference', 'prompt_engineering', 'llm-apis', 'structured_outputs', 'function_tool_calling', 'embeddings', 'vector_databases', 'rag', 'fine_tuning'],
  },
  {
    id: 'agents',
    name: '06 AI Agents',
    topics: ['ai_agents', 'langchain', 'langgraph', 'mcp', 'multimodal_basics'],
  },
  {
    id: 'evaluation',
    name: '07 AI Evaluation',
    topics: ['llm_evaluation', 'rag_evaluation', 'ragas', 'llm_as_judge', 'faithfulness', 'answer_relevance', 'context_precision', 'context_recall', 'golden_datasets', 'regression_testing', 'agent_evaluation'],
  },
  {
    id: 'mlops_llmops',
    name: '08 MLOps & LLMOps',
    topics: ['experiment_tracking', 'model_versioning', 'data_versioning', 'model_serving', 'llm_tracing', 'observability', 'token_monitoring', 'cost_monitoring', 'latency_monitoring', 'prompt_versioning', 'ab_testing', 'cicd'],
  },
  {
    id: 'ai_security',
    name: '09 AI Security',
    topics: ['prompt_injection', 'jailbreaking', 'data_leakage', 'rag_poisoning', 'tool_abuse', 'guardrails', 'pii_protection', 'authorization_security'],
  },
  {
    id: 'production_ai',
    name: '10 Production AI',
    topics: ['fastapi', 'postgresql', 'redis', 'celery', 'message_queues', 'jwt', 'rbac', 'caching', 'rate_limiting', 'logging_prod', 'monitoring', 'docker', 'docker_compose', 'github_actions', 'openapi', 'testing_prod', 'system_design', 'cloud', 'deployment'],
  },
];
