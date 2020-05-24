import 'package:flutter/cupertino.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/models/ProjectType.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:provider/provider.dart';
import 'package:mittverk/igital/extensions/num_extensions.dart';

class ProjectTypeLabel extends StatelessWidget {
  final int typeId;

  ProjectTypeLabel({
    @required this.typeId,
  });

  @override
  Widget build(BuildContext context) {
    return Consumer<HomeProvider>(
      builder: (context, homeProvider, child) {
        var typeLabel = 'Unknown';

        if (homeProvider.projectTypes.length > 0) {
          ProjectType type = homeProvider.projectTypes.singleWhere((pt) => pt.typeId == typeId);

          if (type != null) {
            typeLabel = type.name;
          }
        }

        return Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(4),
            color: MVTheme.blueLabelBackground,
          ),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(8, 6, 8, 6),
            child: Text(
              typeLabel,
              style: AvailableFonts.getTextStyle(
                context,
                fontSize: 13.scale,
                weight: FontWeight.bold,
                color: MVTheme.blueLabelText,
              ),
            ),
          ),
        );
      },
    );
  }
}
