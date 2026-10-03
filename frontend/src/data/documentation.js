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

  // ─── TESTING ──────────────────────────────────────────────
  { id: 'doc_testing_001', topicId: 'testing', title: 'pytest Documentation', url: 'https://docs.pytest.org/en/stable/', description: 'Official pytest docs — fixtures, parametrize, plugins.', isPrimary: true },

  // ─── HTTP ─────────────────────────────────────────────────
  { id: 'doc_http_001', topicId: 'http', title: 'HTTP — MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', description: 'Comprehensive HTTP reference including methods, status codes, headers.', isPrimary: true },

  // ─── NUMPY ────────────────────────────────────────────────
  { id: 'doc_numpy_002', topicId: 'numpy', title: 'NumPy User Guide', url: 'https://numpy.org/doc/stable/user/index.html', description: 'Official NumPy user guide with tutorials and how-tos.', isPrimary: false },

  // ─── MATH/STATS ───────────────────────────────────────────
  { id: 'doc_math_001', topicId: 'math_stats', title: 'Mathematics for Machine Learning', url: 'https://mml-book.github.io/', description: 'Free online book covering linear algebra, probability, and calculus for ML.', isPrimary: true },

  // ─── ML FRAMEWORKS ────────────────────────────────────────
  { id: 'doc_sklearn_001', topicId: 'scikit_learn', title: 'Scikit-learn Documentation', url: 'https://scikit-learn.org/stable/user_guide.html', description: 'Official scikit-learn user guide.', isPrimary: true },
  { id: 'doc_ml_001', topicId: 'ml_fundamentals', title: 'Google Machine Learning Crash Course', url: 'https://developers.google.com/machine-learning/crash-course', description: 'Free, practical ML course by Google with exercises.', isPrimary: true },
  { id: 'doc_supervised_001', topicId: 'supervised_learning', title: 'Scikit-learn Supervised Learning Guide', url: 'https://scikit-learn.org/stable/supervised_learning.html', description: 'Official reference for all supervised learning algorithms.', isPrimary: true },
  { id: 'doc_eval_001b', topicId: 'model_evaluation_ml', title: 'Scikit-learn Model Evaluation', url: 'https://scikit-learn.org/stable/model_selection.html', description: 'Cross-validation, metrics, and model selection strategies.', isPrimary: true },

  // ─── DEEP LEARNING ────────────────────────────────────────
  { id: 'doc_nn_001', topicId: 'neural_networks', title: 'Neural Networks and Deep Learning (Book)', url: 'http://neuralnetworksanddeeplearning.com/', description: 'Free online book on neural networks by Michael Nielsen.', isPrimary: true },
  { id: 'doc_bp_001', topicId: 'backpropagation', title: 'Backpropagation — Andrej Karpathy Notes', url: 'https://karpathy.medium.com/yes-you-should-understand-backprop-e2f06eab496b', description: 'In-depth notes on why understanding backprop matters.', isPrimary: true },
  { id: 'doc_loss_001', topicId: 'loss_functions', title: 'PyTorch Loss Functions', url: 'https://pytorch.org/docs/stable/nn.html#loss-functions', description: 'All PyTorch built-in loss functions with formulas.', isPrimary: true },
  { id: 'doc_opt_001', topicId: 'optimizers', title: 'PyTorch Optimizers', url: 'https://pytorch.org/docs/stable/optim.html', description: 'Official PyTorch optimizer documentation.', isPrimary: true },
  { id: 'doc_reg_001', topicId: 'regularization', title: 'Dropout and Regularization — Fast.ai', url: 'https://www.fast.ai/', description: 'Practical deep learning regularization techniques.', isPrimary: true },

  // ─── NLP ──────────────────────────────────────────────────
  { id: 'doc_tp_001', topicId: 'text_preprocessing', title: 'NLTK Documentation', url: 'https://www.nltk.org/', description: 'Official NLTK docs for tokenization, stemming, and NLP preprocessing.', isPrimary: true },
  { id: 'doc_tok_001', topicId: 'tokenization_nlp', title: 'HuggingFace Tokenizers Documentation', url: 'https://huggingface.co/docs/tokenizers', description: 'Fast tokenizer library — BPE, WordPiece, and Unigram.', isPrimary: true },
  { id: 'doc_nlpemb_001', topicId: 'nlp_embeddings', title: 'Sentence-Transformers Documentation', url: 'https://www.sbert.net/', description: 'Official sentence-transformers docs for semantic embeddings.', isPrimary: true },
  { id: 'doc_att_001', topicId: 'attention', title: 'Attention Is All You Need (Paper)', url: 'https://arxiv.org/abs/1706.03762', description: 'The original transformer paper by Vaswani et al.', isPrimary: true },
  { id: 'doc_bert_001', topicId: 'bert', title: 'BERT Paper', url: 'https://arxiv.org/abs/1810.04805', description: 'Original BERT paper: Pre-training of Deep Bidirectional Transformers.', isPrimary: true },
  { id: 'doc_gpt_001', topicId: 'gpt', title: 'GPT-2 Paper', url: 'https://openai.com/research/language-models-are-unsupervised-multitask-learners', description: 'Language Models are Unsupervised Multitask Learners.', isPrimary: true },

  // ─── GENERATIVE AI ────────────────────────────────────────
  { id: 'doc_llmapi_001', topicId: 'llm-apis', title: 'OpenAI API Reference', url: 'https://platform.openai.com/docs/api-reference', description: 'Complete OpenAI API reference for chat, embeddings, and more.', isPrimary: true },
  { id: 'doc_llmapi_002', topicId: 'llm-apis', title: 'Anthropic API Documentation', url: 'https://docs.anthropic.com/en/api/getting-started', description: 'Anthropic Claude API getting started guide.', isPrimary: false },
  { id: 'doc_so_001', topicId: 'structured_outputs', title: 'Instructor Library Documentation', url: 'https://python.useinstructor.com/', description: 'Instructor — structured LLM outputs with Pydantic.', isPrimary: true },
  { id: 'doc_tc_001', topicId: 'function_tool_calling', title: 'OpenAI Function Calling Guide', url: 'https://platform.openai.com/docs/guides/function-calling', description: 'Official OpenAI guide to function and tool calling.', isPrimary: true },
  { id: 'doc_emb_001', topicId: 'embeddings', title: 'OpenAI Embeddings Guide', url: 'https://platform.openai.com/docs/guides/embeddings', description: 'Official OpenAI guide to text embeddings.', isPrimary: true },
  { id: 'doc_ai_001', topicId: 'ai_agents', title: 'OpenAI Assistants API', url: 'https://platform.openai.com/docs/assistants/overview', description: 'OpenAI Assistants API for building agentic applications.', isPrimary: true },
  { id: 'doc_ft_002', topicId: 'fine_tuning', title: 'OpenAI Fine-tuning Guide', url: 'https://platform.openai.com/docs/guides/fine-tuning', description: 'Official OpenAI fine-tuning documentation and best practices.', isPrimary: false },
  { id: 'doc_trans_001', topicId: 'trans-architecture', title: 'The Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/', description: 'Visual walkthrough of the transformer architecture.', isPrimary: true },
  { id: 'doc_tok_genai_001', topicId: 'tokenization_genai', title: 'OpenAI Tokenizer', url: 'https://platform.openai.com/tokenizer', description: 'Interactive tokenizer to see how text is tokenized.', isPrimary: true },
  { id: 'doc_ctx_001', topicId: 'context_windows', title: 'OpenAI Context Length Reference', url: 'https://platform.openai.com/docs/models', description: 'Model context window sizes across all OpenAI models.', isPrimary: true },
  { id: 'doc_inf_001', topicId: 'inference', title: 'OpenAI Inference Parameters', url: 'https://platform.openai.com/docs/api-reference/chat/create', description: 'Temperature, top_p, max_tokens, and other sampling parameters.', isPrimary: true },

  // ─── AI EVALUATION ────────────────────────────────────────
  { id: 'doc_ragas_001', topicId: 'ragas', title: 'RAGAS Documentation', url: 'https://docs.ragas.io/', description: 'Official RAGAS library docs for RAG evaluation.', isPrimary: true },
  { id: 'doc_judge_001', topicId: 'llm_as_judge', title: 'LLM-as-Judge Paper', url: 'https://arxiv.org/abs/2306.05685', description: 'Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena.', isPrimary: true },
  { id: 'doc_deepeval_001', topicId: 'llm_evaluation', title: 'DeepEval Documentation', url: 'https://docs.confident-ai.com/', description: 'Open-source LLM evaluation framework documentation.', isPrimary: false },

  // ─── MLOPS ────────────────────────────────────────────────
  { id: 'doc_mlflow_001', topicId: 'experiment_tracking', title: 'MLflow Documentation', url: 'https://mlflow.org/docs/latest/index.html', description: 'Official MLflow docs for experiment tracking and model registry.', isPrimary: true },
  { id: 'doc_wandb_001', topicId: 'experiment_tracking', title: 'Weights & Biases Documentation', url: 'https://docs.wandb.ai/', description: 'Official W&B docs for experiment tracking.', isPrimary: false },
  { id: 'doc_ls_001', topicId: 'llm_tracing', title: 'LangSmith Documentation', url: 'https://docs.smith.langchain.com/', description: 'Official LangSmith docs for LLM tracing and evaluation.', isPrimary: true },
  { id: 'doc_gh_001', topicId: 'cicd', title: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions', description: 'Official GitHub Actions docs — workflows, jobs, and steps.', isPrimary: true },

  // ─── AI SECURITY ──────────────────────────────────────────
  { id: 'doc_pi_001', topicId: 'prompt_injection', title: 'OWASP LLM Top 10', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', description: 'OWASP top 10 security risks for LLM applications.', isPrimary: true },
  { id: 'doc_pii_001', topicId: 'pii_protection', title: 'Microsoft Presidio Documentation', url: 'https://microsoft.github.io/presidio/', description: 'Official Presidio docs for PII detection and anonymization.', isPrimary: true },
  { id: 'doc_gr_001', topicId: 'guardrails', title: 'Guardrails AI Documentation', url: 'https://www.guardrailsai.com/docs', description: 'Official Guardrails AI docs for input/output validation.', isPrimary: true },
  { id: 'doc_nemo_001', topicId: 'guardrails', title: 'NeMo Guardrails Documentation', url: 'https://docs.nvidia.com/nemo/guardrails/', description: 'NVIDIA NeMo Guardrails for programmable LLM safety.', isPrimary: false },

  // ─── PRODUCTION AI ────────────────────────────────────────
  { id: 'doc_pg_001', topicId: 'postgresql', title: 'PostgreSQL Documentation', url: 'https://www.postgresql.org/docs/', description: 'Official PostgreSQL reference documentation.', isPrimary: true },
  { id: 'doc_pgv_001', topicId: 'postgresql', title: 'pgvector Documentation', url: 'https://github.com/pgvector/pgvector', description: 'pgvector GitHub — installation, usage, and indexing.', isPrimary: false },
  { id: 'doc_redis_001', topicId: 'redis', title: 'Redis Documentation', url: 'https://redis.io/docs/', description: 'Official Redis documentation — commands, data types, and modules.', isPrimary: true },
  { id: 'doc_celery_001', topicId: 'celery', title: 'Celery Documentation', url: 'https://docs.celeryq.dev/en/stable/', description: 'Official Celery docs for background task processing.', isPrimary: true },
  { id: 'doc_mq_001', topicId: 'message_queues', title: 'RabbitMQ Documentation', url: 'https://www.rabbitmq.com/documentation.html', description: 'Official RabbitMQ documentation.', isPrimary: true },
  { id: 'doc_kafka_001', topicId: 'message_queues', title: 'Apache Kafka Documentation', url: 'https://kafka.apache.org/documentation/', description: 'Official Kafka documentation for producers, consumers, and brokers.', isPrimary: false },
  { id: 'doc_jwt_001', topicId: 'jwt', title: 'JWT.io — JSON Web Tokens', url: 'https://jwt.io/introduction', description: 'Introduction to JSON Web Tokens with debugger.', isPrimary: true },
  { id: 'doc_rbac_001', topicId: 'rbac', title: 'FastAPI Security — OAuth2 with JWT', url: 'https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/', description: 'Official FastAPI security guide with JWT and OAuth2.', isPrimary: true },
  { id: 'doc_cache_001', topicId: 'caching', title: 'Redis Caching Best Practices', url: 'https://redis.io/docs/latest/develop/use/patterns/caching/', description: 'Redis official caching patterns and best practices.', isPrimary: true },
  { id: 'doc_rl_001', topicId: 'rate_limiting', title: 'FastAPI Rate Limiting — slowapi', url: 'https://slowapi.readthedocs.io/', description: 'slowapi — rate limiting middleware for FastAPI applications.', isPrimary: true },
  { id: 'doc_log_001', topicId: 'logging_prod', title: 'Python Logging Documentation', url: 'https://docs.python.org/3/library/logging.html', description: 'Official Python logging module documentation.', isPrimary: true },
  { id: 'doc_prom_001', topicId: 'monitoring', title: 'Prometheus Documentation', url: 'https://prometheus.io/docs/introduction/overview/', description: 'Official Prometheus monitoring system documentation.', isPrimary: true },
  { id: 'doc_grafana_001', topicId: 'monitoring', title: 'Grafana Documentation', url: 'https://grafana.com/docs/grafana/latest/', description: 'Official Grafana documentation for dashboards and alerting.', isPrimary: false },
  { id: 'doc_dc_001', topicId: 'docker_compose', title: 'Docker Compose Documentation', url: 'https://docs.docker.com/compose/', description: 'Official Docker Compose documentation.', isPrimary: true },
  { id: 'doc_gha_001', topicId: 'github_actions', title: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions', description: 'Official GitHub Actions docs for CI/CD workflows.', isPrimary: true },
  { id: 'doc_oa_001', topicId: 'openapi', title: 'OpenAPI Specification', url: 'https://swagger.io/specification/', description: 'Official OpenAPI 3.0 specification.', isPrimary: true },
  { id: 'doc_testing_prod_001', topicId: 'testing_prod', title: 'FastAPI Testing Guide', url: 'https://fastapi.tiangolo.com/tutorial/testing/', description: 'Official FastAPI guide for testing with TestClient.', isPrimary: true },
  { id: 'doc_sd_001', topicId: 'system_design', title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', description: 'Comprehensive system design resource on GitHub.', isPrimary: true },
  { id: 'doc_cloud_001', topicId: 'cloud', title: 'AWS Documentation', url: 'https://docs.aws.amazon.com/', description: 'Official AWS documentation for all services.', isPrimary: true },
  { id: 'doc_cloud_002', topicId: 'cloud', title: 'Google Cloud Documentation', url: 'https://cloud.google.com/docs', description: 'Official Google Cloud documentation.', isPrimary: false },
  { id: 'doc_dep_001', topicId: 'deployment', title: 'Railway Documentation', url: 'https://docs.railway.app/', description: 'Official Railway platform documentation for deployments.', isPrimary: true },
  { id: 'doc_k8s_001', topicId: 'deployment', title: 'Kubernetes Documentation', url: 'https://kubernetes.io/docs/home/', description: 'Official Kubernetes documentation.', isPrimary: false },

  // ─── DSA ──────────────────────────────────────────────────
  { id: 'doc_dsa_001', topicId: 'dsa', title: 'LeetCode — Data Structures & Algorithms', url: 'https://leetcode.com/explore/learn/', description: 'Interactive DSA learning paths covering arrays, trees, graphs, and more.', isPrimary: true },
  { id: 'doc_dsa_002', topicId: 'dsa', title: 'NeetCode — DSA Roadmap', url: 'https://neetcode.io/roadmap', description: 'Structured DSA roadmap with curated problem sets.', isPrimary: false },

  // ─── UNSUPERVISED LEARNING ────────────────────────────────
  { id: 'doc_ul_001', topicId: 'unsupervised_learning', title: 'Scikit-learn Unsupervised Learning Guide', url: 'https://scikit-learn.org/stable/unsupervised_learning.html', description: 'Official reference for clustering, dimensionality reduction, and density estimation.', isPrimary: true },

  // ─── REGRESSION ───────────────────────────────────────────
  { id: 'doc_regression_001', topicId: 'regression', title: 'Scikit-learn Regression Guide', url: 'https://scikit-learn.org/stable/supervised_learning.html#generalized-linear-models', description: 'Generalized linear models — Ridge, Lasso, ElasticNet, and more.', isPrimary: true },

  // ─── SL CLASSIFICATION ────────────────────────────────────
  { id: 'doc_slcls_001', topicId: 'sl-classification', title: 'Scikit-learn Classification Guide', url: 'https://scikit-learn.org/stable/supervised_learning.html', description: 'Official guide to classification algorithms — SVM, trees, ensemble methods.', isPrimary: true },
  { id: 'doc_slcls_002', topicId: 'sl-classification', title: 'XGBoost Documentation', url: 'https://xgboost.readthedocs.io/en/stable/', description: 'Official XGBoost docs — installation, tutorials, and API reference.', isPrimary: false },

  // ─── CLUSTERING ───────────────────────────────────────────
  { id: 'doc_cluster_001', topicId: 'clustering', title: 'Scikit-learn Clustering Guide', url: 'https://scikit-learn.org/stable/modules/clustering.html', description: 'Official guide to K-Means, hierarchical, DBSCAN, and other clustering algorithms.', isPrimary: true },

  // ─── FEATURE ENGINEERING ──────────────────────────────────
  { id: 'doc_fe_001', topicId: 'feature_engineering', title: 'Scikit-learn Preprocessing Guide', url: 'https://scikit-learn.org/stable/modules/preprocessing.html', description: 'Scaling, encoding, imputation, and feature extraction in scikit-learn.', isPrimary: true },
  { id: 'doc_fe_002', topicId: 'feature_engineering', title: 'Feature Engineering for Machine Learning (Book)', url: 'https://www.oreilly.com/library/view/feature-engineering-for/9781491953235/', description: "O'Reilly book on practical feature engineering techniques.", isPrimary: false },

  // ─── CROSS VALIDATION ─────────────────────────────────────
  { id: 'doc_cv_001', topicId: 'cross_validation', title: 'Scikit-learn Cross-Validation Guide', url: 'https://scikit-learn.org/stable/modules/cross_validation.html', description: 'Official guide to cross-validation strategies including stratified and time-series CV.', isPrimary: true },

  // ─── HYPERPARAMETER TUNING ────────────────────────────────
  { id: 'doc_hp_001', topicId: 'hyperparameter_tuning', title: 'Scikit-learn Hyperparameter Tuning', url: 'https://scikit-learn.org/stable/modules/grid_search.html', description: 'GridSearchCV, RandomizedSearchCV, and Bayesian optimization in scikit-learn.', isPrimary: true },
  { id: 'doc_hp_002', topicId: 'hyperparameter_tuning', title: 'Optuna Documentation', url: 'https://optuna.readthedocs.io/en/stable/', description: 'Official Optuna docs for Bayesian hyperparameter optimization.', isPrimary: false },

  // ─── CNN BASICS ───────────────────────────────────────────
  { id: 'doc_cnn_001', topicId: 'cnn_basics', title: 'CS231n — Convolutional Neural Networks', url: 'https://cs231n.github.io/', description: 'Stanford CS231n course notes on CNNs for visual recognition.', isPrimary: true },
  { id: 'doc_cnn_002', topicId: 'cnn_basics', title: 'PyTorch CNN Tutorial', url: 'https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html', description: 'Official PyTorch tutorial for building and training a CNN.', isPrimary: false },

  // ─── RNN / LSTM BASICS ────────────────────────────────────
  { id: 'doc_rnn_001', topicId: 'rnn_lstm_basics', title: 'Understanding LSTM Networks — Colah\'s Blog', url: 'https://colah.github.io/posts/2015-08-Understanding-LSTMs/', description: 'The definitive visual guide to understanding LSTM networks.', isPrimary: true },
  { id: 'doc_rnn_002', topicId: 'rnn_lstm_basics', title: 'PyTorch RNN Tutorial', url: 'https://pytorch.org/tutorials/intermediate/char_rnn_classification_tutorial.html', description: 'Official PyTorch tutorial for character-level RNN classification.', isPrimary: false },

  // ─── TEXT CLASSIFICATION ──────────────────────────────────
  { id: 'doc_tc_nlp_001', topicId: 'text_classification', title: 'HuggingFace Text Classification Guide', url: 'https://huggingface.co/docs/transformers/tasks/sequence_classification', description: 'Official HuggingFace guide for fine-tuning models for text classification.', isPrimary: true },

  // ─── IMAGE PROCESSING ────────────────────────────────────
  { id: 'doc_imgproc_001', topicId: 'image_processing', title: 'OpenCV Documentation', url: 'https://docs.opencv.org/4.x/', description: 'Official OpenCV documentation for image processing operations.', isPrimary: true },
  { id: 'doc_imgproc_002', topicId: 'image_processing', title: 'Pillow (PIL) Documentation', url: 'https://pillow.readthedocs.io/en/stable/', description: 'Official Pillow docs for image manipulation in Python.', isPrimary: false },

  // ─── OCR ──────────────────────────────────────────────────
  { id: 'doc_ocr_001', topicId: 'ocr', title: 'Tesseract OCR Documentation', url: 'https://tesseract-ocr.github.io/tessdoc/', description: 'Official Tesseract OCR documentation.', isPrimary: true },
  { id: 'doc_ocr_002', topicId: 'ocr', title: 'EasyOCR GitHub', url: 'https://github.com/JaidedAI/EasyOCR', description: 'EasyOCR — ready-to-use OCR with 80+ language support.', isPrimary: false },

  // ─── OBJECT DETECTION ────────────────────────────────────
  { id: 'doc_od_001', topicId: 'object_detection_basics', title: 'YOLOv8 Documentation', url: 'https://docs.ultralytics.com/', description: 'Official Ultralytics YOLOv8 documentation for object detection.', isPrimary: true },
  { id: 'doc_od_002', topicId: 'object_detection_basics', title: 'TorchVision Object Detection Tutorial', url: 'https://pytorch.org/tutorials/intermediate/torchvision_tutorial.html', description: 'Official PyTorch tutorial on fine-tuning object detection models.', isPrimary: false },

  // ─── VISION LANGUAGE MODELS ──────────────────────────────
  { id: 'doc_vlm_001', topicId: 'vision_language_models', title: 'HuggingFace Vision-Language Models', url: 'https://huggingface.co/docs/transformers/index#multimodal-models', description: 'Official HuggingFace docs for multimodal and vision-language models.', isPrimary: true },
  { id: 'doc_vlm_002', topicId: 'vision_language_models', title: 'OpenAI Vision Guide', url: 'https://platform.openai.com/docs/guides/vision', description: 'Official OpenAI guide for using GPT-4o with image inputs.', isPrimary: false },

  // ─── MULTIMODAL BASICS ───────────────────────────────────
  { id: 'doc_mm_001', topicId: 'multimodal_basics', title: 'OpenAI Multimodal Guide', url: 'https://platform.openai.com/docs/guides/vision', description: 'Official OpenAI guide for multimodal inputs with GPT-4o.', isPrimary: true },

  // ─── RAG EVALUATION METRICS ──────────────────────────────
  { id: 'doc_rageval_001', topicId: 'rag_evaluation', title: 'RAGAS Documentation', url: 'https://docs.ragas.io/en/latest/', description: 'Official RAGAS docs — faithfulness, answer relevance, context precision, recall.', isPrimary: true },
  { id: 'doc_faith_001', topicId: 'faithfulness', title: 'RAGAS Faithfulness Metric', url: 'https://docs.ragas.io/en/latest/concepts/metrics/faithfulness.html', description: 'Official RAGAS docs explaining the faithfulness metric.', isPrimary: true },
  { id: 'doc_ar_001', topicId: 'answer_relevance', title: 'RAGAS Answer Relevance Metric', url: 'https://docs.ragas.io/en/latest/concepts/metrics/answer_relevance.html', description: 'Official RAGAS docs explaining the answer relevance metric.', isPrimary: true },
  { id: 'doc_cp_001', topicId: 'context_precision', title: 'RAGAS Context Precision Metric', url: 'https://docs.ragas.io/en/latest/concepts/metrics/context_precision.html', description: 'Official RAGAS docs explaining the context precision metric.', isPrimary: true },
  { id: 'doc_cr_001', topicId: 'context_recall', title: 'RAGAS Context Recall Metric', url: 'https://docs.ragas.io/en/latest/concepts/metrics/context_recall.html', description: 'Official RAGAS docs explaining the context recall metric.', isPrimary: true },
  { id: 'doc_gd_001', topicId: 'golden_datasets', title: 'RAGAS Test Set Generation', url: 'https://docs.ragas.io/en/latest/getstarted/testset_generation.html', description: 'Official RAGAS guide to generating golden datasets for evaluation.', isPrimary: true },
  { id: 'doc_rt_001', topicId: 'regression_testing', title: 'DeepEval Regression Testing', url: 'https://docs.confident-ai.com/docs/evaluation-regression-testing', description: 'Official DeepEval guide to regression testing for LLM applications.', isPrimary: true },
  { id: 'doc_ae_001', topicId: 'agent_evaluation', title: 'DeepEval Agent Evaluation', url: 'https://docs.confident-ai.com/docs/evaluation-introduction', description: 'Official DeepEval guide to evaluating AI agents.', isPrimary: true },

  // ─── MLOPS / LLMOPS ──────────────────────────────────────
  { id: 'doc_mv_001', topicId: 'model_versioning', title: 'MLflow Model Registry', url: 'https://mlflow.org/docs/latest/model-registry.html', description: 'Official MLflow docs for model versioning and registry.', isPrimary: true },
  { id: 'doc_dv_001', topicId: 'data_versioning', title: 'DVC Documentation', url: 'https://dvc.org/doc', description: 'Official DVC docs for data and model version control.', isPrimary: true },
  { id: 'doc_ms_001', topicId: 'model_serving', title: 'BentoML Documentation', url: 'https://docs.bentoml.com/', description: 'Official BentoML docs for model serving and deployment.', isPrimary: true },
  { id: 'doc_ms_002', topicId: 'model_serving', title: 'TorchServe Documentation', url: 'https://pytorch.org/serve/', description: 'Official TorchServe docs for serving PyTorch models in production.', isPrimary: false },
  { id: 'doc_obs_001', topicId: 'observability', title: 'LangSmith Observability', url: 'https://docs.smith.langchain.com/observability', description: 'Official LangSmith docs for LLM application observability and tracing.', isPrimary: true },
  { id: 'doc_tm_001', topicId: 'token_monitoring', title: 'OpenAI Usage Dashboard', url: 'https://platform.openai.com/usage', description: 'OpenAI platform dashboard for monitoring token usage and costs.', isPrimary: true },
  { id: 'doc_cm_001', topicId: 'cost_monitoring', title: 'OpenAI Cost Tracking Guide', url: 'https://platform.openai.com/docs/guides/production-best-practices', description: 'OpenAI production best practices including cost monitoring.', isPrimary: true },
  { id: 'doc_lm_001', topicId: 'latency_monitoring', title: 'Prometheus Documentation', url: 'https://prometheus.io/docs/introduction/overview/', description: 'Official Prometheus docs for latency and performance monitoring.', isPrimary: true },
  { id: 'doc_pv_001', topicId: 'prompt_versioning', title: 'LangSmith Prompt Hub', url: 'https://docs.smith.langchain.com/prompt-hub', description: 'Official LangSmith Prompt Hub docs for versioning and managing prompts.', isPrimary: true },
  { id: 'doc_ab_001', topicId: 'ab_testing', title: 'LangSmith A/B Testing', url: 'https://docs.smith.langchain.com/evaluation/tutorials/optimization', description: 'Official LangSmith guide to running A/B tests on LLM prompts.', isPrimary: true },

  // ─── AI SECURITY ──────────────────────────────────────────
  { id: 'doc_jb_001', topicId: 'jailbreaking', title: 'OWASP LLM Top 10 — Jailbreaking', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', description: 'OWASP guide covering jailbreaking and prompt injection risks.', isPrimary: true },
  { id: 'doc_dl_001', topicId: 'data_leakage', title: 'OWASP LLM — Sensitive Information Disclosure', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', description: 'OWASP coverage of data leakage and sensitive info disclosure in LLMs.', isPrimary: true },
  { id: 'doc_rp_001', topicId: 'rag_poisoning', title: 'OWASP LLM — RAG Poisoning', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', description: 'OWASP guide on vector/embedding and RAG poisoning attacks.', isPrimary: true },
  { id: 'doc_ta_001', topicId: 'tool_abuse', title: 'OWASP LLM — Excessive Agency', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', description: 'OWASP coverage of excessive agency and tool abuse risks in LLM agents.', isPrimary: true },
  { id: 'doc_as_001', topicId: 'authorization_security', title: 'OWASP LLM — Insecure Output Handling', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', description: 'OWASP guide on authorization and insecure output handling in LLM apps.', isPrimary: true },
];

/**
 * Helper: get all documentation links for a topic.
 */
export function getDocsForTopic(topicId) {
  return DOCUMENTATION.filter(d => d.topicId === topicId);
}
