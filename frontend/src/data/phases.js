/**
 * phases.js — All phase definitions for the AI Engineer Roadmap.
 * Single source of truth. Do NOT duplicate phase names elsewhere.
 */

export const PHASES = [
  {
    id: '01_FOUNDATIONS',
    number: 1,
    title: 'Foundations',
    slug: 'foundations',
    description: 'Core prerequisites: Python, SQL, Git, REST APIs, testing, and mathematics.',
    priority: 'essential',
    estimatedWeeks: 4,
    topicIds: [
      'python','pydantic','git_github','linux_basics','sql','rest_apis','http',
      'testing','numpy','pandas','dsa','math_stats'
    ],
  },
  {
    id: '02_MACHINE_LEARNING',
    number: 2,
    title: 'Machine Learning',
    slug: 'machine-learning',
    description: 'Fundamental ML concepts, algorithms, and evaluation techniques.',
    priority: 'essential',
    estimatedWeeks: 3,
    topicIds: [
      'ml_fundamentals','supervised_learning','unsupervised_learning','regression',
      'sl-classification','clustering','feature_engineering','model_evaluation_ml',
      'cross_validation','hyperparameter_tuning','scikit_learn'
    ],
  },
  {
    id: '03_DEEP_LEARNING',
    number: 3,
    title: 'Deep Learning',
    slug: 'deep-learning',
    description: 'Neural networks, backpropagation, optimization, and PyTorch.',
    priority: 'essential',
    estimatedWeeks: 4,
    topicIds: [
      'neural_networks','backpropagation','loss_functions','optimizers',
      'regularization','cnn_basics','rnn_lstm_basics','pytorch'
    ],
  },
  {
    id: '04_NLP_TRANSFORMERS',
    number: 4,
    title: 'NLP & Transformers',
    slug: 'nlp-transformers',
    description: 'Text processing, embeddings, attention mechanisms, and transformer models.',
    priority: 'essential',
    estimatedWeeks: 3,
    topicIds: [
      'text_preprocessing','tokenization_nlp','nlp_embeddings','text_classification',
      'attention','transformers','bert','gpt','hugging_face'
    ],
  },
  {
    id: '05_COMPUTER_VISION_BASICS',
    number: 5,
    title: 'Computer Vision Basics',
    slug: 'computer-vision',
    description: 'Image processing, OCR, object detection, and vision-language models.',
    priority: 'optional',
    estimatedWeeks: 2,
    topicIds: ['image_processing','ocr','object_detection_basics','vision_language_models'],
  },
  {
    id: '06_GENERATIVE_AI',
    number: 6,
    title: 'Generative AI',
    slug: 'generative-ai',
    description: 'LLMs, RAG, Agents, fine-tuning, and the full GenAI ecosystem.',
    priority: 'essential',
    estimatedWeeks: 8,
    topicIds: [
      'llm_fundamentals','trans-architecture','tokenization_genai','context_windows',
      'inference','prompt_engineering','llm-apis','structured_outputs','function_tool_calling',
      'embeddings','vector_databases','rag','fine_tuning','ai_agents',
      'langchain','langgraph','mcp','multimodal_basics'
    ],
  },
  {
    id: '07_AI_EVALUATION',
    number: 7,
    title: 'AI Evaluation',
    slug: 'ai-evaluation',
    description: 'Evaluating LLMs, RAG systems, and agents reliably.',
    priority: 'essential',
    estimatedWeeks: 2,
    topicIds: [
      'llm_evaluation','rag_evaluation','ragas','llm_as_judge','faithfulness',
      'answer_relevance','context_precision','context_recall','golden_datasets',
      'regression_testing','agent_evaluation'
    ],
  },
  {
    id: '08_MLOPS_LLMOPS',
    number: 8,
    title: 'MLOps & LLMOps',
    slug: 'mlops-llmops',
    description: 'Operationalizing ML and LLM applications in production.',
    priority: 'essential',
    estimatedWeeks: 3,
    topicIds: [
      'experiment_tracking','model_versioning','data_versioning','model_serving',
      'llm_tracing','observability','token_monitoring','cost_monitoring',
      'latency_monitoring','prompt_versioning','ab_testing','cicd'
    ],
  },
  {
    id: '09_AI_SECURITY',
    number: 9,
    title: 'AI Security',
    slug: 'ai-security',
    description: 'Securing AI applications against prompt injection, data leakage, and abuse.',
    priority: 'essential',
    estimatedWeeks: 1,
    topicIds: [
      'prompt_injection','jailbreaking','data_leakage','rag_poisoning',
      'tool_abuse','guardrails','pii_protection','authorization_security'
    ],
  },
  {
    id: '10_PRODUCTION_AI',
    number: 10,
    title: 'Production AI',
    slug: 'production-ai',
    description: 'APIs, databases, infrastructure, deployment, and system design.',
    priority: 'essential',
    estimatedWeeks: 4,
    topicIds: [
      'fastapi','postgresql','redis','celery','message_queues','jwt','rbac',
      'caching','rate_limiting','logging_prod','monitoring','docker',
      'docker_compose','github_actions','openapi','testing_prod',
      'system_design','cloud','deployment'
    ],
  },
];

// Named lookup by id for O(1) access
export const PHASE_MAP = Object.fromEntries(PHASES.map(p => [p.id, p]));
