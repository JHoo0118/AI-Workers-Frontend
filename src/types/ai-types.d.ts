export type ErdGenereateOutputs = {
  image: string;
};

export type CodeConvertGenereateOutputs = {
  result: string;
};

export type ApiGenGenerateOutputs = {
  backendCode: string;
};

export type SeqDiagramGenerateOutputs = ErdGenereateOutputs;

export type SqlToEntityOutputs = {
  result: string;
};

export type AlgorithmAdviceGenerateOutputs = {
  result: string;
};

export type DocsServeAgentEmbedOutputs = {
  path: string;
};

export type DocsServeAgentOutputs = {
  content: DocsServeAgentResponse[];
};

type DocsServeAgentResponse = {
  page: string;
  summary: string;
};
