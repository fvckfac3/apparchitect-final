export type DocumentType = 'master' | 'agent' | 'collaboration' | 'setup';

export interface Document {
	id: string;
	type: DocumentType;
	title: string;
	subtitle?: string;
	content: string;
	agentId?: string;
	generatedAt: Date;
}

export interface DocumentSection {
	id: string;
	title: string;
	content: string;
}

export interface GeneratedDocuments {
	masterContext: Document | null;
	agentPRDs: Document[];
	collaborationMap: Document | null;
	setupGuide: Document | null;
}

export type GenerationStatus = 'idle' | 'generating' | 'complete' | 'error';
