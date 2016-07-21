(function () {
  'use strict';

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
    ItemsPerPageOnSearch: 10, 			// 찾기에서 페이지 당 아이템 수
    ItemsPerPageOnSearchGallery: 12, 	// 찾기에서 사진첩의 페이지 당 아이템 수
    ItemsPerPageOnGallery: 24,  		// 사진첩에서 한번 로딩할때 가져오는 그림의 수
    ItemsPerPageOnBoardComments: 10,
    origin: window.location.protocol + window.location.host + (window.location.port ? ':' + window.location.port : window.location.port),
    isEmpty: function (str) {
      var obj = String(str);
      return !!(obj === null || obj === undefined || obj === 'null' || obj === 'undefined' || obj === '');
    },
    needLogin: function (message) {
      if (window.confirm(message)) {
        window.location.href = '/board/free/write';
      }
    }
  };
}());

(function () {
  'use strict';

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
      }
    })
    // mongodb id의 앞 8자리(16진수)를 int로 변환.
    .filter('intFromObjectId', function () {
      return function (objectId) {
        return parseInt(objectId.substring(0, 8), 16) * 1000;
      }
    })
    .filter('objectIdFromDate', function () {
      return function (date) {
        return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
      }
    })
    .controller("headerCtrl", ['$scope', '$location', function ($scope, $location) {

      var port = $location.port();
      var prefix = $location.protocol() + '://' + $location.host();
      var prefixPath = (port == 80 || port == 443) ? prefix : prefix + ':' + $location.port();
      var absUrl = $location.absUrl();
      var path = absUrl.slice(prefixPath.length);

      $scope.isActive = function (viewLocation) {
        return path.match(viewLocation);
      };

      $scope.btnEnterOnHeaderSearch = function (url) {
        if ($scope.searchOnHeader.trim() < 1) {
          return;
        }

        location.href = url + '?q=' + $scope.searchOnHeader.trim() + '&w=PO;CO;GA;';
      };

      $scope.btnSearchOnHeader = function () {
        $scope.searchFocusOnHeader = true;
      };
    }])
    .directive('focus', ['$timeout', '$parse', function ($timeout, $parse) {
      /**
       * focus directive
       * http://fiddle.jshell.net/ubenzer/9FSL4/8/
       */
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          scope.$watch(attrs.focus, function (newValue, oldValue) {
            if (newValue) {
              element[0].focus();
            }
          });
          element.bind("blur", function (e) {
            $timeout(function () {
              scope.$apply(attrs.focus + "=false");
            }, 0);
          });
          element.bind("focus", function (e) {
            $timeout(function () {
              scope.$apply(attrs.focus + "=true");
            }, 0);
          })
        }
      }
    }]);

}());
