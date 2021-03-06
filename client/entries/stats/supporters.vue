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
  import { mapGetters, mapState } from 'vuex';
  import $ from 'jquery';

  function getDefaultChartOptions() {
    return {
      chart: {
        type: this.$route.query.chartType || 'bar',
        height: 300
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

  function adjustChartHeight() {
    if (this.chartOptions.chart.type === 'bar') {
      this.chartOptions.chart.height = 300 + (this.$store.getters.supporterList.length * 30);
    } else {
      this.chartOptions.chart.height = Math.min($(window).outerWidth(), 700);
    }
  }

  export default {
    data() {
      return {
        chart: null,
        chartOptions: getDefaultChartOptions.call(this),
        kakaoShareOptions: {
          kakaoSdkKey: this.$store.getters.kakaoSdkKey,
          label: this.$t('stats.supporters.title'),
          description: this.$t('common.jakduk'),
          url: `${window.location.origin}${this.$route.fullPath}`,
          thumbnailUrl: `${window.location.origin}/assets/jakduk/img/logo_256.png`
        }
      };
    },
    beforeRouteEnter(to, from, next) {
      next(_this => {
        _this.setDocumentTitle(_this.$t('stats.supporters.title'), _this.$t('common.jakduk'));
      });
    },
    watch: {
      $route() {
        this.chartOptions.chart.type = this.$route.query.chartType;
        adjustChartHeight.call(this);
      },
      chart() {
        this.$store.commit('load', false);
        this.chart.hideLoading();
      }
    },
    mounted() {
      $.getJSON('/api/stats/supporters', {
        lang: this.$i18n.locale.replace('-', '_')
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

        adjustChartHeight.call(this);
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
    methods: {
      copyLinkIntoClipboard() {
        window.prompt(
          this.$t('common.url.of.name', {name: this.$t('stats.supporters.title')}),
          `${window.location.origin}${this.$route.fullPath}`,
        );
      },
      onChartCreated(chart) {
        chart.showLoading(this.$t('common.loading'));
        this.chart = chart;
      }
    },
    components: {
      chart: () => import('../../components/chart/chart.vue'),
      'kakao-share': () => import('../../components/kakao_share/kakao_share.vue'),
    }
  }
</script>
