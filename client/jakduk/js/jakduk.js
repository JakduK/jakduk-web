'use strict';

define(['angular', 'common'], function (angular) {
  angular.module('jakdukCommon', [])
    .config(['$interpolateProvider', '$httpProvider', function ($interpolateProvider, $httpProvider) {
      $interpolateProvider.startSymbol('{%');
      $interpolateProvider.endSymbol('%}');
      $httpProvider.defaults.withCredentials = true;
    }])
    // mongodb id의 앞 8자리(16진수)로 Date 객체 생성.
    .filter('dateFromObjectId', function () {
      return function (objectId) {
        return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
      };
    })
    // mongodb id의 앞 8자리(16진수)를 int로 변환.
    .filter('intFromObjectId', function () {
      return function (objectId) {
        return parseInt(objectId.substring(0, 8), 16) * 1000;
      };
    })
    .filter('objectIdFromDate', function () {
      return function (date) {
        return Math.floor(date.getTime() / 1000).toString(16) + '0000000000000000';
      };
    })
    .filter('filesize', function () {
      return function (bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
          return '-';
        }
        if (typeof precision === 'undefined') {
          precision = 1;
        }

        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
        var number = Math.floor(Math.log(bytes) / Math.log(1024));

        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
      };
    })
    .controller('headerCtrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
      var port = $location.port();
      var prefix = $location.protocol() + '://' + $location.host();
      var prefixPath = (port === 80 || port === 443) ? prefix : prefix + ':' + $location.port();
      var absUrl = $location.absUrl();
      var path = absUrl.slice(prefixPath.length);

      $scope.isActive = function (viewLocation) {
        return path.match(viewLocation);
      };

      $scope.btnEnterOnHeaderSearch = function () {
        if ($scope.searchOnHeader.trim() < 1) {
          return;
        }

        $window.location = '/search?q=' + $scope.searchOnHeader.trim() + '&w=PO;CO;GA;';
      };

      $scope.toggleSearchOnHeader = function () {
        $scope.searchFocusOnHeader = !$scope.searchFocusOnHeader;
      };
    }])
    .directive('focusy', [function () {
      return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
          focusy: '='
        },
        link: function (scope, element) {
          scope.$watch('focusy', function (newValue) {
            if (newValue) {
              element.focus();
            }
          });
        }
      };
    }])
    .directive('autofillFixer', [function () {
      return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
          if (elem.val()) {
            ngModel.$setViewValue(elem.val());
          }
        }
      };
    }]);

  window.Jakduk = {
    BoardCommentSize: 30,
    BoardCommentContentLengthMin: 3, // 게시판 댓글 입력 가능한 최소한의 문자열 수
    BoardCommentContentLengthMax: 800, // 게시판 댓글 입력 가능한 최대 문자열 수
    SummernoteContentsMinSize: 5,
    FormEmailLengthMin: 6,
    FormEmailLengthMax: 30,
    FormPasswordLengthMin: 4,
    FormPasswordLengthMax: 20,
    FormUsernameLengthMin: 2,
    FormUsernameLengthMax: 20,
    ItemsPerPageOnSearch: 10, // 찾기에서 페이지 당 아이템 수
    ItemsPerPageOnSearchGallery: 12, // 찾기에서 사진첩의 페이지 당 아이템 수
    ItemsPerPageOnGallery: 24, // 사진첩에서 한번 로딩할때 가져오는 그림의 수
    ItemsPerPageOnBoardComments: 10,
    isEmpty: function (str) {
      return !str;
    },
    needLogin: function (message) {
      if (window.confirm(message)) {
        window.location = '/board/free/write';
      }
    }
  };

  return window.Jakduk;
});
