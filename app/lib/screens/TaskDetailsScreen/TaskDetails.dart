import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/widgets/ScreenLayout.dart';

class TaskDetailsScreen extends StatelessWidget {
  final String userId;

  TaskDetailsScreen({this.userId});

  Widget build(BuildContext context) {
    return TaskDetailsView();
  }
}

class TaskDetailsView extends StatefulWidget {
  @override
  State createState() => TaskDetailsViewState();
}

class TaskDetailsViewState extends State<TaskDetailsView> {
  @override
  void initState() {
    super.initState();
  }

  Widget UserDetailItemWrapper(Widget child) {
    return Container(
        color: Colors.blue,
        child: Container(
            decoration: BoxDecoration(
                color: Colors.white,
                border: Border(
                    bottom: BorderSide(color: MVTheme.borderColor, width: 2))),
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: child,
            )));
  }

  Widget UserDetailHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[Text('Test'), Text('baba')],
        ),
        Text('baba')
      ],
    );
  }

  Widget UserDetailInfo() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[Text('test'), Text('Test')],
          ),
        ),
        Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[Text('fwaa')],
        ),
      ],
    );
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScreenLayout(
      child: Container(
        child: Column(
          children: [
            UserDetailItemWrapper(UserDetailHeader()),
            UserDetailItemWrapper(UserDetailInfo()),
            UserDetailItemWrapper(UserDetailInfo()),
            Text('fafa')
          ],
        ),
      ),
    );
  }
}
