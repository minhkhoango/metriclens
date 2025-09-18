<!-- src/components/ResultsPanel.svelte -->

<script lang="ts">
  import { calculationResults } from '../lib/stores';
</script>

<div class="panel-container">
  <h2>2. Calculated ROI</h2>
  {#if $calculationResults}
    <div class="results-grid">
      <div class="metric-card main-metric">
        <span class="label">Total ROI</span>
        <span class="value roi-value">{$calculationResults.totalROI}%</span>
      </div>
      <div class="metric-card">
        <span class="label">Engineering Hours Recaptured</span>
        <span class="value">{$calculationResults.hoursRecaptured}</span>
      </div>
      <div class="metric-card">
        <span class="label">Manual Interventions Avoided</span>
        <span class="value">{$calculationResults.manualInterventionsAvoided}</span>
      </div>
    </div>
    <div class="tooltip-container">
      <span class="tooltip-icon">?</span>
      <p>
        How is this calculated? ROI is based on cost savings from avoided manual
        interventions, minus a placeholder project investment cost of $5,000.
      </p>
    </div>
  {:else}
    <p class="placeholder-text">
      Upload your Braintrust JSON and KPI CSV to see the results.
    </p>
  {/if}
</div>

<style>
  .results-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr;
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
  .metric-card {
    border: 1px solid var(--bt-border-gray);
    border-radius: 8px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
  }
  .metric-card.main-metric {
    border-color: var(--bt-green);
  }
  .label {
    font-size: 14px;
    color: #666;
    margin-bottom: 0.5rem;
  }
  .value {
    font-size: 28px;
    font-weight: 500;
    color: var(--bt-dark-gray);
  }
  .roi-value {
    font-size: 42px;
    font-weight: 700;
    color: var(--bt-green);
  }
  .placeholder-text {
    color: #777;
    margin-top: 1.5rem;
    text-align: center;
    font-style: italic;
  }
  .tooltip-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1.5rem;
    background-color: #f0f0f0;
    border-radius: 4px;
    padding: 0.5rem 1rem;
  }
  .tooltip-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #ccc;
    color: white;
    text-align: center;
    font-weight: bold;
    line-height: 20px;
    font-size: 14px;
  }
  .tooltip-container p {
      font-size: 14px;
      margin: 0;
      color: #666;
  }
</style>