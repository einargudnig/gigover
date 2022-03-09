import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:mittverk/igital/extensions/num_extensions.dart';
import 'package:mittverk/main.dart';
import 'package:mittverk/utils/NavigationSettings.dart';
import 'package:mittverk/utils/Theme.dart';

class MittVerkAppBar extends StatefulWidget implements PreferredSizeWidget {
  final Function? onBack;
  final Function? onSettings;
  final Function? onNotification;
  final NavigationSettings? navigationSettings;

  MittVerkAppBar({
    this.navigationSettings,
    this.onBack,
    this.onSettings,
    this.onNotification,
    Key? key,
  })  : preferredSize = Size.fromHeight(kToolbarHeight),
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
    return AppBar(
      backgroundColor: MVTheme.appBarBackgroundColor,
      title: SvgPicture.asset(
        'assets/logo/gigover.svg',
        height: 26.scale as double?,
      ),
      centerTitle: true,
      automaticallyImplyLeading: false,
      leading: widget.navigationSettings!.showBackButton
          ? new IconButton(
              icon: new Icon(Icons.arrow_back_ios, color: Colors.white),
              onPressed: () => widget.onBack!(),
            )
          : Container(),
      actions: <Widget>[
        widget.navigationSettings!.showSettingsIcon
            ? IconButton(
                icon: SvgPicture.asset('assets/icons/gear.svg',
                    height: 20.scale as double?),
                onPressed: () {
                  widget.onSettings!();
                },
              )
            : Container(),
        //
        // TODO Enable this later for app users also...
        // Currently the notifications only work for Contractors
        //
        // widget.navigationSettings!.showNotificationsIcon && widget.onNotification != null
        //     ? IconButton(
        //         icon: SvgPicture.asset('assets/icons/bell.svg',
        //             height: 24.scale as double?),
        //         onPressed: () {
        //           widget.onNotification!();
        //         },
        //       )
        //     : Container(),
      ],
    );
  }
}
