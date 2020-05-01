import 'package:flutter/material.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/screens/HomeScreen/ProjectScreen.dart';
import 'package:provider/provider.dart';

import 'ProjectCard.dart';

class ProjectList extends StatefulWidget {
  @override
  _ProjectListState createState() => _ProjectListState();
}

class _ProjectListState extends State<ProjectList> {
  @override
  void initState() {
    final homeProvider = Provider.of<HomeProvider>(context, listen: false);
    homeProvider.showTimePanel();

    super.initState();
  }
  @override
  Widget build(BuildContext context) {
    final homeProvider = Provider.of<HomeProvider>(context);

    return ListView.builder(
      itemCount: homeProvider.projects.length,
      scrollDirection: Axis.vertical,
      shrinkWrap: true,
      itemBuilder: (BuildContext context, int index) {
        return GestureDetector(
          onTap: () {
            Navigator.of(context).pushNamed('/project', arguments: ProjectScreenArguments(homeProvider.projects[index]));
          },
            child: Padding(
              padding: const EdgeInsets.fromLTRB(12, 6, 12, 6),
            child: ProjectCard(item: homeProvider.projects[index]),
            ),
        );
      },
    );
  }
}

