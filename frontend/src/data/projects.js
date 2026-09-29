/**
 * projects.js — Phase projects and final capstone.
 *
 * Each phase has one project. References phaseId from phases.js.
 * Do NOT put projects inside learningData.js or topics.js.
 */

export const PROJECTS = [
  {
    id: 'proj_foundations',
    phaseId: '01_FOUNDATIONS',
    isCapstone: false,
    title: 'Data ETL Pipeline',
    description: 'Build a robust pipeline that extracts data from a public REST API, transforms it using Pandas, and loads it into a PostgreSQL database.',
    problemStatement: 'You work at a startup and need to build a repeatable data pipeline that ingests external data, transforms it, and loads it into the database daily.',
    requirements: [
      'Fetch data from a public API (e.g. OpenWeather, JSONPlaceholder)',
      'Clean and transform using Pandas',
      'Load into PostgreSQL using psycopg2 or SQLAlchemy',
      'Use OOP design with a Pipeline class',
      'Dockerize with docker-compose',
      'Add GitHub Actions CI to run tests',
    ],
    recommendedStack: ['Python', 'Pandas', 'PostgreSQL', 'Docker', 'GitHub Actions'],
    features: ['Automated fetching', 'Data cleaning', 'SQL insertion'],
    learningObjectives: ['REST API interaction', 'Data manipulation', 'Containerization basics'],
    milestones: ['Fetch data', 'Clean data', 'DB schema design', 'Dockerize', 'CI/CD'],
    difficulty: 'beginner',
    estimatedHours: 20,
    githubRequired: true,
    liveDemoRequired: false,
    submissionRequirements: ['GitHub URL', 'README with setup and run instructions'],
  },
  {
    id: 'proj_ml',
    phaseId: '02_MACHINE_LEARNING',
    isCapstone: false,
    title: 'ML Model Pipeline with Scikit-learn',
    description: 'Build an end-to-end ML pipeline: data cleaning → feature engineering → model training → evaluation → saved model artifact.',
    problemStatement: 'Train, evaluate, and save a classification model on a real dataset.',
    requirements: [
      'Load and clean a public dataset (Kaggle or UCI)',
      'Engineer at least 3 new features',
      'Train and compare 3 different models',
      'Cross-validate with K-Fold',
      'Save best model with joblib',
      'Document results in a markdown report',
    ],
    recommendedStack: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib'],
    features: ['Data pipeline', 'Model comparison', 'Evaluation report'],
    learningObjectives: ['Full ML workflow', 'Model evaluation', 'Reproducibility'],
    milestones: ['Data loading', 'EDA', 'Feature engineering', 'Training', 'Evaluation', 'Report'],
    difficulty: 'intermediate',
    estimatedHours: 25,
    githubRequired: true,
    liveDemoRequired: false,
    submissionRequirements: ['GitHub URL with notebook', 'README with results'],
  },
  {
    id: 'proj_rag',
    phaseId: '06_GENERATIVE_AI',
    isCapstone: false,
    title: 'Production RAG Application',
    description: 'Build a full RAG application with a document ingestion pipeline, vector storage, and a FastAPI Q&A API.',
    problemStatement: 'Build a private knowledge base assistant that answers questions about uploaded documents.',
    requirements: [
      'Document loader supporting PDF and TXT',
      'Recursive + semantic chunking',
      'Embed with OpenAI text-embedding-3-small',
      'Store in ChromaDB or Qdrant',
      'FastAPI /ask endpoint with streaming',
      'Basic evaluation with RAGAS metrics',
      'Docker Compose setup',
    ],
    recommendedStack: ['Python', 'LangChain', 'ChromaDB', 'FastAPI', 'Docker'],
    features: ['Multi-format ingestion', 'Streaming Q&A', 'Evaluation metrics'],
    learningObjectives: ['Full RAG pipeline', 'API design', 'Basic evaluation'],
    milestones: ['Ingestion pipeline', 'Vector store setup', 'API endpoint', 'Evaluation', 'Deployment'],
    difficulty: 'intermediate',
    estimatedHours: 35,
    githubRequired: true,
    liveDemoRequired: false,
    submissionRequirements: ['GitHub URL', 'README with demo instructions'],
  },
  {
    id: 'proj_evaluation',
    phaseId: '07_AI_EVALUATION',
    isCapstone: false,
    title: 'Automated Evaluation Framework',
    description: 'Build an automated evaluation suite that scores your RAG application across faithfulness, relevance, and precision.',
    problemStatement: 'Your team needs a repeatable way to evaluate and compare RAG system changes.',
    requirements: [
      'Create a golden test dataset of 50 Q&A pairs',
      'Implement evaluation with RAGAS (faithfulness, answer relevance, context precision)',
      'Run LLM-as-Judge scoring for qualitative criteria',
      'Store results in JSON and visualize with matplotlib',
      'Add CI step that fails if scores drop below threshold',
    ],
    recommendedStack: ['Python', 'RAGAS', 'OpenAI', 'GitHub Actions'],
    features: ['Golden dataset', 'Automated metrics', 'CI integration'],
    learningObjectives: ['Systematic evaluation', 'Regression prevention', 'CI for AI'],
    milestones: ['Dataset creation', 'RAGAS integration', 'LLM-as-Judge', 'Reporting', 'CI step'],
    difficulty: 'intermediate',
    estimatedHours: 20,
    githubRequired: true,
    liveDemoRequired: false,
    submissionRequirements: ['GitHub URL', 'README with evaluation results'],
  },
  {
    id: 'proj_capstone',
    phaseId: '10_PRODUCTION_AI',
    isCapstone: true,
    title: 'Final Capstone: Production AI Agent Platform',
    description: 'Build a complete, scalable, and secure AI agent system with RAG capabilities, agentic reasoning, and production-grade infrastructure.',
    problemStatement: 'Build an enterprise-grade AI assistant that can answer questions from a private knowledge base, execute tools, maintain conversation memory, and operate safely in production.',
    requirements: [
      'LLM backbone with OpenAI or Anthropic API',
      'RAG with pgvector (PostgreSQL) as vector store',
      'LangGraph multi-step agent with tool calling',
      'MCP server integration for tool extensibility',
      'Input/output guardrails (prompt injection protection, PII detection)',
      'FastAPI with async streaming + Pydantic validation + JWT auth',
      'Redis caching for repeated queries',
      'RAGAS evaluation pipeline',
      'Docker Compose + GitHub Actions CI/CD',
      'Deployment to Railway / Render / Fly.io',
    ],
    recommendedStack: [
      'FastAPI', 'LangGraph', 'PostgreSQL + pgvector',
      'Redis', 'Docker', 'GitHub Actions', 'OpenAI/Anthropic',
    ],
    features: [
      'Streaming responses', 'Agentic planning', 'Secure execution',
      'Production monitoring', 'Evaluation pipeline',
    ],
    learningObjectives: ['Combine all roadmap skills into a production-ready system'],
    milestones: [
      'System Design & Architecture Diagram',
      'Core Agent + Tools',
      'RAG Integration',
      'API Layer + Auth',
      'Security & Guardrails',
      'Evaluation Pipeline',
      'CI/CD + Deployment',
    ],
    difficulty: 'advanced',
    estimatedHours: 80,
    githubRequired: true,
    liveDemoRequired: true,
    submissionRequirements: [
      'GitHub URL',
      'Live Demo URL',
      'Architecture Diagram in README',
    ],
  },
];

export const PROJECT_MAP = Object.fromEntries(PROJECTS.map(p => [p.id, p]));

export function getProjectForPhase(phaseId) {
  return PROJECTS.find(p => p.phaseId === phaseId && !p.isCapstone) ?? null;
}

export function getCapstoneProject() {
  return PROJECTS.find(p => p.isCapstone) ?? null;
}
