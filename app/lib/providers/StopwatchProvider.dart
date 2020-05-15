import 'dart:async';

import 'package:mittverk/providers/HomeProvider.dart';

class StopwatchProvider {
  Stopwatch currentStopwatch = Stopwatch();
  int milliseconds;

  Duration currentStopWatchDuration = Duration.zero;
  ElapsedTime currentElapsedTime;

  //This is if the timer is old then we have some additionalTime
  Duration addedTime = Duration.zero;
  ElapsedTime addedElapsedTime;

  Timer _timer;
  Function callback;

  get isRunning => this.currentStopWatchDuration != Duration.zero;

  void setAddedTime(ElapsedTime elapsedTime, Duration duration) {
    this.addedElapsedTime = elapsedTime;
    this.addedTime = duration;
    this.setTime(elapsedTime, duration);
  }

  void setTime(ElapsedTime elapsedTime, Duration duration) {
    this.currentElapsedTime = elapsedTime;
    this.currentStopWatchDuration = duration;
  }

  void _onTick(Timer timer) {
    if (milliseconds != currentStopwatch.elapsedMilliseconds) {
      milliseconds = this.addedTime != null &&
              this.addedTime.inMilliseconds != null
          ? currentStopwatch.elapsedMilliseconds + this.addedTime.inMilliseconds
          : currentStopwatch.elapsedMilliseconds;

      int hundreds = (milliseconds / 10).truncate();
      int seconds = (hundreds / 100).truncate();
      int minutes = (seconds / 60).truncate();
      ElapsedTime elapsedTime = new ElapsedTime(
        hundreds: hundreds,
        seconds: seconds,
        minutes: minutes,
      );
      this.setTime(elapsedTime, currentStopwatch.elapsed);
    }
  }

  void startStopWatch(callback) {
    if (_timer != null) return;
    currentStopwatch.start();

    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      _onTick(timer);
      callback();
    });
    _onTick(_timer);
    currentStopWatchDuration = currentStopwatch.elapsed;
    callback();
  }

  void stopStopWatch() {
    _timer?.cancel();
    _timer = null;
    currentStopwatch.stop();
    currentStopWatchDuration = currentStopwatch.elapsed;
  }

  void resetStopWatch() {
    this.addedTime = null;
    this.addedElapsedTime = null;
    stopStopWatch();
    currentStopwatch.reset();
    currentStopWatchDuration = Duration.zero;
  }
}
