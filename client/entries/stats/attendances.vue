<template>
  <div class="ui segment">
    <div class="ui three blue item pointing secondary menu">
      <router-link :to="{name: 'stats.attendances', query: {category: 'league'}}" :class="{active: $route.query.category === 'league' || !$route.query.category}" class="item">
        {{$t('stats.attendance.breadcrumbs.league')}}
      </router-link>
      <router-link :to="{name: 'stats.attendances', query: {category: 'club'}}" :class="{active: $route.query.category === 'club'}" class="item">
        {{$t('stats.attendance.breadcrumbs.club')}}
      </router-link>
      <router-link :to="{name: 'stats.attendances', query: {category: 'season'}}" :class="{active: $route.query.category === 'season'}" class="item">
        {{$t('stats.attendance.breadcrumbs.season')}}
      </router-link>
    </div>

    <!--필터-->
    <div class="ui container text-center">
      <div v-if="filter" class="ui selection dropdown filter">
        <input type="hidden">
        <i class="dropdown icon"></i>
        <div class="text"></div>
        <div class="menu">
          <div v-for="cond in filter" :key="cond.id" :data-value="cond.id" :class="{disabled: cond.disabled}" class="item">{{cond.name}}</div>
        </div>
      </div>
      <div v-if="subFilter" class="ui selection dropdown subFilter">
        <input type="hidden">
        <i class="dropdown icon"></i>
        <div class="text"></div>
        <div class="menu">
          <div v-for="cond in subFilter" :key="cond.id" :data-value="cond.id" :class="{disabled: cond.disabled}" class="item">{{cond.name}}</div>
        </div>
      </div>
    </div>

    <!--차트-->
    <chart :options="chartOptions" :series="chartData" @on-chart-created="onChartCreated"></chart>

    <!--숫자 통계-->
    <div class="ui segment">
      <template v-if="$route.query.category === 'club'">
        <p>{{$t('stats.msg.total.number.of.attendance.matches', {n: comma(clubTotalMatches, 3)})}}</p>
        <p>{{$t('stats.msg.total.number.of.attendance.total', {n: comma(clubTotalAttendees, 3)})}}</p>
        <p>{{$t('stats.msg.total.number.of.attendance.average', {n: comma(clubAttendeesAverage, 3)})}}</p>
      </template>
      <template v-else-if="$route.query.category === 'season'">
        <p>{{$t('stats.msg.total.number.of.clubs', {n: seasonTotalClubs})}}</p>
        <p>{{$t('stats.msg.total.number.of.attendance.matches', {n: comma(seasonTotalMatches, 3)})}}</p>
        <p>{{$t('stats.msg.total.number.of.attendance.total', {n: comma(seasonTotalAttendees, 3)})}}</p>
        <p>{{$t('stats.msg.total.number.of.attendance.average', {n: comma(seasonAttendeesAverage, 3)})}}</p>
      </template>
      <template v-else>
        <p>{{$t('stats.msg.total.number.of.attendance.alltime.matches', {n: comma(leagueTotalMatches, 3)})}}</p>
        <p>{{$t('stats.msg.total.number.of.attendance.alltime.total', {n: comma(leagueTotalAttendees, 3)})}}</p>
      </template>
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

  .filter {
    text-align: center;
    margin-bottom: 1em;
  }
</style>

