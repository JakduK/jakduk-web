<template>
  <div></div>
</template>

<script>
  import Highcharts from 'highcharts/highcharts.src'
  import HighchartsExporting from 'highcharts/modules/exporting.src'

  HighchartsExporting(Highcharts);

  function updateChart() {
    this.chart = new Highcharts.Chart(this.$el, this.options);
    if (!this.isEmptyArray(this.series)) {
      this.series.forEach(serie => {
        this.chart.addSeries(serie);
      });
    }
  }

  export default {
    props: {
      options: {
        type: Object,
        required: true
      },
      series: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    mounted() {
      updateChart.call(this);
    },
    watch: {
      options: {
        handler() {
          this.chart.destroy();
          updateChart.call(this);
        },
        deep: true
      },
      series: {
        handler(seriesData) {
          this.chart.destroy();
          updateChart.call(this);
        },
        deep: true
      }
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.destroy();
      }
    }
  };
</script>
