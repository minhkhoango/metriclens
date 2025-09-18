// src/lib/stores.ts

import { writable, derived } from 'svelte/store';
import type { BraintrustData, KpiDataPoint } from './parser';
import { calculateMetrics, type CalculationResults } from './calculator';

// --- RAW DATA STORES ---

// Holds the parsed Braintrust JSON data
export const braintrustData = writable<BraintrustData[] | null>(null);

// Holds the parsed KPI CSV data
export const kpiData = writable<KpiDataPoint[] | null>(null);

// Holds the user-provided cost inputs
export const costPerIntervention = writable<number>(150); // Default value
export const hoursPerIntervention = writable<number>(2);  // Default value


// --- DERIVED STORES ---

// A derived store that automatically recalculates when any of its dependencies change.
// This is the "magic" of Svelte's reactivity.
export const calculationResults = derived<
  [typeof braintrustData, typeof kpiData, typeof costPerIntervention, typeof hoursPerIntervention],
  CalculationResults | null
>(
  [braintrustData, kpiData, costPerIntervention, hoursPerIntervention],
  ([$braintrustData, $kpiData, $costPerIntervention, $hoursPerIntervention]) => {
    
    // This function runs whenever the data in the source stores changes.
    return calculateMetrics({
      braintrustData: $braintrustData,
      kpiData: $kpiData,
      costPerIntervention: $costPerIntervention,
      hoursPerIntervention: $hoursPerIntervention,
    });
  }
);