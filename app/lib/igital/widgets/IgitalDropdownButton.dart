import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/igital/extensions/num_extensions.dart';

Widget IgitalDropdownButton<T>(
    context, String prefixTitle, T item, List<T> items,
    {Function onTap}) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      Text(
        prefixTitle,
        style: AvailableFonts.getTextStyle(
          context,
          color: MVTheme.grayFont,
          fontSize: 14.scale,
        ),
      ),
      Spacing(
        isVertical: true,
        amount: 0.5,
      ),
      DropdownButton<T>(
        value: item,
        icon: Icon(Icons.arrow_drop_down, color: MVTheme.secondaryColor),
        iconSize: 24,
        elevation: 16,
        style: AvailableFonts.getTextStyle(
          context,
          color: MVTheme.mainFont,
          fontSize: 16.scale,
          weight: FontWeight.bold,
        ),
        isDense: true,
        isExpanded: true,
        underline: Container(
          height: 2,
          color: MVTheme.secondaryColor,
        ),
        onChanged: (T newItem) {
          onTap(newItem);
        },
        items: items.map<DropdownMenuItem<T>>((T value) {
          return DropdownMenuItem<T>(
            value: value,
            child: Text(value.toString()),
          );
        }).toList(),
      ),
    ],
  );
}
