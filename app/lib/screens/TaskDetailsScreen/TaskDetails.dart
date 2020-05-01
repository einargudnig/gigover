import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/widgets/CardTitle.dart';
import 'package:mittverk/widgets/ScreenLayout.dart';
import 'package:provider/provider.dart';

class TaskDetailsArguments {
  String taskId;

  TaskDetailsArguments(this.taskId);
}

class TaskDetailsScreen extends StatelessWidget {
  TaskDetailsScreen();

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

  Widget TaskDetailItemWrapper(Widget child) {
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
              'Test',
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
        Text('baba',
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

  Widget CommentHeader() {
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

  Widget Comment() {
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

  Widget Comments() {
    return Expanded(
      child: Container(
        child: ListView.builder(
            itemCount: 10,
            scrollDirection: Axis.vertical,
            shrinkWrap: true,
            itemBuilder: (BuildContext context, int index) {
              return Comment();
            }),
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final TaskDetailsArguments args = ModalRoute.of(context).settings.arguments;
    return ScreenLayout(
      child: Container(
        child: Column(
          children: [
            TaskDetailItemWrapper(TaskDetailHeader()),
            TaskDetailItemWrapper(TaskDetailInfo(
              'Currently tracking',
              'Elhusinnretting',
            )),
            TaskDetailItemWrapper(TaskDetailInfo(
                'Type', 'Elhusinnretting',
                widget: Icon(Icons.arrow_drop_down))),
            CommentHeader(),
            Comments(),
            Row(
              children: <Widget>[
                Container(
                    color: MVTheme.backgroundGray,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text('Write a comment on this task..',
                          style: AvailableFonts.getTextStyle(context,
                              color: MVTheme.grayFont,
                              fontStyle: FontStyle.italic,
                              weight: FontWeight.bold,
                              fontSize: 12)),
                    )),
              ],
            )
          ],
        ),
      ),
    );
  }
}
