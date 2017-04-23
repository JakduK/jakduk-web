<template>
  <div class="ui segment">
    <div class="ui two blue item pointing secondary menu">
      <router-link :to="{name: 'stats.supporters', query: {chartType: 'bar'}}" :class="{active: $route.query.chartType !== 'pie'}" class="item">{{$t('stats.chart.bar')}}</router-link>
      <router-link :to="{name: 'stats.supporters', query: {chartType: 'pie'}}"  :class="{active: $route.query.chartType === 'pie'}" class="item">{{$t('stats.chart.pie')}}</router-link>
    </div>

    <!--차트-->
    <chart :options="chartOptions" :series="supportersChartData" @on-chart-created="onChartCreated"></chart>

    <!--숫자 통계-->
    <div class="ui segment">
      <p>{{$t('stats.msg.total.number.of.members', {n: totalSupporterMembers})}}</p>
      <p>{{$t('stats.msg.total.number.of.supporters', {n: totalSupporters})}}</p>
    </div>

    <!--하단 공유-->
    <div class="shares text-center">
      <button @click="copyLinkIntoClipboard" type="button" class="ui icon button">
        <i class="linkify icon"></i>
      </button>
      <kakao-share v-if="isMobile" :options="kakaoShareOptions" tag="button" type="button" class="button-kakao">
        <img src="../../components/kakao_share/kakaolink_btn_medium.png">
      </kakao-share>
    </div>
  </div>
</template>

<style scoped>
  .button-kakao {
    height: 36px;
    vertical-align: top;
  }

  .button-kakao > img {
    height: 100%;
  }

  .item .item-icon-kakao {
    height: 14px !important;
  }

  .shares {
    margin-top: 1rem;
  }
</style>

<script>
  import {mapState, mapGetters} from 'vuex';
  import $ from 'jquery';

  function getDefaultChartOptions() {
    return {
      lang: {
        thousandsSep: ','
      },
      chart: {
        type: this.$route.query.chartType || 'bar',
        height: 200 + (this.$store.getters.supporterList.length * 30)
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer'
        }
      },
      title: {
        text: this.$t('stats.supporters.title')
      },
      subtitle: {
        text: `Source: ${window.location.href}`
      },
      xAxis: {
        type: 'category',
        labels: {
          style: {
            fontSize: '13px'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: this.$t('stats.number.of.supporter')
        }
      },
      credits: {
        enabled: true
      }
    };
  }

  export default {
    data() {
      return {
        chartOptions: getDefaultChartOptions.call(this),
        kakaoShareOptions: {
          kakaoClientId: this.$store.getters.kakaoClientID,
          label: this.$t('stats.supporters.title'),
          url: `${window.location.origin}${this.$route.fullPath}`,
          thumbnailUrl: `${window.location.origin}/assets/jakduk/img/logo_256.png`
        }
      };
    },
    watch: {
      $route() {
        this.chartOptions.chart.type = this.$route.query.chartType;
      }
    },
    mounted() {
      this.$store.commit('load', false);

      $.getJSON('/api/stats/supporters', {
        lang: this.$lang.split('-')[0]
      }).then(data => {
        const chartData = [];

        data.supporters.forEach(supporter => {
          const item = [supporter.supportFC.names[0].shortName, supporter.count];
          chartData.push(item);
        });

        this.$store.commit('supporters.data', {
          totalMembers: data.usersTotal,
          totalSupporters: data.supportersTotal,
          list: data.supporters,
          chartData: [{
            name: this.$t('stats.number.of.supporter'),
            data: chartData,
            dataLabels: {
              enabled: true,
              align: 'right',
              format: '{point.name} <b>{point.y:1f}</b>',
              style: {
                fontSize: '13px'
              }
            }
          }]
        });
      });
    },
    computed: {
      ...mapState({
        isMobile: 'isMobile'
      }),
      ...mapGetters([
        'supportersChartData',
        'supporterList',
        'totalSupporterMembers',
        'totalSupporters'
      ])
    },
    updated() {
      if (this.chart) {
        this.chart.hideLoading();
      }
    },
    methods: {
      copyLinkIntoClipboard() {
        window.prompt(this.$t('common.url.of.name', {name: this.$t('stats.supporters.title')}), `${window.location.origin}${this.$route.fullPath}`);
      },
      onChartCreated(chart) {
        this.chart = chart;
        this.chart.showLoading(this.$t('common.loading'));
        $('.ui.sticky').sticky('refresh', true);
      }
    },
    components: {
      chart: resolve => {
        require.ensure([], require => {
          resolve(require('../../components/chart/chart.vue'));
        }, 'chart');
      },
      'kakao-share': resolve => {
        require.ensure([], require => {
          resolve(require('../../components/kakao_share/kakao_share.vue'));
        }, 'kakao_share');
      }
    }
  }
</script>
