<!-- src/components/InputPanel.svelte -->

<script lang="ts">
  import { braintrustData, kpiData, costPerIntervention, hoursPerIntervention } from '../lib/stores';
  import { parseBraintrustJson, parseKpiCsv } from '../lib/parser';

  let braintrustFileName = 'No file chosen';
  let kpiFileName = 'No file chosen';
  let error: string | null = null;

  async function handleBraintrustUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      braintrustFileName = file.name;
      error = null;
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
  <h2>1. Provide Inputs</h2>
  <div class="input-grid">
    <!-- File Uploads -->
    <div class="input-group">
      <label for="braintrust-upload">Braintrust JSON Export</label>
      <div class="file-input-wrapper">
        <button on:click={() => document.getElementById('braintrust-upload')?.click()}>
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
        <button on:click={() => document.getElementById('kpi-upload')?.click()}>
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
</div>

<style>
  .input-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 1.5rem;
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
  input[type="number"] {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--bt-border-gray);
    border-radius: 4px;
    font-size: 16px;
    box-sizing: border-box;
  }
  .error-message {
    margin-top: 1rem;
    color: #D8000C;
    background-color: #FFD2D2;
    border: 1px solid #D8000C;
    border-radius: 4px;
    padding: 0.75rem;
  }
</style>
