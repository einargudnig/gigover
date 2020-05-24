import 'dart:math';

import '../utils/ScaleFactor.dart';

extension Time on int {
  Duration get asHours => Duration(hours: this);
  Duration get asMinutes => Duration(minutes: this);
  Duration get asSeconds => Duration(seconds: this);
  Duration get asMilliseconds => Duration(milliseconds: this);
  Duration get asMicroseconds => Duration(microseconds: this);
}

num minMaxScaling(num n) {
  return max(min(1, n), 0.8).toDouble();
}

/* Scale */
extension Scalable on num {
  num get scaleVertical => this * minMaxScaling(ScaleFactor.blockSizeVertical);
  num get scaleHorizontal => this * minMaxScaling(ScaleFactor.blockSizeHorizontal);
  num get scale => this * minMaxScaling(ScaleFactor.blockSizeVertical);
}