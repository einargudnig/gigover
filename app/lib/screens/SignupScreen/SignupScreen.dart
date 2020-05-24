import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/RoundedButton.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/models/VerifyUser.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/services/ApiService.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/widgets/Input.dart';
import 'package:provider/provider.dart';
import 'package:mittverk/igital/extensions/num_extensions.dart';

class SignupScreen extends StatefulWidget {
  @override
  State createState() => SignupScreenState();
}

class SignupScreenState extends State<SignupScreen> {

  bool _signupProcessing;
  String _errorMessage;

  TextEditingController fullName = TextEditingController();
  TextEditingController email = TextEditingController();
  TextEditingController address = TextEditingController();
  TextEditingController postalCode = TextEditingController();
  TextEditingController postalTown = TextEditingController();
  TextEditingController username = TextEditingController();

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  bool setError(String message) {
    setState(() {
      _errorMessage = message;
    });
    return false;
  }

  bool isTextInvalid(TextEditingController ctrl) {
    return ctrl == null || ctrl.text == null || ctrl.text.length <= 0;
  }

  bool isEmail(String em) {
    String p = r'^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$';
    RegExp regExp = new RegExp(p);

    return regExp.hasMatch(em);
  }

  bool isValidSignup() {
    if (isTextInvalid(fullName)) {
      return setError('You need to fill in your name');
    }

    if (isTextInvalid(email)) {
      return setError('Email is required');
    }

    if (!isEmail(email.text)) {
      return setError('The email you provided is not valid');
    }

    if (isTextInvalid(address)) {
      return setError('You need to fill in the address');
    }

    if (isTextInvalid(postalCode)) {
      return setError('Postal code is invalid');
    }

    if (isTextInvalid(postalTown)) {
      return setError('Postal town is invalid');
    }

    return true;
  }

  void setLoading(bool isLoading) {
    setState(() {
      _signupProcessing = isLoading;
    });
  }

  void signupComplete() {
    HomeProvider homeProvider = Provider.of<HomeProvider>(context, listen: false);
    homeProvider.signupCompleted();
  }

  void signup() async {
    setError(null);

    if (isValidSignup()) {
      String serverErrorMessage = "Error happened when registering user, please try again or contact support.";

      setLoading(true);
      try {
        Response response = await ApiService.registerUser({
          'address': address.text,
          'email': email.text,
          'zipCode': postalCode.text,
          'type': UserType.Worker.index,
          'name': fullName.text,
          'userName': username.text,
        });

        print(response);
        print(response.data);

        if (response.statusCode != 200) {
          setError(serverErrorMessage);
          setLoading(false);
        } else {
          signupComplete();
        }
      } catch(e) {
        print(e);
        print('EXCEPTION IN REGISTERING USER');
        setError(serverErrorMessage);
        setLoading(false);
      }
    }
  }

  Widget showErrorMessage() {
    if (_errorMessage != null) {
      return Container(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Spacing(amount: 2, isVertical: true),
            Text(_errorMessage, style: AvailableFonts.getTextStyle(context, color: MVTheme.redColor, weight: FontWeight.bold)),
          ],
        )
      );
    }
    
    return Container();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: ListView(
          shrinkWrap: true,
          children: <Widget>[
            Text(
              'Welcome to the Mittverk app',
              style: AvailableFonts.getTextStyle(
                context,
                weight: FontWeight.bold,
                color: MVTheme.primaryColor,
                fontSize: 16.scale,
              ),
              textAlign: TextAlign.center,
            ),
            Spacing(amount: 2, isVertical: true),
            Text(
                'Before you can start using our app you need to finish signing up by filling up the details below.',
                style: AvailableFonts.getTextStyle(
                  context,
                  color: MVTheme.primaryColor,
                  fontSize: 15.scale,
                )),
            Spacing(amount: 2, isVertical: true),
            Input(
              controller: fullName,
              hintText: 'Full name',
            ),
            Spacing(amount: 2, isVertical: true),
            Input(
              controller: email,
              hintText: 'Email address',
            ),
            Spacing(amount: 2, isVertical: true),
            Input(
              controller: address,
              hintText: 'Your address',
            ),
            Spacing(amount: 2, isVertical: true),
            Container(
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Expanded(
                    flex: 1,
                    child: Input(
                      controller: postalCode,
                      hintText: 'Zip',
                    ),
                  ),
                  SizedBox(width: 16,),
                  Expanded(
                    flex: 2,
                    child: Input(
                      controller: postalTown,
                      hintText: 'City or Town',
                      textInputType: TextInputType.number,
                    ),
                  ),
                ],
              )
            ),
            Spacing(amount: 2, isVertical: true),
            Input(
              controller: username,
              hintText: 'Username (optional)',
            ),
            showErrorMessage(),
            Spacing(amount: 2, isVertical: true),
            RoundedButton(
              loading: _signupProcessing,
              onTap: () {
                signup();
              },
              text: 'Signup',
              textColor: MVTheme.primaryColor,
              fillBackground: MVTheme.secondaryColor,
            )
          ],
        ),
      ),
    );
  }
}
