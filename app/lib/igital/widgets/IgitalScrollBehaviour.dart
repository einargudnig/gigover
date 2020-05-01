
import 'package:flutter/material.dart';

// Being used to remove the blue glow that appears on android
// devices when scrolling to the end.
// See: https://stackoverflow.com/questions/51119795/how-to-remove-scroll-glow
// Used in ScreenWrapper.dart
class IgitalScrollBehaviour extends ScrollBehavior {
  @override
  Widget buildViewportChrome(BuildContext context, Widget child, AxisDirection axisDirection) {
    return child;
  }
}