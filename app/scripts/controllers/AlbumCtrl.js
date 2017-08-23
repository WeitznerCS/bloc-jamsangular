(function() {
  function AlbumCtrl($scope) {
    $scope.albumData = albumPicasso;
  }

  angular
    .module('blocJams')
    .controller('AlbumCtrl', AlbumCtrl);
})();
