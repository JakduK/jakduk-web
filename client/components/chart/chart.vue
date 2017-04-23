<template>
  <div></div>
</template>

<script>
  import $ from 'jquery';
  import Highcharts from 'highcharts/highcharts.src'
  import HighchartsExporting from 'highcharts/modules/exporting.src'

  HighchartsExporting(Highcharts);

  function refreshChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Highcharts.Chart(this.$el, this.options, chart => {
      if (!this.isEmptyArray(this.series)) {
        this.series.forEach(series => {
          chart.addSeries(series);
        });
      }

      this.$emit('on-chart-created', chart);
    });
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
    watch: {
      options: {
        handler() {
          refreshChart.call(this);
        },
        deep: true
      },
      series: {
        handler(newSeries) {
          if (this.isEmptyArray(newSeries)) {
            this.chart.series.forEach(series => {
              series.remove(true, true);
            });
          } else {
            let index = 0;
            newSeries.forEach(series => {
              if (this.chart.series[index]) {
                this.chart.series[index].update(series, true);
              } else {
                this.chart.addSeries(series, true, true);
              }
              index++;
            });

            for (let start = index; start < this.chart.series.length; start++) {
              this.chart.series[start].remove(true, true);
            }
          }
        },
        deep: true
      }
    },
    mounted() {
      refreshChart.call(this);
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.destroy();
      }
    }
  };
</script>
