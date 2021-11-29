
import 'package:flutter/widgets.dart';

class ScaleFactor {
 static late MediaQueryData _mediaQueryData;
 static late double screenWidth;
 static late double screenHeight;
 static late double blockSizeHorizontal;
 static late double blockSizeVertical;
 
 ScaleFactor(BuildContext context) {
  _mediaQueryData = MediaQuery.of(context);
  screenWidth = _mediaQueryData.size.width;
  screenHeight = _mediaQueryData.size.height;
  blockSizeHorizontal = screenWidth / 414;
  blockSizeVertical = screenHeight / 896;
 }
}