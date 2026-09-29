/**
 * learningPaths.js — Defines the 3 learning paths.
 *
 * Paths reference topicIds from topics.js — NO topic data is duplicated here.
 * Each path is a curated subset of the master topic list.
 */

export const LEARNING_PATHS = [
  {
    id: 'job_ready',
    title: '🚀 Job Ready',
    slug: 'job-ready',
    tagline: 'Land your first AI engineering role',
    description: 'A focused, practical path covering only the essential skills needed to get hired as an AI engineer. Skip the theory-heavy parts; build working systems fast.',
    estimatedWeeks: 12,
    difficulty: 'beginner',
    color: 'emerald',
    // Only essential/high-priority topics from the master list
    topicIds: [
      // Foundations
      'python','pydantic','git_github','sql','rest_apis','http','testing','numpy','pandas',
      // ML (surface-level)
      'ml_fundamentals','supervised_learning','regression','sl-classification',
      'feature_engineering','model_evaluation_ml','cross_validation','scikit_learn',
      // NLP/Transformers (practical only)
      'text_preprocessing','tokenization_nlp','nlp_embeddings','hugging_face',
      // Generative AI (core)
      'llm_fundamentals','tokenization_genai','context_windows','inference',
      'prompt_engineering','llm-apis','structured_outputs','function_tool_calling',
      'embeddings','vector_databases','rag','ai_agents','langchain',
      // Evaluation (core)
      'llm_evaluation','rag_evaluation','llm_as_judge','faithfulness','answer_relevance',
      'golden_datasets',
      // MLOps (core)
      'model_serving','llm_tracing','observability','token_monitoring',
      'cost_monitoring','latency_monitoring','cicd',
      // Security (core)
      'prompt_injection','data_leakage','guardrails',
      // Production AI (core)
      'fastapi','postgresql','redis','jwt','caching','rate_limiting',
      'logging_prod','docker','docker_compose','github_actions','openapi',
      'testing_prod','system_design',
    ],
    phaseIds: [
      '01_FOUNDATIONS','02_MACHINE_LEARNING','04_NLP_TRANSFORMERS',
      '06_GENERATIVE_AI','07_AI_EVALUATION','08_MLOPS_LLMOPS',
      '09_AI_SECURITY','10_PRODUCTION_AI',
    ],
  },
  {
    id: 'intermediate',
    title: '⚡ Intermediate',
    slug: 'intermediate',
    tagline: 'Deepen your AI engineering skills',
    description: 'Builds on Job Ready with deeper theory, more algorithms, advanced RAG, fine-tuning basics, and stronger MLOps. Designed for engineers who want to grow beyond basics.',
    estimatedWeeks: 20,
    difficulty: 'intermediate',
    color: 'blue',
    topicIds: [
      // All Job Ready +
      'linux_basics','math_stats','dsa',
      'unsupervised_learning','clustering','hyperparameter_tuning',
      'neural_networks','loss_functions','optimizers','regularization','pytorch',
      'text_classification','attention','transformers','gpt',
      'trans-architecture','multimodal_basics',
      'unsupervised_learning','fine_tuning','langgraph',
      'ragas','context_precision','context_recall','regression_testing',
      'experiment_tracking','model_versioning','prompt_versioning',
      'jailbreaking','rag_poisoning','pii_protection','tool_abuse',
      'celery','message_queues','rbac','monitoring','cloud','deployment',
      // Re-include all job_ready
      'python','pydantic','git_github','sql','rest_apis','http','testing','numpy','pandas',
      'ml_fundamentals','supervised_learning','regression','sl-classification',
      'feature_engineering','model_evaluation_ml','cross_validation','scikit_learn',
      'text_preprocessing','tokenization_nlp','nlp_embeddings','hugging_face',
      'llm_fundamentals','tokenization_genai','context_windows','inference',
      'prompt_engineering','llm-apis','structured_outputs','function_tool_calling',
      'embeddings','vector_databases','rag','ai_agents','langchain',
      'llm_evaluation','rag_evaluation','llm_as_judge','faithfulness','answer_relevance',
      'golden_datasets',
      'model_serving','llm_tracing','observability','token_monitoring',
      'cost_monitoring','latency_monitoring','cicd',
      'prompt_injection','data_leakage','guardrails',
      'fastapi','postgresql','redis','jwt','caching','rate_limiting',
      'logging_prod','docker','docker_compose','github_actions','openapi',
      'testing_prod','system_design',
    ],
    phaseIds: [
      '01_FOUNDATIONS','02_MACHINE_LEARNING','03_DEEP_LEARNING','04_NLP_TRANSFORMERS',
      '06_GENERATIVE_AI','07_AI_EVALUATION','08_MLOPS_LLMOPS',
      '09_AI_SECURITY','10_PRODUCTION_AI',
    ],
  },
  {
    id: 'advanced',
    title: '🧠 Advanced',
    slug: 'advanced',
    tagline: 'Master every dimension of AI engineering',
    description: 'The complete roadmap — every topic, every phase. For engineers who want to become world-class AI systems architects.',
    estimatedWeeks: 36,
    difficulty: 'advanced',
    color: 'purple',
    // All topics — use a wildcard marker; components resolve to full TOPICS list
    topicIds: ['__ALL__'],
    phaseIds: [
      '01_FOUNDATIONS','02_MACHINE_LEARNING','03_DEEP_LEARNING','04_NLP_TRANSFORMERS',
      '05_COMPUTER_VISION_BASICS','06_GENERATIVE_AI','07_AI_EVALUATION',
      '08_MLOPS_LLMOPS','09_AI_SECURITY','10_PRODUCTION_AI',
    ],
  },
];

export const LEARNING_PATH_MAP = Object.fromEntries(LEARNING_PATHS.map(p => [p.id, p]));

// Canonical path IDs
export const PATHS = {
  JOB_READY: 'job_ready',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};
