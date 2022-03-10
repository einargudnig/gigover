import 'package:flutter/cupertino.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/models/TaskComment.dart';
import 'package:mittverk/screens/HomeScreen/widgets/EasyRichText/easy_rich_text.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/igital/extensions/num_extensions.dart';

final String userRegex = '@\\[(?<user>.*?)\\]\\((?:.*?)\\)';

class CommentBody extends StatelessWidget {
  final TaskComment comment;

  CommentBody(this.comment);

  @override
  Widget build(BuildContext context) {
    return EasyRichText(
      comment.comment!,
      defaultStyle: AvailableFonts.getTextStyle(
        context,
        color: MVTheme.mainFont,
        fontSize: 14.scale as double,
      ),
      patternList: [
        EasyRichTextPattern(
          targetString: userRegex,
          matchBuilder: (BuildContext context, RegExpMatch match) {
            if (match.namedGroup("user") != null) {
              return TextSpan(
                text: "@" + match.namedGroup("user")!,
                style: TextStyle(fontWeight: FontWeight.bold),
              );
            } else {
              return TextSpan(text: "Default");
            }
          },
        ),
        // EasyRichTextPattern(
        //   targetString: '@\\[(.*?)\\]\\((?:.*?)\\)',
        //   matchBuilder: (BuildContext context, RegExpMatch match) {
        //     return TextSpan("asdf", style:TextStyle(fontWeight: FontWeight.bold));
        //   },
        //   style: TextStyle(fontWeight: FontWeight.bold),
        // ),
      ],
    );

    // return Text(
    //   comment.comment!,
    // );
  }
}
