import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/igital/extensions/num_extensions.dart';
import 'package:mittverk/utils/Theme.dart';

class CardTitle extends StatelessWidget {
  final String subtitle;
  final String title;
  final Widget icon;

  CardTitle({
    @required this.title,
    this.subtitle,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        subtitle != null ? Text(
          subtitle,
          style: AvailableFonts.getTextStyle(
            context,
            color: MVTheme.grayFont,
            fontSize: 14.scale,
          ),
        ) : Container(),
        subtitle != null ? Spacing(
          isVertical: true,
        ) : Container(),
        Text(
          title,
          style: AvailableFonts.getTextStyle(
            context,
            color: MVTheme.mainFont,
            fontSize: 16.scale,
            weight: FontWeight.bold,
          ),
        )
      ],
    );
  }
}
