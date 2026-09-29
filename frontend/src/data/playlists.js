/**
 * CENTRALIZED PLAYLISTS DATABASE
 * ============================================================
 * Playlists are SUPPLEMENTARY — for learners who prefer to
 * follow a structured course over individual topic videos.
 *
 * URL CONVENTION:
 *   Set url to RESOURCE_URL_PENDING until a real, verified URL is added.
 * ============================================================
 */

export const PLAYLISTS = [
  {
    id: 'pl_python_001',
    topicId: 'python',
    title: 'Python for Everybody',
    channel: 'Dr. Chuck / University of Michigan',
    url: 'https://www.youtube.com/watch?v=8DvywoWv6fI&list=PLlRFEj9H3Oj7Bp8-DfGpfAfDBiblRfl5p',
    description: 'Full beginner course covering Python from scratch.',
  },
  {
    id: 'pl_python_002',
    topicId: 'python',
    title: 'Intermediate Python — Corey Schafer',
    channel: 'Corey Schafer',
    url: 'https://www.youtube.com/watch?v=YYXdXT2l-Gg&list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU',
    description: 'Decorators, generators, itertools, logging, threading.',
  },
  {
    id: 'pl_ml_001',
    topicId: 'ml_fundamentals',
    title: 'Machine Learning Specialization',
    channel: 'Andrew Ng / DeepLearning.AI',
    url: 'https://www.youtube.com/watch?v=jGwO_UgTS7I&list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU',
    description: 'The definitive ML course — regression, classification, neural networks, recommenders.',
  },
  {
    id: 'pl_dl_001',
    topicId: 'pytorch',
    title: 'PyTorch for Deep Learning — Zero to Mastery',
    channel: 'Daniel Bourke',
    url: 'https://www.youtube.com/watch?v=Z_ikDlimN6A',
    description: 'Comprehensive PyTorch: tensors to custom models to deployment.',
  },
  {
    id: 'pl_transformers_001',
    topicId: 'transformers',
    title: 'HuggingFace NLP Course',
    channel: 'HuggingFace',
    url: 'https://www.youtube.com/watch?v=00GKzGyWFEs&list=PLo2EIpI_JMQvWfQndUesu0nPBAtZ9gP1o',
    description: 'Tokenizers, models, fine-tuning, pipelines — all with HuggingFace.',
  },
  {
    id: 'pl_rag_001',
    topicId: 'rag',
    title: 'RAG From Scratch — LangChain Series',
    channel: 'LangChain',
    url: 'https://www.youtube.com/watch?v=wd7TZ4w1mSw&list=PLfaIDFEXuae2LXbO1_PKyVJiQ23ZztA0x',
    description: 'Complete RAG playlist: indexing, retrieval, generation, and advanced techniques.',
  },
  {
    id: 'pl_agents_001',
    topicId: 'ai_agents',
    title: 'Build AI Agents with LangChain',
    channel: 'LangChain',
    url: 'RESOURCE_URL_PENDING',
    description: 'Full agents playlist from tool calling to production multi-agent systems.',
  },
  {
    id: 'pl_fastapi_001',
    topicId: 'fastapi',
    title: 'FastAPI Full Course',
    channel: 'Amigoscode',
    url: 'https://www.youtube.com/watch?v=iWS9ogMPOI0',
    description: 'Full FastAPI course with databases, auth, and deployment.',
  },
  {
    id: 'pl_docker_001',
    topicId: 'docker',
    title: 'Docker for Developers',
    channel: 'TechWorld with Nana',
    url: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
    description: 'Containers, compose, networking, volumes, and Docker in CI/CD.',
  },
];

/**
 * Helper: get all playlists for a specific topic.
 */
export function getPlaylistsForTopic(topicId) {
  return PLAYLISTS.filter(p => p.topicId === topicId);
}
