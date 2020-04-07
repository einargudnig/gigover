import '../utils/ScaleFactor.dart';

extension Time on int {
  Duration get asHours => Duration(hours: this);
  Duration get asMinutes => Duration(minutes: this);
  Duration get asSeconds => Duration(seconds: this);
  Duration get asMilliseconds => Duration(milliseconds: this);
  Duration get asMicroseconds => Duration(microseconds: this);
}

/* Scale */
extension Scalable on num {
  num get scaleVertical => this * ScaleFactor.blockSizeVertical;
  num get scaleHorizontal => this * ScaleFactor.blockSizeHorizontal;
  num get scale => this * ScaleFactor.blockSizeVertical;
}
