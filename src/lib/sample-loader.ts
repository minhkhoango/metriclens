// src/lib/sample-loader.ts

import { parseBraintrustJson, parseKpiCsv } from './parser';
import type { BraintrustData, KpiDataPoint } from './parser';

/**
 * Fetches and parses the sample Braintrust JSON data from the public folder.
 * @returns A promise that resolves to the parsed BraintrustData array.
 */
async function loadSampleBraintrustData(): Promise<BraintrustData[]> {
  const response = await fetch('/sample.json');
  if (!response.ok) {
    throw new Error('Failed to fetch sample.json');
  }
  const blob = await response.blob();
  const file = new File([blob], 'sample.json', { type: 'application/json' });
  return parseBraintrustJson(file);
}

/**
 * Fetches and parses the sample KPI CSV data from the public folder.
 * @returns A promise that resolves to the parsed KpiDataPoint array.
 */
async function loadSampleKpiData(): Promise<KpiDataPoint[]> {
  const response = await fetch('/sample.csv');
  if (!response.ok) {
    throw new Error('Failed to fetch sample.csv');
  }
  const blob = await response.blob();
  const file = new File([blob], 'sample.csv', { type: 'text/csv' });
  return parseKpiCsv(file);
}

/**
 * Loads both sample data files in parallel and returns them.
 * @returns A promise that resolves to an object containing both datasets.
 */
export async function loadAllSampleData(): Promise<{
  braintrust: BraintrustData[];
  kpi: KpiDataPoint[];
}> {
  const [braintrust, kpi] = await Promise.all([
    loadSampleBraintrustData(),
    loadSampleKpiData(),
  ]);
  return { braintrust, kpi };
}