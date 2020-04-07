extension ScreenSizeExtensions on double {

  double scale(double width, double height) {
    // w/h
    double initialScale = 414 / 736;
    double currentScale = width / height;

    if (initialScale == currentScale) {
      return this;
    } else {
      return this * currentScale;
    }

  }
}