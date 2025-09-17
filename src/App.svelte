<script lang="ts">
  import InputPanel from "./components/InputPanel.svelte";
  import ResultsPanel from "./components/ResultsPanel.svelte";
  import VisualizationPanel from "./components/VisualizationPanel.svelte";
  import "./styles/app.css";
</script>

<main>
  <h1>MetricLens</h1>
  <p>Self-serve ROI for Braintrust experiments.</p>

  <!-- Placeholder components will be fleshed out in subsequent days -->
  <InputPanel />
  <ResultsPanel />
  <VisualizationPanel />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    color: #333;
    font-size: 2.5em;
    font-weight: 500;
  }
</style>
