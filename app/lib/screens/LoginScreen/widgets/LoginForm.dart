import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/DebugBorder.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';

class LoginForm extends StatelessWidget {
  final TextEditingController phoneNumberInput;
  final TextEditingController verificationCodeInput;
  final Function onSubmit;

  LoginForm({ this.phoneNumberInput, this.verificationCodeInput, this.onSubmit });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(Spacing.modifier * 3),
      child: Column(
        children: <Widget>[
          Container(
            child: TextField(
              decoration: InputDecoration(
                fillColor: Colors.white,
                focusColor: Colors.black.withAlpha(150),
                hintStyle: TextStyle(color: Colors.black.withAlpha(150)),
                hintText: 'Your mobile number',
                border: OutlineInputBorder(),
                filled: true,
                focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Color.fromRGBO(31, 223, 131, 1))),
              ),
              controller: this.phoneNumberInput,
              keyboardType: TextInputType.number,
            )
          ),
          Container(
            child: Text(
              'LoginForm x29',
              style: AvailableFonts.getTextStyle(context, color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }
}
