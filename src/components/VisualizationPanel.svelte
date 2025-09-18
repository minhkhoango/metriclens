<!-- src/components/VisualizationPanel.svelte -->

<script lang="ts">
  import { Line } from 'svelte-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    type ChartOptions,
    type ChartData,
    type Point,
  } from 'chart.js';
  import { calculationResults } from '../lib/stores';

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale
  );

  let chartData: ChartData<'line', (number | Point)[], unknown>;
  let chartOptions: ChartOptions<'line'>;

  // Reactive statement that rebuilds the chart data whenever the results change.
  $: if ($calculationResults) {
    const labels = $calculationResults.chartData.map(d => d.date);
    
    chartData = {
      labels,
      datasets: [
        {
          label: 'Business KPI',
          data: $calculationResults.chartData.map(d => d.kpiValue ?? 0),
          borderColor: '#444444',
          backgroundColor: '#444444',
          yAxisID: 'y',
          tension: 0.1,
        },
        {
          label: 'Braintrust Score',
          data: $calculationResults.chartData.map(d => d.braintrustScore ?? 0),
          borderColor: '#0AAD0A',
          backgroundColor: '#0AAD0A',
          yAxisID: 'y1',
          stepped: true, // Key feature: shows score changes as discrete steps
        },
      ],
    };

    chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Business KPI Value'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Braintrust Score'
          },
          grid: {
            drawOnChartArea: false, // only draw grid for main axis
          },
          min: 0,
          max: 1
        },
      },
    };
  }
</script>

<div class="panel-container">
  <h2>3. Correlation Timeline</h2>
  <div class="chart-wrapper">
    {#if $calculationResults}
      <Line data={chartData} options={chartOptions} />
    {:else}
      <p class="placeholder-text">
        Upload data to visualize the correlation.
      </p>
    {/if}
  </div>
</div>

<style>
  .chart-wrapper {
    height: 400px;
    position: relative;
    margin-top: 1.5rem;
  }
  .placeholder-text {
    color: #777;
    text-align: center;
    font-style: italic;
    padding-top: 5rem;
  }
</style>