import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/IgitalDropdownButton.dart';
import 'package:mittverk/igital/widgets/RoundedButton.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/models/Task.dart';
import 'package:mittverk/models/TaskComment.dart';
import 'package:mittverk/models/TaskStatus.dart';
import 'package:mittverk/providers/ProjectProvider.dart';
import 'package:mittverk/services/ApiService.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/widgets/CardTitle.dart';
import 'package:mittverk/widgets/LoadingSpinner.dart';
import 'package:mittverk/widgets/ScreenLayout.dart';
import 'package:mittverk/igital/extensions/num_extensions.dart';
import 'package:provider/provider.dart';

import '../../main.dart';

class TaskDetailsArguments {
  Task? task;

  TaskDetailsArguments(this.task);
}

class TaskDetailsView extends StatefulWidget {
  Task? task;

  TaskDetailsView(BuildContext context) {
    final TaskDetailsArguments args = ModalRoute.of(context)!.settings.arguments as TaskDetailsArguments;
    this.task = args.task;
  }

  @override
  State createState() => TaskDetailsViewState();
}

class TaskDetailsViewState extends State<TaskDetailsView> {
  bool addCommentLoading = false;
  TextEditingController commentInputController = TextEditingController();
  String _commentText = '';
  Task? _task;

  final FocusNode commentFocus = FocusNode();

  @override
  void initState() {
    super.initState();
    getTaskDetail();
    commentInputController.addListener(commentInputChange);
  }

  void _onCommentFocusChange() {
    this.setState(() {});
  }

  Future<void> getTaskDetail() async {
    Response response = await ApiService.getTaskDetails(widget.task!.taskId);
    if (response.statusCode != 200) {
      print('errorFetchin');
      // TODO Implement error screen here
    } else {
      try {
        print(response.data);
        if (response.data != null && response.data["projectTask"] != null) {
          dynamic projectTask = response.data["projectTask"];
          Task? tempTasks = Task.fromJson(projectTask);
          setState(() {
            _task = tempTasks;
          });
        } else {
          print('nopthing available');
        }
      } catch (e) {
        print("ERROR WHILE PARSING PROJECTS");
        // TODO Implement error screen here
      }
    }
    print(response);
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
        ),
      ),
    );
  }

  Widget TaskDetailHeader(String headerText) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              headerText,
              style: AvailableFonts.getTextStyle(
                context,
                color: MVTheme.mainFont,
                fontSize: 16.scale as double,
                weight: FontWeight.bold,
              ),
            )
          ],
        ),
      ],
    );
  }

  Widget TaskDetailInfo(String subHeader, String header, {Icon? widget}) {
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
                  fontSize: 16.scale as double,
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

  Widget comment(TaskComment comment) {
    return Container(
        child: Padding(
      padding: const EdgeInsets.all(12.0),
      child: Column(
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(comment.fullName!,
                  style: AvailableFonts.getTextStyle(context,
                      color: MVTheme.mainFont,
                      fontSize: 14.scale as double,
                      weight: FontWeight.bold)),
              Text(comment.formattedDate,
                  style: AvailableFonts.getTextStyle(
                    context,
                    color: MVTheme.grayFont,
                    fontSize: 14.scale as double,
                  ))
            ],
          ),
          Spacing(isVertical: true),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Flexible(
                child: Container(
                    decoration: BoxDecoration(
                        color: Colors.white,
                        border: Border.all(color: Colors.white),
                        borderRadius: BorderRadius.all(Radius.circular(16))),
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(10, 8, 10, 8),
                      child: Text(
                        comment.comment!,
                        style: AvailableFonts.getTextStyle(
                          context,
                          color: MVTheme.mainFont,
                          fontSize: 14.scale as double,
                        ),
                      ),
                    )),
              ),
            ],
          )
        ],
      ),
    ));
  }

  Widget comments() {
    return Expanded(
      child: Container(
        child: ListView.builder(
            itemCount: this._task!.comments!.length,
            scrollDirection: Axis.vertical,
            shrinkWrap: true,
            itemBuilder: (BuildContext context, int index) {
              return comment(this._task!.comments![index]);
            }),
      ),
    );
  }

  void addComment() async {
    FocusScope.of(context).unfocus();
    String currentText = commentInputController.value.text;

    if (currentText != null && currentText.length > 0) {
      setState(() {
        addCommentLoading = true;
      });

      // TODO Error component
      await ApiService.addComment(currentText, _task!.projectId, _task!.taskId);
      await this.getTaskDetail();
      commentInputController.clear();

      setState(() {
        addCommentLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (this._task == null) {
      return ScreenLayout(
          child: Container(
              child: Center(
        child: LoadingSpinner(),
      )));
    }

    return ScreenLayout(
      child: Container(
        child: Column(
          children: [
            taskDetailItemWrapper(TaskDetailHeader(this._task!.text!)),
            taskDetailItemWrapper(IgitalDropdownButton<dynamic>(
              context,
              'Current status',
              getTaskStatusString(this._task!.status),
              TaskStatus.values.where((v) => v != TaskStatus.Archived).map((s) {
                return getTaskStatusString(s);
              }).toList(),
              onTap: (String p) async {
                print(p);
                TaskStatus newStatus = statusFromString(p);
                this._task!.setStatus(newStatus);
                this.setState(() {
                  _task = _task;
                });

                ProjectProvider projectProvider =
                    Provider.of<ProjectProvider>(context, listen: true);
                projectProvider.updateTask(_task);
                await ApiService.setProjectTaskStatus(
                    this._task!.taskId, newStatus);
              },
            )),
            commentHeader(),
            comments(),
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    offset: Offset.fromDirection(0, 5),
                    color: Colors.black.withAlpha(15),
                    blurRadius: 15,
                  )
                ],
              ),
              child: Column(
                children: <Widget>[
                  Row(
                    children: <Widget>[
                      Expanded(
                        child: Container(
                            child: TextField(
                          textInputAction: TextInputAction.send,
                          onSubmitted: (value) {
                            print("search");
                            addComment();
                          },
                          focusNode: commentFocus,
                          keyboardType: TextInputType.multiline,
                          maxLines: 3,
                          decoration: InputDecoration(
                            fillColor: Colors.white,
                            focusColor: Colors.black.withAlpha(150),
                            hintStyle: TextStyle(
                              color: Colors.black.withAlpha(150),
                              fontSize: 18.scale as double?,
                            ),
                            hintText: 'Write a comment..',
                            border: OutlineInputBorder(),
                            filled: true,
                            enabledBorder: OutlineInputBorder(
                              borderRadius:
                                  BorderRadius.all(Radius.circular(12)),
                              borderSide: BorderSide(color: Colors.transparent),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius:
                                  BorderRadius.all(Radius.circular(12)),
                              borderSide: BorderSide(
                                color: Colors.white,
                              ),
                            ),
                          ),
                          controller: commentInputController,
                        )),
                      ),
                    ],
                  ),
                  commentFocus.hasFocus
                      ? Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: <Widget>[
                            Padding(
                              padding: const EdgeInsets.only(
                                  right: 8.0, bottom: 8.0),
                              child: RoundedButton(
                                loading: addCommentLoading,
                                fillBackground: MVTheme.mainGreen,
                                padding: EdgeInsets.only(
                                    right: 12.0, left: 12, top: 8, bottom: 8),
                                textColor: Colors.white,
                                onTap: () {
                                  addComment();
                                },
                                text: 'Add comment',
                              ),
                            ),
                          ],
                        )
                      : Container(),
                ].where(notNull).toList(),
              ),
            )
          ],
        ),
      ),
    );
  }
}
