// src/lib/calculator.ts
import type { BraintrustData, KpiDataPoint } from './parser';

export interface CalculationInputs {
  braintrustData: BraintrustData[] | null;
  kpiData: KpiDataPoint[] | null;
  costPerIntervention: number;
  hoursPerIntervention: number;
}

export interface CalculationResults {
  totalROI: number;
  hoursRecaptured: number;
  manualInterventionsAvoided: number;
  correlationData: { date: string; braintrustScore: number; kpiValue: number }[];
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
  
  // For this MVP, we simplify: we assume a direct relationship.
  // A real version would need more sophisticated time-series alignment.
  // We'll simulate "interventions avoided" as being related to the improvement in the KPI.

  const initialKpi = kpiData[0].value;
  const finalKpi = kpiData[kpiData.length - 1].value;
  
  // Let's assume the KPI is something where a higher value is better (e.g., user retention).
  // And every 1% improvement avoids 10 manual interventions. This is a placeholder assumption.
  const kpiImprovementPercentage = ((finalKpi - initialKpi) / initialKpi) * 100;

  // Avoid negative interventions if KPI decreased
  const manualInterventionsAvoided = Math.max(0, Math.round(kpiImprovementPercentage * 10)); 

  const totalCostSavings = manualInterventionsAvoided * costPerIntervention;
  const hoursRecaptured = manualInterventionsAvoided * hoursPerIntervention;
  
  // For the MVP, we'll define the "investment" as a fixed placeholder.
  // A real app would let the user input this.
  const totalInvestment = 5000; // Placeholder for cost of Braintrust, eng time, etc.
  
  const totalROI = totalInvestment > 0 ? ((totalCostSavings - totalInvestment) / totalInvestment) * 100 : 0;
  
  // Mock correlation data for the chart
  const correlationData = kpiData.map((kpi, index) => ({
    date: kpi.date,
    // Just picking a score for simplicity. A real app would align this by date.
    braintrustScore: braintrustData[0]?.scores?.factuality ?? 0.5 + (index/kpiData.length) * 0.4, 
    kpiValue: kpi.value
  }));


  return {
    totalROI: parseFloat(totalROI.toFixed(2)),
    hoursRecaptured: parseFloat(hoursRecaptured.toFixed(2)),
    manualInterventionsAvoided,
    correlationData,
  };
}