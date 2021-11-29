import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/widgets/RoundedButton.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/widgets/Input.dart';
import 'package:mittverk/igital/extensions/num_extensions.dart';

import '../../../igital/utils/AvailableFonts.dart';

class LoginForm extends StatelessWidget {
  final TextEditingController? phoneNumberInput;
  final TextEditingController? verificationCodeInput;
  final Function? onSubmit;
  final bool? verificationCodeSent;
  final String? errorMessage;

  LoginForm({
    this.phoneNumberInput,
    this.verificationCodeInput,
    this.onSubmit,
    this.verificationCodeSent,
    this.errorMessage,
  });

  Input getInput() {
    if (verificationCodeSent!) {
      return Input(
        hintText: 'Verification code',
        controller: this.verificationCodeInput,
        textInputType: TextInputType.number,
      );
    }

    return Input(
      hintText: 'Your mobile number',
      controller: this.phoneNumberInput,
      textInputType: TextInputType.number,
    );
  }

  Widget showErrorMessage(BuildContext context) {
    if (errorMessage != null) {
      return Padding(
        padding: const EdgeInsets.only(bottom: Spacing.modifier * 2),
        child: Text(
          errorMessage!,
          style: AvailableFonts.getTextStyle(
            context,
            color: Colors.red,
            fontSize: 16.scale as double,
          ),
        ),
      );
    }

    return Container();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(Spacing.modifier * 3),
      child: Column(
        children: <Widget>[
          showErrorMessage(context),
          getInput(),
          Spacing(amount: 2),
          RoundedButton(
            fillBackground: Color.fromRGBO(31, 223, 131, 1),
            textColor: Color.fromRGBO(7, 16, 41, 1),
            onTap: onSubmit,
            text: verificationCodeSent! ? 'Verify code' : 'Sign in',
          ),
        ],
      ),
    );
  }
}
