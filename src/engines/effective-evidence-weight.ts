import type { Evidence } from "../models/evidence.js";
import {
  calculateEvidenceDependency
} from "./evidence-dependency.js";

export type EffectiveEvidenceWeight = Evidence & {
  informationWeight: number;
  dependencyWeight: number;
  effectiveWeight: number;
  effectiveConfidence: number;
};

export function calculateEffectiveEvidenceWeights(
  evidence: Evidence[],
  informationWeights: Map<string, number>
): EffectiveEvidenceWeight[] {
  return evidence.map((item) => {
    const informationWeight =
      informationWeights.get(item.id) ?? 1;

    const dependencyResult =
      calculateEvidenceDependency(
        evidence,
        item
      );

    const dependencyWeight =
      dependencyResult.adjustedWeight;

    const effectiveWeight =
      informationWeight *
      dependencyWeight;

    const effectiveConfidence =
      item.confidence *
      effectiveWeight;

    return {
      ...item,
      informationWeight,
      dependencyWeight,
      effectiveWeight,
      effectiveConfidence
    };
  });
}

export function createInformationWeightMap(
  weights: Array<{
    id: string;
    informationWeight: number;
  }>
): Map<string, number> {
  return new Map(
    weights.map((item) => [
      item.id,
      item.informationWeight
    ])
  );
}