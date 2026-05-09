/**
 * Team Brain — input types for the KG data adapter.
 *
 * Shapes returned by the knowledgeGraphRouter that feed into
 * transformKGToGraph.
 */

export interface KGEntityInput {
  id: string;
  entityType: string;
  name: string;
  canonicalId?: string;
  properties: Record<string, unknown>;
  sourceType: string;
  sourceRef?: string;
  createdAt: string | Date;
}

export interface KGRelationshipInput {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationType: string;
  properties: Record<string, unknown>;
  weight: number;
  sourceType: string;
  sourceName?: string;
  sourceTypeLabel?: string;
  targetName?: string;
  targetTypeLabel?: string;
  createdAt: string | Date;
}

export interface KGMemoryInput {
  id: string;
  scope: string;
  scopeId: string;
  category: string;
  content: string;
  properties: Record<string, unknown>;
  createdAt: string | Date;
}

export interface IntelligenceEntry {
  id: string;
  releaseId: string;
  trackId?: string;
  sourceType: "automated" | "manual";
  category: string;
  subcategory?: string;
  title: string;
  description?: string;
  metricValue?: number;
  metricUnit?: string;
  deltaPercent?: number;
  countryCode?: string;
  platform?: string;
  externalUrl?: string;
  impactScore: number;
  sentiment?: "positive" | "neutral" | "negative";
  recommendedAction?: string;
  actionUrgency?: string;
  actionTaken: boolean;
  isPinned: boolean;
  isRead: boolean;
  occurredAt: string;
  sourceName?: string;
}
