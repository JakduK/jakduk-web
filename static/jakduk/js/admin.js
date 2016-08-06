'use strict';

define([
  'angular', 'jakduk', 'angular-ui-router'
], function (angular) {
  angular.module('jakdukAdmin', ['ui.router'])
    .constant('MENU_ID_MAP', {
      HOME: {
        ID: 'admin',
        URL: '/admin',
        CONTROLLER: 'AdminController',
        TEMPLATE: '/jakduk/template/admin.html'
      },
      INIT: {
        BOARD_CATEGORY: {
          ID: 'admin.initBoardCategory',
          URL: '/board/category/init',
          TEMPLATE: '/jakduk/template/admin-board-category-init.html',
          CONTROLLER: 'AdminBoardCategoryInitController'
        },
        SEARCH_INDEX: {
          ID: 'admin.initSearchIndex',
          URL: '/search/index/init',
          TEMPLATE: '/jakduk/template/admin-search-index-init.html',
          CONTROLLER: 'AdminSearchIndexInitController'
        },
        SEARCH_TYPE: {
          ID: 'admin.initSearchType',
          URL: '/search/type/init',
          TEMPLATE: '/jakduk/template/admin-search-type-init.html',
          CONTROLLER: 'AdminSearchTypeInitController'
        },
        SEARCH_DATA: {
          ID: 'admin.initSearchData',
          URL: '/search/data/init',
          TEMPLATE: '/jakduk/template/admin-search-data-init.html',
          CONTROLLER: 'AdminSearchDataInitController'
        }
      },
      WRITE: {
        ENCYCLOPEDIA: {
          ID: 'admin.writeEncyclopedia',
          URL: '/encyclopedia/write/:id',
          TEMPLATE: '/jakduk/template/admin-write-encyclopedia.html',
          CONTROLLER: 'AdminWriteEncyclopediaController'
        },
        FC_ORIGIN: {
          ID: 'admin.writefcOrigin',
          URL: '/fcOrigin/write/:id',
          TEMPLATE: '/jakduk/template/admin-write-fc-origin.html',
          CONTROLLER: 'AdminWriteFootballClubOriginController'
        },
        FC: {
          ID: 'admin.writefc',
          URL: '/fc/write/:id',
          TEMPLATE: '/jakduk/template/admin-write-fc.html',
          CONTROLLER: 'AdminWriteFootballClubController'
        },
        BOARD_CATEGORY: {
          ID: 'admin.writeBoardCategory',
          URL: '/boardCategory/write/:id',
          TEMPLATE: '/jakduk/template/admin-write-board-category.html',
          CONTROLLER: 'AdminWriteBoardCategoryController'
        },
        THUMBNAIL_SIZE: {
          ID: 'admin.writeThumbnailSize',
          URL: '/thumbnail/size/write/:id',
          TEMPLATE: '/jakduk/template/admin-write-thumbnail-size.html',
          CONTROLLER: 'AdminWriteThumbnailSizeController'
        },
        HOME_DESCRIPTION: {
          ID: 'admin.writeHomeDescription',
          URL: '/homeDescription/write/:id',
          TEMPLATE: '/jakduk/template/admin-write-home-description.html',
          CONTROLLER: 'AdminWriteHomeDescriptionController'
        },
        ATTENDANCE_LEAGUE: {
          ID: 'admin.writeAttendanceLeague',
          URL: '/attendanceLeague/write/:id',
          TEMPLATE: '/jakduk/template/admin-write-attendance-league.html',
          CONTROLLER: 'AdminWriteAttendanceLeagueController'
        },
        ATTENDANCE_CLUB: {
          ID: 'admin.writeAttendanceClub',
          URL: '/attendanceClub/write/:id',
          TEMPLATE: '/jakduk/template/admin-write-attendance-club.html',
          CONTROLLER: 'AdminWriteAttendanceClubController'
        },
        JAKDU_SCHEDULE: {
          ID: 'admin.writeJakduSchedule',
          URL: '/jakduSchedule/write/:id',
          TEMPLATE: '/jakduk/template/admin-write-jakdu-schedule.html',
          CONTROLLER: 'AdminWriteJakduScheduleController'
        },
        JAKDU_SCHEDULE_GROUP: {
          ID: 'admin.writeJakduScheduleGroup',
          URL: '/jakduScheduleGroup/write/:id',
          TEMPLATE: '/jakduk/template/admin-write-jakdu-schedule-group.html',
          CONTROLLER: 'AdminWriteJakduScheduleGroupController'
        },
        COMPETITION: {
          ID: 'admin.writeCompetition',
          URL: '/competition/write/:id',
          TEMPLATE: '/jakduk/template/admin-write-competition.html',
          CONTROLLER: 'AdminWriteCompetitionController'
        }
      },
      GET: {
        ENCYCLOPEDIA: {
          ID: 'admin.getEncyclopedia',
          URL: '/encyclopedia',
          CONTROLLER: 'AdminGetController',
          TEMPLATE: '/jakduk/template/admin-data-view.html'
        },
        FC_ORIGIN: {
          ID: 'admin.getFcOrigin',
          URL: '/fcOrigin',
          CONTROLLER: 'AdminGetController',
          TEMPLATE: '/jakduk/template/admin-data-view.html'
        },
        FC: {
          ID: 'admin.getFc',
          URL: '/fc',
          CONTROLLER: 'AdminGetController',
          TEMPLATE: '/jakduk/template/admin-data-view.html'
        },
        BOARD_CATEGORY: {
          ID: 'admin.getBoardCategory',
          URL: '/boardCategory',
          CONTROLLER: 'AdminGetController',
          TEMPLATE: '/jakduk/template/admin-data-view.html'
        },
        HOME_DESCRIPTION: {
          ID: 'admin.getHomeDescription',
          URL: '/homeDescription',
          CONTROLLER: 'AdminGetController',
          TEMPLATE: '/jakduk/template/admin-data-view.html'
        },
        ATTENDANCE_LEAGUE: {
          ID: 'admin.getAttendanceLeague',
          URL: '/attendanceLeague?competitionCode',
          CONTROLLER: 'AdminGetController',
          TEMPLATE: '/jakduk/template/admin-data-view.html'
        },
        ATTENDANCE_CLUB: {
          ID: 'admin.getAttendanceClub',
          URL: '/attendanceClub',
          CONTROLLER: 'AdminGetController',
          TEMPLATE: '/jakduk/template/admin-data-view.html'
        },
        JAKDU_SCHEDULE: {
          ID: 'admin.getJakduSchedule',
          URL: '/jakduSchedule',
          CONTROLLER: 'AdminGetController',
          TEMPLATE: '/jakduk/template/admin-data-view.html'
        },
        JAKDU_SCHEDULE_GROUP: {
          ID: 'admin.getJakduScheduleGroup',
          URL: '/jakduScheduleGroup',
          CONTROLLER: 'AdminGetController',
          TEMPLATE: '/jakduk/template/admin-data-view.html'
        },
        COMPETITION: {
          ID: 'admin.getCompetition',
          URL: '/competition',
          CONTROLLER: 'AdminGetController',
          TEMPLATE: '/jakduk/template/admin-data-view.html'
        }
      }
    })
    .config(['$locationProvider', function ($locationProvider) {
      $locationProvider.html5Mode(true);
    }])
    .config(['$urlMatcherFactoryProvider', '$urlRouterProvider', '$stateProvider', 'MENU_ID_MAP', function ($urlMatcherFactoryProvider, $urlRouterProvider, $stateProvider, MENU_ID_MAP) {
      // https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-make-a-trailing-slash-optional-for-all-routes
      $urlMatcherFactoryProvider.strictMode(false);
      $urlRouterProvider.rule(function ($injector, $location) {
        var path = $location.url();

        // check to see if the path already has a slash where it should be
        if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
          return;
        }

        if (path.indexOf('?') > -1) {
          return path.replace('?', '/?');
        }

        return path + '/';
      });

      $stateProvider
        .state(MENU_ID_MAP.HOME.ID, {
          url: MENU_ID_MAP.HOME.URL,
          templateUrl: MENU_ID_MAP.HOME.TEMPLATE,
          controller: MENU_ID_MAP.HOME.CONTROLLER,
          controllerAs: 'ctrl',
          data: {
            category: ''
          }
        });

      angular.forEach(MENU_ID_MAP.INIT, function (value) {
        $stateProvider.state(value.ID, {
          url: value.URL,
          templateUrl: value.TEMPLATE,
          controller: value.CONTROLLER,
          controllerAs: 'ctrl',
          data: {
            category: 'init'
          }
        });
      });

      angular.forEach(MENU_ID_MAP.WRITE, function (value) {
        $stateProvider.state(value.ID, {
          url: value.URL,
          templateUrl: value.TEMPLATE,
          controller: value.CONTROLLER,
          controllerAs: 'ctrl',
          data: {
            category: 'write'
          }
        });
      });

      angular.forEach(MENU_ID_MAP.GET, function (value) {
        $stateProvider.state(value.ID, {
          url: value.URL,
          templateUrl: value.TEMPLATE,
          controller: value.CONTROLLER,
          controllerAs: 'ctrl',
          data: {
            category: 'get'
          }
        });
      });

    }])
    .controller("AdminController", ['$scope', '$state', '$transitions', 'MENU_ID_MAP', function ($scope, $state, $transitions, MENU_ID_MAP) {
      var self = this;

      pickMenuInfo($state);

      $scope.MENU_ID_MAP = MENU_ID_MAP;
      $transitions.onSuccess({}, pickMenuInfo.bind(self, $state));

      function pickMenuInfo($state) {
        var state = $state.current;
        self.isOpened = {};
        self.isOpened[state.data.category] = true;
        self.currentMenu = state.name;
      }

    }])
    .controller("AdminGetController", ['$http', '$state', '$location', 'MENU_ID_MAP', 'Config', function ($http, $state, $location, MENU_ID_MAP, Config) {
      var self = this;

      self.getData = getData;
      self.clearData = clearData;

      self.dataConn = "none";
      self.dataLeagueConn = "none";
      self.encyclopedias = [];
      self.fcOrigins = [];
      self.fcs = [];
      self.boardCategories = [];
      self.leagueAttendances = [];
      self.attendanceClubs = [];
      self.homeDescriptions = [];
      self.jakduSchedules = [];
      self.jakduScheduleGroups = [];
      self.competitions = [];

      self.message = '불러오는 중...';
      getData($state.current.name);

      function getData(id) {
        var apiUrl, apiParams = '';

        switch (id) {
          case MENU_ID_MAP.GET.ENCYCLOPEDIA.ID:
            apiUrl = '/encyclopedias';
            break;
          case MENU_ID_MAP.GET.FC_ORIGIN.ID:
            apiUrl = '/origin/football/clubs';
            break;
          case MENU_ID_MAP.GET.FC.ID:
            apiUrl = '/football/clubs';
            break;
          case MENU_ID_MAP.GET.BOARD_CATEGORY.ID:
            apiUrl = '/board/categories';
            break;
          case MENU_ID_MAP.GET.ATTENDANCE_LEAGUE.ID:
            self.activeLeague = ($state.params.competitionCode || 'ALL');
            self.activeLeagueName = getActiveLeage(self.activeLeague);
            apiUrl = '/league/attendances';
            if (self.activeLeague !== 'ALL') {
              apiParams = '?competitionCode=' + self.activeLeague;
            }
            break;
          case MENU_ID_MAP.GET.ATTENDANCE_CLUB.ID:
            apiUrl = '/club/attendances';
            break;
          case MENU_ID_MAP.GET.HOME_DESCRIPTION.ID:
            apiUrl = '/home/descriptions';
            break;
          case MENU_ID_MAP.GET.JAKDU_SCHEDULE.ID:
            apiUrl = '/jakdu/schedules';
            break;
          case MENU_ID_MAP.GET.JAKDU_SCHEDULE_GROUP.ID:
            apiUrl = '/jakdu/schedule/groups';
            break;
          case MENU_ID_MAP.GET.COMPETITION.ID:
            apiUrl = '/competitions';
            break;
        }

        if (apiUrl && self.dataConn === "none") {

          self.dataConn = "loading";

          $http.get(Config.apiServerUrl + '/admin' + apiUrl + apiParams).then(function (response) {
            clearData();

            var data = response.data;
            var name;

            switch (id) {
              case MENU_ID_MAP.GET.ENCYCLOPEDIA.ID:
                name = 'encyclopedias';
                break;
              case MENU_ID_MAP.GET.FC_ORIGIN.ID:
                name = 'originFCs';
                break;
              case MENU_ID_MAP.GET.FC.ID:
                name = 'fcs';
                break;
              case MENU_ID_MAP.GET.BOARD_CATEGORY.ID:
                name = 'boardCategories';
                break;
              case MENU_ID_MAP.GET.ATTENDANCE_LEAGUE.ID:
                name = 'leagueAttendances';
                break;
              case MENU_ID_MAP.GET.ATTENDANCE_CLUB.ID:
                name = 'attendanceClubs';
                break;
              case MENU_ID_MAP.GET.HOME_DESCRIPTION.ID:
                name = 'homeDescriptions';
                break;
              case MENU_ID_MAP.GET.JAKDU_SCHEDULE.ID:
                name = 'jakduSchedules';
                break;
              case MENU_ID_MAP.GET.JAKDU_SCHEDULE_GROUP.ID:
                name = 'jakduScheduleGroups';
                break;
              case MENU_ID_MAP.GET.COMPETITION.ID:
                name = 'competitions';
                break;
            }

            self[name] = data[name] || data;
            self.dataConn = "none";
            self.message = (!self[name] || !self[name].length) ? '데이터 없음' : '';
          }, function () {
            self.dataConn = "none";
            self.message = '오류 발생';
          });
        }
      }

      function clearData() {
        self.encyclopedias = [];
        self.fcOrigins = [];
        self.fcs = [];
        self.boardCategories = [];
        self.leagueAttendances = [];
        self.attendanceClubs = [];
        self.homeDescriptions = [];
        self.jakduSchedules = [];
        self.jakduScheduleGroups = [];
        self.competitions = [];
      }

      function getActiveLeage(id) {
        switch (id) {
          case 'KLCL':
            return 'K League Classic';
          case 'KLCH':
            return 'K League Challenge';
          case 'KL':
            return 'K League';
          default:
            return 'ALL LEAGUE';
        }
      }

    }])
    .controller('AdminBoardCategoryInitController', ['$http', 'Config', function ($http, Config) {
      var self = this;
      self.message = '처리중...';
      $http.post(Config.apiServerUrl + '/admin/board/category/init')
        .then(function (response) {
          self.message = response.data.result ? '기본 카테고리 생성완료' : '이미 생성되어 있음';
        }, function () {
          self.message = '오류 발생';
        });
    }])
    .controller('AdminSearchIndexInitController', ['$http', 'Config', function ($http, Config) {
      var self = this;
      self.message = '처리중...';
      $http.post(Config.apiServerUrl + '/admin/search/index/init')
        .then(function () {
          self.message = '검색 색인 완료';
        }, function () {
          self.message = '오류 발생';
        });
    }])
    .controller('AdminSearchTypeInitController', ['$http', 'Config', function ($http, Config) {
      var self = this;
      self.message = '처리중...';
      $http.post(Config.apiServerUrl + '/admin/search/type/init')
        .then(function () {
          self.message = '검색 색인 완료';
        }, function () {
          self.message = '오류 발생';
        });
    }])
    .controller('AdminSearchDataInitController', ['$http', 'Config', function ($http, Config) {
      var self = this;
      self.message = '처리중...';
      $http.post(Config.apiServerUrl + '/admin/search/data/init')
        .then(function () {
          self.message = '검색 색인 완료';
        }, function () {
          self.message = '오류 발생';
        });
    }])
    .controller('AdminWriteEncyclopediaController', ['$scope', '$http', '$state', '$location', 'Config', function ($scope, $http, $state, $location, Config) {
      var self = this;

      self.submit = submit;

      self.language = 'ko';
      self.kind = 'player';

      if ($state.params.id) {
        $http.get(Config.apiServerUrl + '/admin/encyclopedia/' + $state.params.id).then(function (response) {
          var encyclopedia = response.data.encyclopedia;
          if (encyclopedia) {
            self.encyclopedia = encyclopedia;
            self.kind = encyclopedia.kind;
            self.subject = encyclopedia.subject;
            self.content = encyclopedia.content;
            self.language = encyclopedia.language;
          }
        });
      }

      function submit() {
        self.errorMessage = '';
        if ($scope.encyclopediaForm.$invalid) {
          self.errorMessage = 'SUBJECT, CONTENT 필수 입력입니다';
          return;
        }

        var data = {
          subject: self.subject,
          kind: self.kind,
          content: self.content,
          language: self.language
        };
        var promise;

        if (self.encyclopedia) {
          promise = $http.put(Config.apiServerUrl + '/admin/encyclopedia/' + self.encyclopedia.id, data);
        } else {
          promise = $http.post(Config.apiServerUrl + '/admin/encyclopedia', data);
        }

        promise.then(function () {
          $location.url('/admin/encyclopedia');
        }, function () {
          self.errorMessage = 'SUBJECT, CONTENT 필수 입력입니다';
        });
      }
    }])
    .controller('AdminWriteFootballClubOriginController', ['$scope', '$http', '$state', '$location', 'Config', function ($scope, $http, $state, $location, Config) {
      var self = this;

      self.submit = submit;

      if ($state.params.id) {
        $http.get(Config.apiServerUrl + '/admin/origin/football/club/' + $state.params.id).then(function (response) {
          var originFC = response.data.originFC;
          if (originFC) {
            self.originFC = originFC;
            self.codeName = originFC.name;
            self.clubType = originFC.clubType;
            self.age = originFC.age;
            self.sex = originFC.sex;
          }
        });
      } else {
        self.clubType = 'FOOTBALL_CLUB';
        self.age = 'UNDER_14';
        self.sex = 'MEN';
      }

      function submit() {
        self.errorMessage = '';
        if ($scope.footballClubOriginForm.$invalid) {
          self.errorMessage = 'CODE NAME 필수 입력입니다';
          return;
        }

        var data = {
          name: self.codeName,
          clubType: self.clubType,
          age: self.age,
          sex: self.sex
        };
        var promise;

        if ($state.params.id) {
          promise = $http.put(Config.apiServerUrl + '/admin/origin/football/club/' + $state.params.id, data);
        } else {
          promise = $http.post(Config.apiServerUrl + '/admin/origin/football/club', data);
        }

        promise.then(function () {
          $location.url('/admin/fcOrigin');
        });
      }
    }])
    .controller('AdminWriteFootballClubController', ['$scope', '$http', '$state', '$location', 'Config', function ($scope, $http, $state, $location, Config) {
      var self = this;

      self.submit = submit;

      if ($state.params.id) {
        $http.get(Config.apiServerUrl + '/admin/football/club/' + $state.params.id).then(function (response) {
          var fc = response.data.fcRequest;
          if (fc) {
            self.active = fc.active;
            self.shortNameKr = fc.shortNameKr;
            self.fullNameKr = fc.fullNameKr;
            self.shortNameEn = fc.shortNameEn;
            self.fullNameEn = fc.fullNameEn;
            self.origins = response.data.originFCs;
            self.origin = self.origins.filter(function (each) {
              return each.id === fc.origin;
            })[0];
          }
        });
      } else {
        self.active = 'active';
        $http.get(Config.apiServerUrl + '/admin/origin/football/clubs').then(function (response) {
          self.origins = response.data.originFCs;
          self.origin = self.origins[0];
        });
      }

      function submit() {
        self.errorMessage = '';
        if ($scope.footballClubForm.$invalid) {
          self.errorMessage = '빠짐없이 입력해 주세요';
          return;
        }

        var data = {
          origin: self.origin.id,
          active: self.active,
          shortNameKr: self.shortNameKr,
          fullNameKr: self.fullNameKr,
          shortNameEn: self.shortNameEn,
          fullNameEn: self.fullNameEn
        };
        var promise;

        if ($state.params.id) {
          promise = $http.put(Config.apiServerUrl + '/admin/football/club/' + $state.params.id, data);
        } else {
          promise = $http.post(Config.apiServerUrl + '/admin/football/club', data);
        }

        promise.then(function () {
          $location.url('/admin/fc');
        }, function () {
          self.errorMessage = '빠짐없이 입력해 주세요';
        });
      }
    }])
    .controller('AdminWriteBoardCategoryController', ['$scope', '$http', '$state', '$location', 'Config', function ($scope, $http, $state, $location, Config) {
      var self = this;

      self.submit = submit;

      if ($state.params.id) {
        $http.get(Config.apiServerUrl + '/admin/board/category/' + $state.params.id).then(function (response) {
          var boardCategory = response.data.boardCategory;
          if (boardCategory) {
            self.boardCategory = boardCategory;
            self.name = boardCategory.name;
            self.resName = boardCategory.resName;
            self.usingBoard = boardCategory.usingBoard.map(function (each) {
              return {
                name: each,
                value: true
              }
            });
          }
        });
      } else {
        self.usingBoard = [{name: 'freeBoard', value: true}];
      }

      function submit() {
        self.errorMessage = '';
        if ($scope.boardCategoryWrite.$invalid) {
          self.errorMessage = '빠짐없이 입력해 주세요.';
          return;
        }

        var data = {
          name: self.name,
          resName: self.resName,
          usingBoard: self.usingBoard.filter(function (each) {
            return each.value;
          }).map(function (each) {
            return each.name;
          })
        };
        var promise;

        if ($state.params.id) {
          promise = $http.put(Config.apiServerUrl + '/admin/board/category/write/' + $state.params.id, data)
        } else {
          promise = $http.post(Config.apiServerUrl + '/admin/board/category/write', data)
        }

        promise.then(function () {
          $location.url('/admin/boardCategory');
        });
      }

    }])
    .controller('AdminWriteThumbnailSizeController', ['$http', '$location', 'Config', function ($http, $location, Config) {
      var self = this;

      self.submit = submit;

      $http.get(Config.apiServerUrl + '/admin/thumbnail/size').then(function (response) {
        self.resWidth = response.data.resWidth;
        self.resHeight = response.data.resHeight;
      });

      function submit() {
        $http.post(Config.apiServerUrl + '/admin/thumbnail/size', {
          width: self.width,
          height: self.height,
          galleryId: self.galleryId
        });
      }
    }])
    .controller('AdminWriteHomeDescriptionController', ['$scope', '$http', '$state', '$location', 'Config', function ($scope, $http, $state, $location, Config) {
      var self = this;

      self.submit = submit;

      if ($state.params.id) {
        $http.get(Config.apiServerUrl + '/admin/home/description/' + $state.params.id).then(function (response) {
          var homeDescription = response.data.homeDescription;
          if (homeDescription) {
            self.homeDescription = homeDescription;
            self.priority = homeDescription.priority;
            self.desc = homeDescription.desc;
          }
        });
      }

      function submit() {
        self.errorMessage = '';
        if ($scope.homeDescriptionForm.$invalid) {
          self.errorMessage = '빠짐없이 입력해 주세요.';
          return;
        }

        var data = {
          priority: self.priority,
          desc: self.desc
        };
        var promise;

        if ($state.params.id) {
          promise = $http.put(Config.apiServerUrl + '/admin/home/description/' + $state.params.id, data);
        } else {
          promise = $http.post(Config.apiServerUrl + '/admin/home/description', data);
        }

        promise.then(function () {
          $location.url('/admin/homeDescription');
        }, function () {
          self.errorMessage = '빠짐없이 입력해 주세요.';
        });
      }
    }])
    .controller('AdminWriteAttendanceLeagueController', ['$http', '$location', '$window', '$state', 'Config', function ($http, $location, $window, $state, Config) {
      var self = this;

      self.calcAve = function () {
        self.average = Math.round(self.total / self.games);
      };

      $http.get(Config.apiServerUrl + '/admin/competitions').then(function (response) {
        self.league = 'KL';
        self.competitions = response.data.competitions;
        if (self.competitions && self.competitions[0]) {
          self.competition = self.competitions[0].id;
        }
      }).then(function () {
        if ($state.params.id) {
          $http.get(Config.apiServerUrl + '/admin/league/attendance/' + $state.params.id).then(function (response) {
            var leagueAttendance = response.data.leagueAttendance;
            if (leagueAttendance) {
              self.leagueAttendance = leagueAttendance;
              self.competition = leagueAttendance.competition.id;
              self.origin = leagueAttendance.origin;
              self.season = leagueAttendance.season;
              self.games = leagueAttendance.games;
              self.total = leagueAttendance.total;
              self.average = leagueAttendance.average;
              self.numberOfClubs = leagueAttendance.numberOfClubs;
            }
          });
        }
      });

      self.submit = function () {
        var data = {
          competitionId: self.competition,
          origin: self.origin,
          season: self.season,
          games: self.games,
          total: self.total,
          average: self.average,
          numberOfClubs: self.numberOfClubs
        };

        var promise;

        if ($state.params.id) {
          promise = $http.put(Config.apiServerUrl + '/admin/league/attendance/' + $state.params.id, data)
        } else {
          promise = $http.post(Config.apiServerUrl + '/admin/league/attendance', data)
        }

        promise.then(function () {
          $location.url('/admin/attendanceLeague');
        });
      };

      self.confirmDelete = function () {
        if ($window.confirm('delete?')) {
          $http.delete(Config.apiServerUrl + '/admin/league/attendance/' + $state.params.id).then(function () {
            $location.url('/admin/attendanceLeague');
          });
        }
      };
    }])
    .controller('AdminWriteAttendanceClubController', ['$http', '$location', '$state', 'Config', function ($http, $location, $state, Config) {
      var self = this;
      self.calcAve = function () {
        self.average = Math.round(self.total / self.games);
      };

      $http.get(Config.apiServerUrl + '/admin/origin/football/clubs').then(function (response) {
        self.footballClubs = response.data.originFCs;
        if (self.footballClubs && self.footballClubs[0]) {
          self.origin = self.footballClubs[0].id;
        }
        self.league = 'KL';
      }).then(function () {
        if ($state.params.id) {
          $http.get(Config.apiServerUrl + '/admin/club/attendance/' + $state.params.id).then(function (response) {
            var attendanceClub = response.data.attendanceLeagueWrite;
            if (attendanceClub) {
              self.attendanceClub = attendanceClub;
              self.origin = attendanceClub.origin;
              self.league = attendanceClub.league;
              self.season = attendanceClub.season;
              self.games = attendanceClub.games;
              self.total = attendanceClub.total;
              self.average = attendanceClub.average;
            }
          });
        }
      });

      self.submit = function () {
        var data = {
          origin: self.origin,
          league: self.league,
          season: self.season,
          games: self.games,
          total: self.total,
          average: self.average
        };

        var promise;

        if ($state.params.id) {
          promise = $http.put(Config.apiServerUrl + '/admin/club/attendance/' + $state.params.id, data)
        } else {
          promise = $http.post(Config.apiServerUrl + '/admin/club/attendance', data)
        }

        promise.then(function () {
          $location.url('/admin/attendanceClub');
        });
      };
    }])
    .controller('AdminWriteJakduScheduleController', ['$http', '$location', '$q', '$state', '$window', 'Config', function ($http, $location, $q, $state, $window, Config) {
      var self = this;

      self.mytime = new Date();
      self.format = 'yyyy/MM/dd';
      self.status = {
        opened: false
      };
      self.hstep = 1;
      self.mstep = 15;

      self.open = function () {
        self.status.opened = true;
      };

      $q.all([
        $http.get(Config.apiServerUrl + '/admin/origin/football/clubs'),
        $http.get(Config.apiServerUrl + '/admin/competitions')
      ]).then(function (responses) {
        self.footballClubs = responses[0].data.originFCs;
        self.competitions = responses[1].data.competitions;
        if (self.footballClubs && self.footballClubs[0]) {
          self.home = self.footballClubs[0].id;
          self.away = self.footballClubs[0].id;
        }
        if (self.competitions && self.competitions[0]) {
          self.competition = self.competitions[0].id;
        }
      }).then(function () {
        if ($state.params.id) {
          $http.get(Config.apiServerUrl + '/admin/jakdu/schedule/' + $state.params.id).then(function (response) {
            var schedule = response.data;
            if (schedule) {
              self.schedule = schedule;
              self.mytime = schedule.date;
              self.home = schedule.home;
              self.away = schedule.away;
              self.homeFullTime = schedule.homeFullTime;
              self.awayFullTime = schedule.awayFullTime;
              self.homeOverTime = schedule.homeOverTime;
              self.awayOverTime = schedule.awayOverTime;
              self.homePenaltyShootout = schedule.homePenaltyShootout;
              self.awayPenaltyShootout = schedule.awayPenaltyShootout;
              self.competition = schedule.competition;
              self.timeUp = schedule.timeUp;
              self.groupSeq = schedule.groupSeq;
            }
          });
        }
      });

      self.submit = function () {
        var data = {
          date: self.mytime,
          home: self.home,
          away: self.away,
          homeFullTime: self.homeFullTime,
          awayFullTime: self.awayFullTime,
          homeOverTime: self.homeOverTime,
          awayOverTime: self.awayOverTime,
          homePenaltyShootout: self.homePenaltyShootout,
          awayPenaltyShootout: self.awayPenaltyShootout,
          competition: self.competition,
          timeUp: self.timeUp,
        };

        var promise;
        if ($state.params.id) {
          promise = $http.put(Config.apiServerUrl + '/admin/jakdu/schedule/' + $state.params.id, data);
        } else {
          promise = $http.post(Config.apiServerUrl + '/admin/jakdu/schedule', data);
        }
        promise.then(function () {
          $location.url('/admin/jakduSchedule');
        });
      };

      self.confirmDelete = function () {
        if ($window.confirm('delete?')) {
          $http.delete(Config.apiServerUrl + '/admin/jakdu/schedule/' + $state.params.id).then(function () {
            $location.url('/admin/jakduSchedule');
          });
        }
      };
    }])
    .controller('AdminWriteJakduScheduleGroupController', ['$http', '$location', '$state', '$window', 'Config', function ($http, $location, $state, $window, Config) {
      var self = this;

      self.openDate = new Date();
      self.openDate.setSeconds(0);

      self.format = 'yyyy/MM/dd';
      self.status = {
        opened: false
      };

      self.hstep = 1;
      self.mstep = 15;
      self.state = 'SCHEDULE';

      self.open = function () {
        self.status.opened = true;
      };

      if ($state.params.id) {
        $http.get(Config.apiServerUrl + '/admin/jakdu/schedule/group/' + $state.params.id).then(function (response) {
          var scheduleGroup = response.data;
          if (scheduleGroup) {
            self.scheduleGroup = scheduleGroup;
            self.seq = scheduleGroup.seq;
            self.nextSeq = scheduleGroup.nextSeq;
            self.openDate = scheduleGroup.openDate;
            self.state = scheduleGroup.state;
          }
        });
      }

      self.submit = function () {
        var data = {
          nextSeq: self.nextSeq,
          openDate: self.openDate,
          state: self.state
        };

        var promise;
        if ($state.params.id) {
          promise = $http.put(Config.apiServerUrl + '/admin/jakdu/schedule/group/' + $state.params.id, data);
        } else {
          promise = $http.post(Config.apiServerUrl + '/admin/jakdu/schedule/group', data);
        }
        promise.then(function () {
          $location.url('/admin/jakduScheduleGroup');
        });
      };

      self.confirmDelete = function () {
        if ($window.confirm('delete?')) {
          $http.delete(Config.apiServerUrl + '/admin/jakdu/schedule/group/' + $state.params.id).then(function () {
            $location.url('/admin/jakduScheduleGroup');
          });
        }
      };
    }])
    .controller('AdminWriteCompetitionController', ['$http', '$location', '$state', '$window', 'Config', function ($http, $location, $state, $window, Config) {
      var self = this;

      self.code = 'KL';

      if ($state.params.id) {
        $http.get(Config.apiServerUrl + '/admin/competition/' + $state.params.id).then(function (response) {
          var competition = response.data;
          if (competition) {
            self.competition = competition;
            self.code = competition.code;
            self.shortNameKr = competition.shortNameKr;
            self.fullNameKr = competition.fullNameKr;
            self.shortNameEn = competition.shortNameEn;
            self.fullNameEn = competition.fullNameEn;
          }
        });
      }

      self.submit = function () {
        var data = {
          code: self.code,
          shortNameKr: self.shortNameKr,
          fullNameKr: self.fullNameKr,
          shortNameEn: self.shortNameEn,
          fullNameEn: self.fullNameEn
        };

        var promise;

        if ($state.params.id) {
          promise = $http.put(Config.apiServerUrl + '/admin/competition/' + $state.params.id, data)
        } else {
          promise = $http.post(Config.apiServerUrl + '/admin/competition', data)
        }

        promise.then(function () {
          $location.url('/admin/competition');
        });
      };

      self.confirmDelete = function () {
        if ($window.confirm('delete?')) {
          $http.delete(Config.apiServerUrl + '/admin/competition/' + $state.params.id).then(function () {
            $location.url('/admin/competition');
          });
        }
      };
    }])
    .filter('serializeNames', function () {
      return function (names) {
        return names.reduce(function (prev, curr, idx) {
          prev += curr.fullName;
          if (idx !== names.length - 1) {
            prev += ', ';
          }
          return prev;
        }, '');
      }
    });

});
