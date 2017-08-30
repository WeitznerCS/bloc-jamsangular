(function() {
  /**
 * SongPlayer service manages playing, pausing a song, and tracks its state
 * @constructor
 */

    function SongPlayer($rootScope, Fixtures) {
         var SongPlayer = {};
         var currentSong = null;
         var currentAlbum = Fixtures.getAlbum();

             /**

* @function getSongIndex() - Private
* @desc - Returns position of currently active song in album/song object.
* Player bar only needs to know one song, not all of the songs.
* @param {Object} song - currently active song
*/
         var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
    };
/**
* @desc Active song object from list of songs
* @type {Object}
*/
         SongPlayer.currentSong = null;

/**
* @desc Current playback time (in seconds) of currently playing song
* @type {Number}
*/
        SongPlayer.currentTime = null;

/**
* @desc Buzz object audio file
* @type {Object}
*/
         var currentBuzzObject = null;

         SongPlayer.volume = null;


 /**
* @function setSong
* @desc Stops currently playing song and loads new audio file as currentBuzzObject
* @param {Object} song
*/

         var setSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
              }

              currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
          });

          currentBuzzObject.bind('timeupdate', function() {
            $rootScope.$apply(function() {
              SongPlayer.currentTime = currentBuzzObject.getTime();
            });
          });
          SongPlayer.currentSong = song;
        };

/**
* @function play() - Public
* @desc Plays selected song, and set its playing state which
 * impacts how it's displayed to the user
* @param  {Object} song - one song in array of album object
*/
         SongPlayer.play = function(song) {
           song = song || SongPlayer.currentSong;
           if (currentSong !== song) {
             setSong(song);
             playSong(song);

           } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                    //song.playing = true;
                }
            }
         };

         SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
          };

/**
* @function previous() - Public
* @desc Starts playing song located previous to currently active song
* @param {Object} song [one song in album object array]
*/
          SongPlayer.previous = function(song) {
              var currentSongIndex = getSongIndex(SongPlayer.currentSong);
              currentSongIndex--;

              if (currentSongIndex < 0) {
                  stopSong();
                } else {
                  var song = currentAlbum.songs[currentSongIndex];
                    setSong(song);
                    playSong(song);
                }
            };


/**
* @function next() - Public
* @desc Starts playing song located after currently active song
* @param {Object} song [one song in album object array]
*/

        SongPlayer.next = function(song) {
          var currentSongIndex = getSongIndex(SongPlayer.currentSong);
          currentSongIndex++;

          if (currentSongIndex >= currentAlbum.songs.length) {
            stopSong();
          } else {
            song = currentAlbum.songs[currentSongIndex];
            setSong(song);
            playSong(song);
          }
        };

/**
* @function setCurrentTime
* @desc Set current time (in seconds) of currently playing song
* @param {Number} time
*/
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };
/**
* @function playSong (private)
* @desc plays current Buzz object, sets playing property to true
* @param  {Object} song [one song in album object array]
*/
            var playSong = function(song) {
              setSong(song);
              currentBuzzObject.play();
              song.playing = true;
            };

/**
* @function setVolume() - Public
* @desc Set volume according to seek bar changes
* @param {Number} volume level from (0-100)
*/

      SongPlayer.setVolume = function(vol) {

          if (currentBuzzObject) {
              SongPlayer.volume = vol;
              currentBuzzObject.setVolume(vol);
          }
      };

/**
 * @function stopSong() - Private
 * @desc Stops active song from playing, and resets playing status
 * to null so nothing plays
 * @param {Object} song [one song in album object array]
 */
      var stopSong = function(song) {
          currentBuzzObject.stop()
          SongPlayer.currentSong.playing = null;
        };

         return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
