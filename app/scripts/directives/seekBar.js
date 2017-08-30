/**
 * @desc Directive that describes the behavior you need to manage the
 * seek bar in the control bar
 * 'templateUrl', 'replace' (true/false), and 'restrict' (specifies declared type:
 * -- 'E' element,
 * -- 'A' attribute,
 * -- 'C' class,
 * -- 'M' comment
 * @return {object} - Public
 *
*/
(function() {
    function seekBar($document) {

/**
* @desc Calculates the horizontal percentage along the seek bar where the event
* (passed in from the view as $event) has occurred.
* @param  {jQuery obj} seekBar [ Holds the element that matches
* (<seek-bar>) as a jQuery object so we can call jQuery methods ]
* @param  {[type]} event   [activated triggered vent]
* @return {Integer}        [new percentage to play song]
*/
    var calculatePercent = function(seekBar, event) {
      var offsetX = event.pageX - seekBar.offset().left;
      var seekBarWidth = seekBar.width();
      var offsetXPercent = offsetX / seekBarWidth;
      offsetXPercent = Math.max(0, offsetXPercent);
      offsetXPercent = Math.min(1, offsetXPercent);
      return offsetXPercent;
      };

      return {
        templateUrl: '/templates/directives/seek_bar.html',
        replace: true,
        restrict: 'E',
        scope: {
          onChange: '&'
          },
        link: function(scope, element, attributes) {
          scope.value = 0;
          scope.max = 100;

          var seekBar = $(element);

          attributes.$observe('value', function(newValue) {
              scope.value = newValue;
            });

          attributes.$observe('max', function(newValue) {
              scope.max = newValue;
            });

          var percentString = function () {
              var value = scope.value;
              var max = scope.max;
              var percent = value / max * 100;
              return percent + "%";
          };

/**
// @function fillStyle() - Public
// @desc Formats seekbar based on how much of song has played.
*/
          scope.fillStyle = function() {
              return {width: percentString()};
          };

/**
// @function onClickSeekBar() - Public
// @desc activated when seekbar clicked to adjust song playback
// @param [$event] - saved to refer to page location
*/
          scope.onClickSeekBar = function(event) {
              var percent = calculatePercent(seekBar, event);
              scope.value = percent * scope.max;
              notifyOnChange(scope.value);
            };

/**
// @function thumbStyle() - Public
// @desc format thumb portion of fill bar to show adjusted position
*/
            scope.thumbStyle = function() {
              return {left: percentString()};
            }
/**
* @function trackThumb - Public
* @desc Similar to scope.onClickSeekBar, but uses $apply to constantly
* apply the change in value of  scope.value as the user drags
* the seek bar thumb.
*/
            scope.trackThumb = function() {
              $document.bind('mousemove.thumb', function(event) {
                var percent = calculatePercent(seekBar, event);
                scope.$apply(function() {
                  scope.value = percent * scope.max;
                  notifyOnChange(scope.value);
          });
      });

      $document.bind('mouseup.thumb', function() {
          $document.unbind('mousemove.thumb');
          $document.unbind('mouseup.thumb');
          });
        };


/**
* @function notifyOnChange() - Private
* @desc Notifies onChange property of 'scope' which calls the
* function in the attribute ('&' flag)
* @param  {Number} newValue changed value to apply to setting
*/
        var notifyOnChange = function(newValue) {
            if (typeof scope.onChange === 'function') {
            scope.onChange({value: newValue});
          }
        };
      }
    };
  }

    angular
        .module('blocJams')
        .directive('seekBar', ['$document', seekBar]);
})();
