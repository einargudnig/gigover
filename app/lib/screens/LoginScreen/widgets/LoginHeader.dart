import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:mittverk/igital/extensions/num_extensions.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';

class LoginHeader extends StatelessWidget {
  final bool verificationCodeSent;
  final String? phoneNumber;

  LoginHeader({this.verificationCodeSent = false, this.phoneNumber = ''});

  @override
  Widget build(BuildContext context) {
    const paddingAmount = Spacing.modifier * 6;

    return Padding(
      padding: const EdgeInsets.only(top: paddingAmount, bottom: paddingAmount),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Container(
            width: 192.scaleHorizontal as double?,
            height: 43.scaleVertical as double?,
            child: SvgPicture.asset("assets/logo/gigover.svg"),
          ),
          Padding(
            padding: const EdgeInsets.only(
              top: Spacing.modifier * 2,
              left: paddingAmount * 0.75,
              right: paddingAmount * 0.75,
            ),
            child: Container(
              child: Text(
                verificationCodeSent
                    ? 'We have sent a verification code to the phone number $phoneNumber. It could take a few moments to arrive, please wait.'
                    : 'Enter your mobile number and we will send you a verification code to sign in with.',
                textAlign: TextAlign.center,
                style: AvailableFonts.getTextStyle(context,
                    color: Theme.of(context).accentColor),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
