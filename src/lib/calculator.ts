// src/lib/calculator.ts
import type { BraintrustData, KpiDataPoint } from './parser';

export interface CalculationInputs {
  braintrustData: BraintrustData[] | null;
  kpiData: KpiDataPoint[] | null;
  costPerIntervention: number;
  hoursPerIntervention: number;
}

export interface ChartDataPoint {
  date: string;
  braintrustScore: number | null;
  kpiValue: number | null;
}

export interface CalculationResults {
  totalROI: number;
  hoursRecaptured: number;
  manualInterventionsAvoided: number;
  chartData: ChartDataPoint[];
}

/**
 * The core calculation engine for MetricLens.
 * @param inputs - The parsed data and user-provided costs.
 * @returns An object containing the calculated ROI and supporting metrics.
 */
export function calculateMetrics(inputs: CalculationInputs): CalculationResults | null {
  const { braintrustData, kpiData, costPerIntervention, hoursPerIntervention } = inputs;

  if (!braintrustData || !kpiData || braintrustData.length === 0 || kpiData.length === 0) {
    return null;
  }

  // --- ROI Calculation ---
  const initialKpi = kpiData[0].value;
  const finalKpi = kpiData[kpiData.length - 1].value;
  const kpiImprovementPercentage = ((finalKpi - initialKpi) / initialKpi) * 100;
  const manualInterventionsAvoided = Math.max(0, Math.round(kpiImprovementPercentage * 10));
  const totalCostSavings = manualInterventionsAvoided * costPerIntervention;
  const hoursRecaptured = manualInterventionsAvoided * hoursPerIntervention;
  const totalInvestment = 5000; // Placeholder investment cost
  const totalROI = totalInvestment > 0 ? ((totalCostSavings - totalInvestment) / totalInvestment) * 100 : 0;
  
  // --- Chart Data Correlation ---
  // Create a map of Braintrust scores by date for efficient lookup.
  const scoreMap = new Map<string, number>();
  // We'll use the 'factuality' score as the primary technical metric.
  braintrustData.forEach(exp => {
    const date = exp.created.split('T')[0]; // Get YYYY-MM-DD from ISO string
    scoreMap.set(date, exp.scores.factuality);
  });

  let lastSeenScore = braintrustData[0].scores.factuality;
  const chartData = kpiData.map(kpiPoint => {
    if (scoreMap.has(kpiPoint.date)) {
      lastSeenScore = scoreMap.get(kpiPoint.date)!;
    }
    return {
      date: kpiPoint.date,
      braintrustScore: lastSeenScore,
      kpiValue: kpiPoint.value,
    };
  });

  return {
    totalROI: parseFloat(totalROI.toFixed(2)),
    hoursRecaptured: parseFloat(hoursRecaptured.toFixed(2)),
    manualInterventionsAvoided,
    chartData,
  };
}