<script>
  import {mapState, mapGetters} from 'vuex';
  import $ from 'jquery';
  import {comma} from '../../filters/number_format';

  const KL_ID = 'KL';
  const KL1_ID = 'KL1';
  const KL2_ID = 'KL2';

  function getDefaultChartOptions(category = 'league', league = KL_ID) {
    if (category === 'club') {
      return getDefaultClubChartOptions.call(this);
    } else if (category === 'season') {
      return getDefaultSeasonChartOptions.call(this);
    } else {
      return getDefaultLeagueChartOptions.call(this, league);
    }
  }

  function getDefaultChartData(category = 'league') {
    if (category === 'club') {
      return getDefaultClubChartData.call(this);
    } else if (category === 'season') {
      return getDefaultSeasonChartData.call(this);
    } else {
      return getDefaultLeagueChartData.call(this);
    }
  }

  function getFilter(category = 'league') {
    if (category === 'club') {
      return null;
    } else if (category === 'season') {
      return [{
        id: 2012,
        name: 2012,
        sub: [{
          id: 'KL',
          name: this.$t('stats.attendance.filter.league')
        }, {
          id: 'KL1',
          name: this.$t('stats.attendance.filter.league.1'),
          disabled: true
        }, {
          id: 'KL2',
          name: this.$t('stats.attendance.filter.league.2'),
          disabled: true
        }]
      }, {
        id: 2013,
        name: 2013,
        sub: [{
          id: 'KL',
          name: this.$t('stats.attendance.filter.league')
        }, {
          id: 'KL1',
          name: this.$t('stats.attendance.filter.league.1')
        }, {
          id: 'KL2',
          name: this.$t('stats.attendance.filter.league.2')
        }]
      }, {
        id: 2014,
        name: 2014,
        sub: [{
          id: 'KL',
          name: this.$t('stats.attendance.filter.league')
        }, {
          id: 'KL1',
          name: this.$t('stats.attendance.filter.league.1')
        }, {
          id: 'KL2',
          name: this.$t('stats.attendance.filter.league.2')
        }]
      }, {
        id: 2015,
        name: 2015,
        sub: [{
          id: 'KL',
          name: this.$t('stats.attendance.filter.league')
        }, {
          id: 'KL1',
          name: this.$t('stats.attendance.filter.league.1')
        }, {
          id: 'KL2',
          name: this.$t('stats.attendance.filter.league.2')
        }]
      }, {
        id: 2016,
        name: 2016,
        sub: [{
          id: 'KL',
          name: this.$t('stats.attendance.filter.league')
        }, {
          id: 'KL1',
          name: this.$t('stats.attendance.filter.league.1')
        }, {
          id: 'KL2',
          name: this.$t('stats.attendance.filter.league.2')
        }]
      }, {
          id: 2017,
          name: 2017,
          sub: [{
              id: 'KL',
              name: this.$t('stats.attendance.filter.league')
          }, {
              id: 'KL1',
              name: this.$t('stats.attendance.filter.league.1')
          }, {
              id: 'KL2',
              name: this.$t('stats.attendance.filter.league.2')
          }]
      }];
    } else {
      return [{
        id: 'KL1',
        name: this.$t('stats.attendance.filter.league.1')
      }, {
        id: 'KL2',
        name: this.$t('stats.attendance.filter.league.2')
      }];
    }
  }

  function getDefaultLeagueChartOptions(league) {
    let title;

    if (league === KL2_ID) {
      title = this.$t('stats.attendance.league.2.title');
    } else {
      title = this.$t('stats.attendance.league.1.title');
    }

    return {
      chart: {
        type: 'bar',
        height: 300
      },
      tooltip: {
        shared: true
      },
      title: {
        text: title
      },
      subtitle: {
        text: 'Source: http://www.kleague.com'
      },
      xAxis: {
        type: 'category',
        labels: {
          style: {
            fontSize: '13px'
          }
        },
        crosshair: true
      },
      yAxis: [{ // Total yAxis
        min: 0,
        title: {
          text: this.$t('stats.attendance.total'),
          align: 'middle'
        },
        labels: {
          x: 0,
          rotation: -30,
          formatter() {
            return comma(this.value, 3);
          }
        },
        opposite: true
      }, { // Average yAxis
        labels: {
          x: 0,
          formatter() {
            return comma(this.value, 3);
          }
        },
        title: {
          text: this.$t('stats.attendance.average')
        }
      }, { // Games yAxis
        labels: {
          x: 0,
          formatter() {
            return comma(this.value, 3);
          }
        },
        title: {
          text: this.$t('stats.attendance.matches')
        }
      }, { // Number Of Clubs yAxis
        labels: {
          x: 0,
          formatter() {
            return comma(this.value, 3);
          }
        },
        title: {
          text: this.$t('stats.attendance.number.of.clubs')
        },
        opposite: true
      }],
      credits: {enabled: true}
    };
  }

  function getDefaultClubChartOptions() {
    return {
      chart: {
        type: 'column',
        height: 300
      },
      tooltip: {
        shared: true
      },
      title: {
        text: ''
      },
      subtitle: {
        text: 'Source: blog.daum.net/vhgksl'
      },
      xAxis: {
        type: 'category',
        labels: {
          style: {
            fontSize: '13px'
          }
        },
        crosshair: true
      },
      yAxis: [{ // Total yAxis
        min: 0,
        title: {
          text: this.$t('stats.attendance.total'),
          align: 'middle'
        },
        labels: {
          x: 0,
          formatter() {
            return comma(this.value, 3);
          }
        }
      }, { // Average yAxis
        labels: {
          x: 0,
          formatter() {
            return comma(this.value, 3);
          }
        },
        title: {
          text: this.$t('stats.attendance.average')
        },
        opposite: true
      }, { // Games yAxis
        labels: {
          x: 0,
          formatter() {
            return comma(this.value, 3);
          }
        },
        title: {
          text: this.$t('stats.attendance.matches')
        },
        opposite: true
      }],
      credits: {enabled: true}
    };
  }

  function getDefaultSeasonChartOptions() {
    return {
      chart: {
        type: 'bar',
        height: 300
      },
      tooltip: {
        shared: true
      },
      title: {
        text: this.$t('stats.attendance')
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
        },
        crosshair: true
      },
      yAxis: [{ // Total yAxis
        min: 0,
        title: {
          text: this.$t('stats.attendance.total'),
          align: 'middle'
        },
        labels: {
          x: 0,
          rotation: -30,
          formatter() {
            return comma(this.value, 3);
          }
        },
        opposite: true
      }, { // Average yAxis
        min: 0,
        title: {
          text: this.$t('stats.attendance.average')
        },
        labels: {
          x: 0,
          rotation: -30,
          formatter() {
            return comma(this.value, 3);
          }
        }
      }],
      credits: {enabled: true}
    };
  }

  function getDefaultClubChartData() {
    return [{
      name: this.$t('stats.attendance.total'),
      yAxis: 0,
      type: 'column',
      animation: true,
      data: [],
      dataLabels: {
        enabled: true,
        color: '#FFFFFF',
        format: `{point.y:,.0f} ${this.$t('stats.attendance.people')}`,
        style: {
          fontSize: '13px'
        }
      }
    }, {
      name: `${this.$t('stats.attendance.average')}`,
      yAxis: 1,
      type: 'spline',
      animation: true,
      data: [],
      dataLabels: {
        enabled: true,
        color: '#FFFFFF',
        format: `{point.y:,.0f} ${this.$t('stats.attendance.people')}`,
        style: {
          fontSize: '13px'
        }
      }
    }, {
      name: this.$t('stats.attendance.matches'),
      yAxis: 2,
      visible: false,
      type: 'spline',
      animation: true,
      data: [],
      dataLabels: {
        enabled: true,
        format: `{point.y:,.0f} ${this.$t('stats.attendance.match')}`
      }
    }];
  }

  function getDefaultSeasonChartData() {
    return [{
      name: this.$t('stats.attendance.total'),
      yAxis: 0,
      animation: true,
      data: [],
      dataLabels: {
        enabled: true,
        color: '#FFFFFF',
        align: 'right',
        format: `{point.y:,.0f} ${this.$t('stats.attendance.people')}`,
        style: {
          fontSize: '13px'
        }
      }
    }, {
      name: this.$t('stats.attendance.average'),
      yAxis: 1,
      type: 'spline',
      animation: true,
      data: [],
      dataLabels: {
        enabled: true,
        color: '#FFFFFF',
        align: 'right',
        format: `{point.y:,.0f} ${this.$t('stats.attendance.people')}`,
        style: {
          fontSize: '13px'
        }
      }
    }];
  }

  function getDefaultLeagueChartData() {
    return [{
      name: this.$t('stats.attendance.total'),
      yAxis: 0,
      type: 'column',
      animation: true,
      data: [],
      dataLabels: {
        enabled: true,
        color: '#FFFFFF',
        align: 'right',
        format: `{point.y:,.0f} ${this.$t('stats.attendance.people')}`,
        style: {
          fontSize: '13px'
        }
      }
    }, {
      name: this.$t('stats.attendance.average'),
      yAxis: 1,
      type: 'spline',
      animation: true,
      data: [],
      dataLabels: {
        enabled: true,
        format: `{point.y:,.0f} ${this.$t('stats.attendance.people')}`
      }
    }, {
      name: this.$t('stats.attendance.matches'),
      yAxis: 2,
      visible: false,
      type: 'spline',
      animation: true,
      data: [],
      dataLabels: {
        enabled: true,
        format: `{point.y:,.0f} ${this.$t('stats.attendance.match')}`
      }
    }, {
      name: this.$t('stats.attendance.number.of.clubs'),
      yAxis: 3,
      visible: false,
      type: 'spline',
      animation: true,
      data: [],
      dataLabels: {
        enabled: true,
        format: '{point.y:,.0f}'
      }
    }];
  }

  function fetch({category, league, season, club}) {
    let promise;

    this.chartOptions = getDefaultChartOptions.call(this, category, league);
    this.chartData = getDefaultChartData.call(this, category);
    this.filter = getFilter.call(this, category);
    this.subFilter = null;

    if (category === 'club') {
      promise = $.getJSON('/api/football/clubs', {
        lang: this.$lang.replace('-', '_')
      }).then(footballClubs => {
        const footballClub = footballClubs.find(_club => _club.origin.name === club) || footballClubs[0];

        this.filter = footballClubs.map(club => {
          return {
            id: club.origin.name,
            name: club.names[0].fullName
          };
        });

        this.chartOptions.title.text = `${footballClub.names[0].fullName} ${this.$t('stats.attendance.club.title')}`;

        if (footballClub) {
          return $.getJSON(`/api/stats/attendance/club/${footballClub.origin.name}`, {
            lang: this.$lang.replace('-', '_')
          }).then(data => {
            let totalAttendees = 0;
            let totalMatches = 0;

            data.forEach(attendance => {
              this.chartData[0].data.push([attendance.season, attendance.total]);
              this.chartData[1].data.push([attendance.season, attendance.average]);
              this.chartData[2].data.push([attendance.season, attendance.games]);

              totalAttendees += attendance.total;
              totalMatches += attendance.games;
            });

            this.chartOptions.chart.height += data.length * 30;

            this.$store.commit('club.data', {
              totalMatches: totalMatches,
              totalAttendees: totalAttendees,
              attendeesAverage: Math.floor(totalAttendees / totalMatches) || 0
            });
          });
        }
      });
    } else if (category === 'season') {
      this.subFilter = this.filter.find(f => `${f.id}` === `${season || 2016}`).sub;

      promise = $.getJSON('/api/football/clubs', {
        lang: this.$lang.replace('-', '_')
      }).then(footballClubs => {
        return $.getJSON(`/api/stats/attendance/season/${season || 2016}`, {
          league: league || KL_ID,
          lang: this.$lang.replace('-', '_')
        }).then(data => {
          let totalAttendees = 0;
          let totalMatches = 0;

          data.forEach(attendance => {
            if (!league || league === KL_ID || league === attendance.league) {
              let clubName = 'Unknown';
              footballClubs.some(club => {
                if ((attendance.club && attendance.club.name) === club.origin.name) {
                  clubName = club.names[0].fullName;
                  return true;
                }
                return false;
              });

              this.chartData[0].data.push([clubName, attendance.total]);
              this.chartData[1].data.push([clubName, attendance.average]);

              totalAttendees += attendance.total;
              totalMatches += attendance.games;
            }
          });

          this.chartOptions.chart.height += data.length * 30;

          this.$store.commit('season.data', {
            totalClubs: data.length,
            totalMatches: totalMatches,
            totalAttendees: totalAttendees,
            attendeesAverage: Math.floor(totalAttendees / totalMatches) || 0
          });
        });
      });
    } else {
      promise = $.getJSON(`/api/stats/league/attendances`, {
        competitionCode: league || KL1_ID,
        lang: this.$lang.replace('-', '_')
      }).then(data => {
        let totalAttendees = 0;
        let totalMatches = 0;

        data.forEach(attendance => {
          this.chartData[0].data.push([attendance.season, attendance.total]);
          this.chartData[1].data.push([attendance.season, attendance.average]);
          this.chartData[2].data.push([attendance.season, attendance.games]);
          this.chartData[3].data.push([attendance.season, attendance.numberOfClubs]);

          totalAttendees += attendance.total;
          totalMatches += attendance.games;
        });

        this.chartOptions.chart.height += data.length * 30;

        this.$store.commit('league.data', {
          totalMatches: totalMatches,
          totalAttendees: totalAttendees
        });
      });
    }

    return promise;
  }

  function updateFilter({category, league, season, club}) {
    let selected;

    if (category === 'club') {
      selected = club || this.filter[0].id;
    } else if (category === 'season') {
      selected = season || this.lastElement(this.filter).id;
    } else {
      selected = league || this.filter[0].id;
    }

    let $filter = $(this.$el).find('.dropdown.filter');
    $filter.dropdown({onChange: $.noop});
    $filter.dropdown('set selected', selected);
    $filter.dropdown({
      onChange: value => {
        const category = this.$route.query.category;
        const query = {category};

        if (category === 'club') {
          query.club = value;
        } else if (category === 'season') {
          query.season = value;
          query.league = this.$route.query.league;
        } else {
          query.league = value;
        }

        this.$router.push({
          name: 'stats.attendances',
          query
        });
      }
    });

    if (this.subFilter) {
      const $subFilter = $(this.$el).find('.dropdown.subFilter');
      $subFilter.dropdown({onChange: $.noop});
      $subFilter.dropdown('set selected', league || this.subFilter[0].id);
      $subFilter.dropdown({
        onChange: value => {
          const category = this.$route.query.category;
          const query = {
            category,
            season: this.$route.query.season,
            league: value
          };

          this.$router.push({
            name: 'stats.attendances',
            query
          });
        }
      });
    }
  }

  function getTitle({category}) {
    let title;

    if (category === 'club') {
      title = 'stats.attendance.club.title';
    } else if (category === 'season') {
      title = 'stats.attendance.season.title';
    } else {
      title = 'stats.attendance.league.title';
    }

    return title;
  }

  export default {
    data() {
      return {
        chartOptions: {},
        chartData: [],
        filter: null,
        subFilter: null,
        kakaoShareOptions: {
          kakaoClientId: this.$store.getters.kakaoClientID,
          label: this.$t('stats.supporters.title'),
          description: this.$t('common.jakduk'),
          url: `${window.location.origin}${this.$route.fullPath}`,
          thumbnailUrl: `${window.location.origin}/assets/jakduk/img/logo_256.png`
        }
      };
    },
    beforeRouteEnter(to, from, next) {
      next(_this => {
        _this.setDocumentTitle(_this.$t(getTitle(to.query)), _this.$t('common.jakduk'));
      });
    },
    beforeRouteUpdate(to, from, next) {
      this.setDocumentTitle(this.$t(getTitle(to.query)), this.$t('common.jakduk'));
      next();
    },
    watch: {
      $route() {
        fetch.call(this, this.$route.query).then(() => {
          updateFilter.call(this, this.$route.query);
          this.chart.hideLoading();
        });
      }
    },
    mounted() {
      this.$store.commit('load', false);
      fetch.call(this, this.$route.query).then(() => {
        updateFilter.call(this, this.$route.query);
        this.chart.hideLoading();
      });
    },
    computed: {
      ...mapState({
        isMobile: 'isMobile'
      }),
      ...mapGetters([
        'leagueTotalAttendees',
        'leagueTotalMatches',
        'clubTotalMatches',
        'clubTotalAttendees',
        'clubAttendeesAverage',
        'seasonTotalClubs',
        'seasonTotalMatches',
        'seasonTotalAttendees',
        'seasonAttendeesAverage'
      ])
    },
    methods: {
      copyLinkIntoClipboard() {
        window.prompt(
          this.$t('common.url.of.name', {name: this.$t(getTitle(this.$route.query))}),
          `${window.location.origin}${this.$route.fullPath}`
        );
      },
      comma: comma,
      onChartCreated(chart) {
        this.chart = chart;
        this.chart.showLoading(this.$t('common.loading'));
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
