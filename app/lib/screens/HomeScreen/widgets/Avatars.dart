import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';

Widget Avatar(BuildContext context, String text, int index,
    {bool special = false}) {
  return Positioned(
    top: 0,
    left: (index * 20).toDouble(),
    child: CircleAvatar(
      maxRadius: 17,
      backgroundColor: Colors.white,
      child: CircleAvatar(
          backgroundColor: special ? Colors.greenAccent : Colors.deepOrange,
          child: Text(text,
              style: AvailableFonts.getTextStyle(context,
                  color: Colors.white, fontSize: 10)),
          maxRadius: 16),
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
