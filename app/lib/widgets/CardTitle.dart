import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/utils/Theme.dart';

class CardTitle extends StatelessWidget {
  final String subtitle;
  final String title;
  final Widget icon;

  CardTitle({
    @required this.subtitle,
    @required this.title,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text(
          subtitle,
          style: AvailableFonts.getTextStyle(
            context,
            color: MVTheme.grayFont,
            fontSize: 10,
          ),
        ),
        Spacing(
          isVertical: true,
        ),
        Text(
          title,
          style: AvailableFonts.getTextStyle(
            context,
            color: MVTheme.mainFont,
            fontSize: 14,
            weight: FontWeight.bold,
          ),
        )
      ],
    );
  }
}
