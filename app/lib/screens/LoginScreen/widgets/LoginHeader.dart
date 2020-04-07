import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/extensions/num_extensions.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';

class LoginHeader extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    const paddingAmount = Spacing.modifier * 4;

    return Padding(
      padding: const EdgeInsets.only(top: paddingAmount, bottom: paddingAmount),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Container(
              width: 192.scaleHorizontal,
              height: 43.scaleVertical,
              child: SvgPicture.asset("assets/logo/mittverk.svg")
          ),
          Container(
            child: Text(
              'Login screen',
              style: AvailableFonts.getTextStyle(context, color: Colors.black),
            ),
          ),
        ],
      ),
    );
  }
}
