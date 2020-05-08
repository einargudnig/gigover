import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/models/Task.dart';
import 'package:mittverk/screens/HomeScreen/widgets/TimeTrackerDialog.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/widgets/CardTitle.dart';
import 'package:mittverk/igital/widgets/IgitalDropdownButton.dart';
import 'package:mittverk/widgets/ScreenLayout.dart';

class TaskDetailsArguments {
  Task task;

  TaskDetailsArguments(this.task);
}

class TaskDetailsView extends StatefulWidget {
  Task task;

  TaskDetailsView(BuildContext context) {
    final TaskDetailsArguments args = ModalRoute.of(context).settings.arguments;
    this.task = args.task;
    print(this.task);
  }

  @override
  State createState() => TaskDetailsViewState();
}

class TaskDetailsViewState extends State<TaskDetailsView> {
  TextEditingController commentInputController = TextEditingController();
  String _commentText = '';

  @override
  void initState() {
    super.initState();
    commentInputController.addListener(commentInputChange);
  }

  @override
  void dispose() {
    super.dispose();
    commentInputController.dispose();
  }

  void commentInputChange() {
    setState(() {
      _commentText = commentInputController.value.text;
    });
  }

  Widget taskDetailItemWrapper(Widget child) {
    return Container(
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

  Widget TaskDetailHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              widget.task.toString(),
              style: AvailableFonts.getTextStyle(
                context,
                color: MVTheme.mainFont,
                fontSize: 16,
                weight: FontWeight.bold,
              ),
            ),
            Icon(Icons.more_horiz)
          ],
        ),
        Text('DUDUD',
            style: AvailableFonts.getTextStyle(
              context,
              color: MVTheme.grayFont,
              fontSize: 12,
            ))
      ],
    );
  }

  Widget TaskDetailInfo(String subHeader, String header, {Icon widget}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        Expanded(
          child: CardTitle(
            subtitle: subHeader,
            title: header,
          ),
        ),
        Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[widget != null ? widget : Spacing()],
        ),
      ],
    );
  }

  Widget commentHeader() {
    return Row(
      children: <Widget>[
        Expanded(
          child: Container(
            color: Colors.white,
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Text(
                'Comments on this task',
                style: AvailableFonts.getTextStyle(
                  context,
                  color: MVTheme.mainFont,
                  fontSize: 14,
                  weight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget comment() {
    return Container(
        child: Padding(
      padding: const EdgeInsets.all(12.0),
      child: Column(
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Heimir',
                  style: AvailableFonts.getTextStyle(context,
                      color: MVTheme.mainFont,
                      fontSize: 12,
                      weight: FontWeight.bold)),
              Text('10/20/2020',
                  style: AvailableFonts.getTextStyle(
                    context,
                    color: MVTheme.grayFont,
                    fontSize: 12,
                  ))
            ],
          ),
          Spacing(isVertical: true),
          Container(
              decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border.all(color: Colors.white),
                  borderRadius: BorderRadius.all(Radius.circular(16))),
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(
                    'ahfwpuehfpauhwef pawheufhapuw ehfpuahweifhapiuwehfpaiuwh'),
              ))
        ],
      ),
    ));
  }

  Widget comments() {
    return Expanded(
      child: Container(
        child: ListView.builder(
            itemCount: 10,
            scrollDirection: Axis.vertical,
            shrinkWrap: true,
            itemBuilder: (BuildContext context, int index) {
              return comment();
            }),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ScreenLayout(
      child: Container(
        child: Column(
          children: [
            taskDetailItemWrapper(TaskDetailHeader()),
            taskDetailItemWrapper(TaskDetailInfo(
              'Currently tracking',
              'Elhusinnretting',
            )),
            taskDetailItemWrapper(IgitalDropdownButton<dynamic>(
              context,
              'Current status',
              'In progress',
              ['In progress', 'tatafafa'],
              onTap: (dynamic p) {
                print(p);
              },
            )),
            commentHeader(),
            comments(),
            Row(
              children: <Widget>[
                Expanded(
                  child: Container(
                      color: MVTheme.mainGreen,
                      child: TextField(
                        decoration: InputDecoration(
                          hintText: 'Add comment to task..',
                          fillColor: Colors.white,
                          focusColor: Colors.black.withAlpha(150),
                          filled: true,
                        ),
                        controller: commentInputController,
                        keyboardType: TextInputType.text,
                      )),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
