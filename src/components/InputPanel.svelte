<!-- src/components/InputPanel.svelte -->

<script lang="ts">
  import { braintrustData, kpiData, costPerIntervention, hoursPerIntervention } from '../lib/stores';
  import { parseBraintrustJson, parseKpiCsv } from '../lib/parser';
  import { loadAllSampleData } from '../lib/sample-loader';

  let braintrustFileName = 'No file chosen';
  let kpiFileName = 'No file chosen';
  let error: string | null = null;
  let useSampleData = false;
  let isLoadingSample = false;

  async function handleToggleSampleData() {
    isLoadingSample = true;
    error = null;
    if (useSampleData) {
      try {
        const samples = await loadAllSampleData();
        braintrustData.set(samples.braintrust);
        kpiData.set(samples.kpi);
        braintrustFileName = 'sample.json';
        kpiFileName = 'sample.csv';
      } catch (e) {
        error = e instanceof Error ? e.message : 'Failed to load sample data.';
        braintrustData.set(null);
        kpiData.set(null);
        useSampleData = false; // Toggle back on error
      }
    } else {
      // Clear data when toggling off
      braintrustData.set(null);
      kpiData.set(null);
      braintrustFileName = 'No file chosen';
      kpiFileName = 'No file chosen';
    }
    isLoadingSample = false;
  }

  async function handleBraintrustUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      braintrustFileName = file.name;
      error = null;
      useSampleData = false; // Disable sample data on manual upload
      try {
        const data = await parseBraintrustJson(file);
        braintrustData.set(data);
      } catch (e) {
        error = e instanceof Error ? e.message : 'Failed to parse JSON file.';
        braintrustData.set(null);
      }
    }
  }

  async function handleKpiUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      kpiFileName = file.name;
      error = null;
      useSampleData = false; // Disable sample data on manual upload
      try {
        const data = await parseKpiCsv(file);
        kpiData.set(data);
      } catch (e) {
        error = e instanceof Error ? e.message : 'Failed to parse CSV file.';
        kpiData.set(null);
      }
    }
  }
</script>

<div class="panel-container">
  <div class="panel-header">
    <h2>1. Provide Inputs</h2>
    <div class="sample-toggle-wrapper">
      <label for="sample-toggle">Use Sample Data</label>
      <input type="checkbox" id="sample-toggle" bind:checked={useSampleData} on:change={handleToggleSampleData} />
      <label for="sample-toggle" class="toggle-switch"></label>
    </div>
  </div>

  <div class="input-grid" class:disabled={useSampleData || isLoadingSample}>
    <!-- File Uploads -->
    <div class="input-group">
      <label for="braintrust-upload">Braintrust JSON Export</label>
      <div class="file-input-wrapper">
        <button on:click={() => document.getElementById('braintrust-upload')?.click()} disabled={useSampleData}>
          Upload File
        </button>
        <span class="file-name">{braintrustFileName}</span>
      </div>
      <input
        type="file"
        id="braintrust-upload"
        accept=".json"
        on:change={handleBraintrustUpload}
        hidden
      />
    </div>

    <div class="input-group">
      <label for="kpi-upload">Business KPI CSV</label>
      <div class="file-input-wrapper">
        <button on:click={() => document.getElementById('kpi-upload')?.click()} disabled={useSampleData}>
          Upload File
        </button>
        <span class="file-name">{kpiFileName}</span>
      </div>
      <input
        type="file"
        id="kpi-upload"
        accept=".csv"
        on:change={handleKpiUpload}
        hidden
      />
    </div>

    <!-- Cost Inputs -->
    <div class="input-group">
      <label for="cost-input">Cost per Manual Intervention ($)</label>
      <input
        id="cost-input"
        type="number"
        bind:value={$costPerIntervention}
        placeholder="e.g., 150"
      />
    </div>
    
    <div class="input-group">
      <label for="hours-input">Hours Saved per Intervention</label>
      <input
        id="hours-input"
        type="number"
        bind:value={$hoursPerIntervention}
        placeholder="e.g., 2"
      />
    </div>
  </div>

  {#if error}
    <div class="error-message">{error}</div>
  {/if}
  {#if isLoadingSample}
    <div class="loading-message">Loading sample data...</div>
  {/if}
</div>

<style>
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .sample-toggle-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
  }
  .sample-toggle-wrapper label {
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
  #sample-toggle {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }
  .toggle-switch {
    width: 40px;
    height: 22px;
    background-color: #ccc;
    border-radius: 11px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .toggle-switch::before {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    background-color: white;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    transition: transform 0.2s;
  }
  #sample-toggle:checked + .toggle-switch {
    background-color: var(--bt-green);
  }
  #sample-toggle:checked + .toggle-switch::before {
    transform: translateX(18px);
  }

  .input-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 1.5rem;
    transition: opacity 0.3s;
  }
  .input-grid.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  .input-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 14px;
  }
  .file-input-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .file-name {
    font-size: 14px;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  button {
    background-color: var(--bt-green);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  button:hover {
    background-color: #089408;
  }
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  input[type="number"] {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--bt-border-gray);
    border-radius: 4px;
    font-size: 16px;
    box-sizing: border-box;
  }
  .error-message, .loading-message {
    margin-top: 1rem;
    color: #D8000C;
    background-color: #FFD2D2;
    border: 1px solid #D8000C;
    border-radius: 4px;
    padding: 0.75rem;
  }
  .loading-message {
    color: #00529B;
    background-color: #BDE5F8;
    border-color: #00529B;
  }
</style>