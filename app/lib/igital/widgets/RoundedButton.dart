import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import '../extensions/num_extensions.dart';
import '../utils/AvailableFonts.dart';

// ignore: must_be_immutable
class RoundedButton extends StatefulWidget {
  Function onTap;
  Widget icon;
  String text;
  Color fillBackground;
  Color disabledFillBackground;
  Color textColor;
  bool loading;
  bool disabled;
  Widget child;
  bool small;
  bool borderColorFromTextColor;
  List<String> subtitle;
  double borderRadius;
  EdgeInsets padding;

  RoundedButton(
      {onTap,
      text,
      icon,
      disabledFillBackground,
      fillBackground,
      textColor,
      loading,
      disabled,
      small,
      borderColorFromTextColor,
      child,
      subtitle,
      borderRadius,
      padding}) {
    this.onTap = onTap;
    this.text = text;
    this.child = child;
    this.icon = icon;
    this.fillBackground = fillBackground;
    this.disabledFillBackground = disabledFillBackground != null
        ? disabledFillBackground
        : fillBackground;
    this.textColor = textColor != null ? textColor : Colors.white;
    this.loading = loading == null ? false : loading;
    this.disabled = disabled == null ? false : disabled;
    this.small = small == null ? false : small;
    this.borderColorFromTextColor =
        borderColorFromTextColor == null ? false : borderColorFromTextColor;
    this.subtitle = subtitle;
    this.borderRadius = borderRadius != null ? borderRadius : 12.0;
    this.padding = padding;
  }

  @override
  RoundedButtonState createState() => RoundedButtonState();
}

class RoundedButtonState extends State<RoundedButton>
    with SingleTickerProviderStateMixin {
  double _scale;
  AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 50),
      lowerBound: 0.0,
      upperBound: 0.08,
    )..addListener(() {
        setState(() {});
      });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void tapDownRoundedButton(TapDownDetails details) {
    _controller.forward();
  }

  void tapUpRoundedButton(TapUpDetails details) {
    resetButton();
  }

  void resetButton() {
    _controller.reverse();
  }

  Widget buttonChild(BuildContext context) {
    // TODO Add loader to this widget
    if (widget.loading) {
      return Center(
        child: Container(
          width: 24,
          height: 24,
          //child: LoadingIndicator(darkMode: false),
        ),
      );
    }

    Widget text = widget.child != null
        ? widget.child
        : Text(
            widget.text,
            style: AvailableFonts.getTextStyle(
              context,
              color: widget.textColor,
              fontSize: widget.small ? 16 : 20,
            ),
          );

    if (widget.subtitle != null && widget.subtitle.length > 0) {
      text = Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          SizedBox(height: 4),
          text,
          ...widget.subtitle.map(
            (w) => Text(
              w,
              style: AvailableFonts.getTextStyle(
                context,
                color: widget.textColor,
                fontSize: widget.small ? 12.scale : 14.scale,
              ),
            ),
          ),
          SizedBox(height: 4)
        ],
      );
    }

    if (widget.icon != null) {
      return Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[text, widget.icon],
      );
    }

    return Container(
      child: text,
    );
  }

  Color getBorderColor() {
    if (widget.borderColorFromTextColor) {
      return widget.textColor;
    }

    // TODO IMPLEMENT COLOR LIGHTGREEN to Theme
    return widget.fillBackground == null
        ? Colors.lightGreen
        : widget.fillBackground;
  }

  EdgeInsets getButtonPadding() {
    if (widget.padding != null) {
      return widget.padding;
    }

    return widget.small
        ? const EdgeInsets.fromLTRB(10, 6, 10, 8)
        : const EdgeInsets.fromLTRB(16, 12, 12, 12);
  }

  @override
  Widget build(BuildContext context) {
    if (_controller != null) {
      _scale = 1 - _controller.value;
    } else {
      _scale = 1;
    }

    return GestureDetector(
      onTap: () {
        if (!widget.disabled) {
          print('Tapping RoundedButton');
          widget.onTap();
        }
      },
      onTapDown: tapDownRoundedButton,
      onTapUp: tapUpRoundedButton,
      onTapCancel: resetButton,
      child: Transform.scale(
        scale: _scale,
        child: Container(
          padding: getButtonPadding(),
          decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(widget.borderRadius),
              border: Border.all(color: getBorderColor(), width: 2),
              color: widget.disabled
                  ? widget.disabledFillBackground
                  : widget.fillBackground),
          child: Center(
            child: buttonChild(context),
          ),
        ),
      ),
    );
  }
}
