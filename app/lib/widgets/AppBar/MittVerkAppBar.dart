import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:mittverk/igital/extensions/num_extensions.dart';
import 'package:mittverk/main.dart';
import 'package:mittverk/utils/Theme.dart';

class MittVerkAppBar extends StatefulWidget implements PreferredSizeWidget {
  final Function onBack;
  final Function onSettings;

  MittVerkAppBar({this.onBack, this.onSettings, Key key})
      : preferredSize = Size.fromHeight(kToolbarHeight),
        super(key: key);

  @override
  final Size preferredSize; // default is 56.0

  @override
  State createState() => MittVerkAppBarState();
}

class MittVerkAppBarState extends State<MittVerkAppBar> {

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    bool showGearIcon = true;
    bool showBack = true;

    return AppBar(

      backgroundColor: MVTheme.appBarBackgroundColor,
      title: SvgPicture.asset(
        'assets/logo/mittverk.svg',
        height: 26.scale,
      ),
      centerTitle: true,
      automaticallyImplyLeading: false,
      leading: showBack ? new IconButton(
        icon: new Icon(Icons.arrow_back_ios, color: Colors.white),
        onPressed: () => widget.onBack(),
      ) : Container(),
      actions: <Widget>[
        showGearIcon
            ? IconButton(
                icon:
                    SvgPicture.asset('assets/icons/gear.svg', height: 24.scale),
                onPressed: () {
                  widget.onSettings();
                },
              )
            : Container(),
      ],
    );
  }
}
