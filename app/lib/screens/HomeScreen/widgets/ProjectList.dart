import 'package:flutter/material.dart';
import 'package:mittverk/models/Project.dart';
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
        Project project = homeProvider.projects[index];

        return GestureDetector(
          onTap: () {
            homeProvider.homeNavigationKey.currentState!.pushNamed('/project', arguments: ProjectListScreenArgs(project));
          },
            child: Padding(
              padding: const EdgeInsets.fromLTRB(12, 6, 12, 6),
            child: Padding(
              padding: const EdgeInsets.only(top:4.0, bottom: 4.0),
              child: ProjectCard(item: project),
            ),
            ),
        );
      },
    );
  }
}

