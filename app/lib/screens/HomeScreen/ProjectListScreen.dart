import 'package:flutter/material.dart';
import 'package:mittverk/igital/widgets/RoundedButton.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/screens/HomeScreen/widgets/ProjectCard.dart';
import 'package:provider/provider.dart';

import 'ProjectScreen.dart';

class ProjectListScreen extends StatelessWidget {
  Widget showLoader(HomeProvider homeProvider) {
    if (homeProvider.loadingProjects) {
      return Text('Loading projects...');
    }

    return Container();
  }

  Widget showError(HomeProvider homeProvider) {
    if (homeProvider.projectsError != null) {
      return Text(homeProvider.projectsError);
    }

    return Container();
  }

  @override
  Widget build(BuildContext context) {
    final homeProvider = Provider.of<HomeProvider>(context);

    return Column(
      children: <Widget>[
        // TODO Fix
        showLoader(homeProvider),
        // TODO Fix
        showError(homeProvider),
        RoundedButton(
          text: 'Fetch projects',
          onTap: () {
            homeProvider.getProjects().then((v) {
              homeProvider.getStopWatchData();
            });
          },
        ),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(bottom: 64),
            child: ListView.builder(
              itemCount: homeProvider.projects.length,
              scrollDirection: Axis.vertical,
              shrinkWrap: true,
              itemBuilder: (BuildContext context, int index) {
                return GestureDetector(
                  onTap: () {
                    Navigator.of(context).pushNamed('/project',
                        arguments: ProjectListScreenArgs(
                            homeProvider.projects[index]));
                  },
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(12, 6, 12, 6),
                    child: Padding(
                      padding: const EdgeInsets.only(top: 4.0, bottom: 4.0),
                      child: ProjectCard(item: homeProvider.projects[index]),
                    ),
                  ),
                );
              },
            ),
          ),
        ),
      ],
    );
  }
}
