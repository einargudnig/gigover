import 'dart:async';

import 'package:mittverk/providers/HomeProvider.dart';

class StopwatchProvider {
  Stopwatch currentStopwatch = Stopwatch();
  Duration currentStopWatchDuration = Duration.zero;
  int milliseconds;
  ElapsedTime currentElapsedTime;
  Timer _timer;

  Function callback;

  get isRunning => this.currentStopWatchDuration != Duration.zero;

  void _onTick(Timer timer) {
    if (milliseconds != currentStopwatch.elapsedMilliseconds) {
      milliseconds = currentStopwatch.elapsedMilliseconds;
      int hundreds = (milliseconds / 10).truncate();
      int seconds = (hundreds / 100).truncate();
      int minutes = (seconds / 60).truncate();
      ElapsedTime elapsedTime = new ElapsedTime(
        hundreds: hundreds,
        seconds: seconds,
        minutes: minutes,
      );
      currentStopWatchDuration = currentStopwatch.elapsed;
      currentElapsedTime = elapsedTime;

    }
  }

  void startStopWatch(callback) {
    if (_timer != null) return;
    currentStopwatch.start();

    _timer = Timer.periodic(Duration(seconds: 1), (timer){
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
    stopStopWatch();
    currentStopwatch.reset();
    currentStopWatchDuration = Duration.zero;
  }
}
