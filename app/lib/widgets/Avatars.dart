import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';

Widget onlyAvatar(BuildContext context, {required String text, bool special = false, double circleSize = 16 }) {
  return CircleAvatar(
    maxRadius: circleSize + 1,
    backgroundColor: Colors.white,
    child: CircleAvatar(
        backgroundColor: special ? Colors.greenAccent : Colors.deepOrange,
        child: Text(text,
            style: AvailableFonts.getTextStyle(context,
                color: Colors.white, fontSize: circleSize * 0.625)),
        maxRadius: circleSize),
  );
}

Widget Avatar(
  BuildContext context,
  String text,
  int index, {
  bool special = false,
}) {
  return Positioned(
    top: 0,
    left: (index * 20).toDouble(),
    child: onlyAvatar(
      context,
      text: text,
      special: special,
    ),
  );
}

Widget Avatars(BuildContext context, List<String> people) {
  int i = 0;
  List<Widget> avatars = [];
  for (final String f in people) {
    avatars.add(Avatar(context, f, i));
    i++;

    if (i == 4) {
      break;
    }
  }
  if (people.length > 4) {
    avatars.add(Avatar(
      context,
      "+" + (people.length - avatars.length).toString(),
      4,
      special: true,
    ));
  }
  return Container(
    height: 33,
    child: Stack(
      children: <Widget>[...avatars],
    ),
  );
}
