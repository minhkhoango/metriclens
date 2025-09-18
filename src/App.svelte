<!-- src/App.svelte -->

<script lang="ts">
  import InputPanel from './components/InputPanel.svelte';
  import ResultsPanel from './components/ResultsPanel.svelte';
  // VisualizationPanel will be implemented in Sprint 2
  // import VisualizationPanel from './components/VisualizationPanel.svelte';
  import './styles/app.css';
</script>

<main>
  <header>
    <h1>MetricLens</h1>
    <p>A self-serve calculator to prove the ROI of your Braintrust experiments.</p>
  </header>
  
  <InputPanel />
  <ResultsPanel />
  
  <!-- The visualization panel is part of Sprint 2 (Day 7) -->
  <!-- <VisualizationPanel /> -->

</main>

<style>
  main {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }

  header {
    text-align: center;
    margin-bottom: 2rem;
  }

  header p {
    font-size: 18px;
    max-width: 500px;
    margin: 0.5rem auto 0;
    color: #666;
  }
</style>