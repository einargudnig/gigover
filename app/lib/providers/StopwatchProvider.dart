import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:mittverk/providers/HomeProvider.dart';

class StopwatchProvider with ChangeNotifier {
  Stopwatch currentStopwatch = Stopwatch();
  Duration currentStopWatchDuration = Duration.zero;
  int milliseconds;
  ElapsedTime currentElapsedTime;
  Timer _timer;

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

      // notify all listening widgets
      notifyListeners();
    }
  }

  void startStopWatch() {
    if (_timer != null) return;
    currentStopwatch.start();


    _timer = Timer.periodic(Duration(seconds: 1), (Timer timer) {
      _onTick(timer);
      notifyListeners();
    });
    _onTick(_timer);
    currentStopWatchDuration = currentStopwatch.elapsed;
    notifyListeners();
  }

  void stopStopWatch() {
    _timer?.cancel();
    _timer = null;
    currentStopwatch.stop();
    currentStopWatchDuration = currentStopwatch.elapsed;
    notifyListeners();
  }

  void resetStopWatch() {
    stopStopWatch();
    currentStopwatch.reset();
    currentStopWatchDuration = Duration.zero;

    notifyListeners();
  }
}
