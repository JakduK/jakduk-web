export default {
  state: {
    supporters: {
      totalMembers: 0,
      totalSupporters: 0,
      chartData: [],
      list: []
    },
    league: {
      totalAttendees: 0,
      totalMatches: 0,
      chartData: []
    },
    club: {
      totalMatches: 0,
      totalAttendees: 0,
      attendeesAverage: 0,
      chartData: []
    },
    season: {
      totalClubs: 0,
      totalMatches: 0,
      totalAttendees: 0,
      attendeesAverage: 0,
      chartData: []
    }
  },
  mutations: {
    'league.data'(state, {totalMatches, totalAttendees}) {
      state.league.totalMatches = totalMatches;
      state.league.totalAttendees = totalAttendees;
    },
    'club.data'(state, {totalMatches, totalAttendees, attendeesAverage}) {
      state.club.totalMatches = totalMatches;
      state.club.totalAttendees = totalAttendees;
      state.club.attendeesAverage = attendeesAverage;
    },
    'season.data'(state, {totalClubs, totalMatches, totalAttendees, attendeesAverage}) {
      state.season.totalClubs = totalClubs;
      state.season.totalMatches = totalMatches;
      state.season.totalAttendees = totalAttendees;
      state.season.attendeesAverage = attendeesAverage;
    },
    'supporters.data'(state, {list, totalSupporters, totalMembers, chartData}) {
      state.supporters.totalSupporters = totalSupporters;
      state.supporters.totalMembers = totalMembers;
      state.supporters.list = list;
      state.supporters.chartData = chartData;
    }
  },
  getters: {
    totalSupporters: state => state.supporters.totalSupporters,
    totalSupporterMembers: state => state.supporters.totalMembers,
    supportersChartData: state => state.supporters.chartData,
    supporterList: state => state.supporters.list,
    leagueTotalAttendees: state => state.league.totalAttendees,
    leagueTotalMatches: state => state.league.totalMatches,
    clubTotalMatches: state => state.club.totalMatches,
    clubTotalAttendees: state => state.club.totalAttendees,
    clubAttendeesAverage: state => state.club.attendeesAverage,
    seasonTotalClubs: state => state.season.totalClubs,
    seasonTotalMatches: state => state.season.totalMatches,
    seasonTotalAttendees: state => state.season.totalAttendees,
    seasonAttendeesAverage: state => state.season.attendeesAverage
  }
};
