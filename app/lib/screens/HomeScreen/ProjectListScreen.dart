import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:mittverk/igital/extensions/num_extensions.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/models/Project.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/screens/HomeScreen/widgets/ProjectCard.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/widgets/LoadingSpinner.dart';
import 'package:provider/provider.dart';

import 'ProjectScreen.dart';

class ProjectListScreen extends StatelessWidget {
  Widget showLoader(HomeProvider homeProvider) {
    if (homeProvider.loadingProjects) {
      return Container(child: Center(child: LoadingSpinner()));
    }

    return Container();
  }

  Widget emptyContainer(BuildContext context, String title, String text) {
    return Padding(
      padding: const EdgeInsets.all(64.0),
      child: Column(
        children: <Widget>[
          SvgPicture.asset(
            'assets/icons/beach.svg',
            color: Colors.black,
            width: 80,
          ),
          Spacing(
            isVertical: true,
            amount: 2,
          ),
          Text(
            title,
            style: AvailableFonts.getTextStyle(
              context,
              fontSize: 18.scale as double,
              weight: FontWeight.bold,
              color: MVTheme.mainFont,
            ),
          ),
          Spacing(
            isVertical: true,
            amount: 1,
          ),
          Text(
            text,
            style: AvailableFonts.getTextStyle(
              context,
              fontSize: 16.scale as double,
              color: MVTheme.mainFont,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final homeProvider = Provider.of<HomeProvider>(context);

    return Column(
      children: <Widget>[
        showLoader(homeProvider),
        Padding(
          padding: const EdgeInsets.all(12.0),
          child: Text('PULL DOWN TO REFRESH',
              style: AvailableFonts.getTextStyle(context,
                  fontSize: 12.scale as double,
                  weight: FontWeight.bold,
                  color: Colors.black.withAlpha(100))),
        ),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(bottom: 64),
            child: RefreshIndicator(
              color: MVTheme.secondaryColor,
              backgroundColor: MVTheme.appBarBackgroundColor,
              onRefresh: () {
                return homeProvider.getProjects().then((v) {
                  homeProvider.getStopWatchData().then((s) {
                    homeProvider.setCurrentProject(homeProvider.projects[0]);
                  });
                });
              },
              child: SizedBox.expand(
                child: ListView.builder(
                  physics: const AlwaysScrollableScrollPhysics(),
                  itemCount: homeProvider.projects.length > 0
                      ? homeProvider.projects.length
                      : 1,
                  scrollDirection: Axis.vertical,
                  shrinkWrap: true,
                  itemBuilder: (BuildContext context, int index) {
                    if (homeProvider.projects.length == 0) {
                      if (homeProvider.projectsError != null) {
                        return emptyContainer(
                          context,
                          'Oh, nothing to see..',
                          homeProvider.projectsError!,
                        );
                      }

                      return emptyContainer(
                        context,
                        'Vacation time 😎',
                        'Seems that there are no projects here, stay calm and vacay.',
                      );
                    }

                    Project project = homeProvider.projects[index];

                    return GestureDetector(
                      onTap: () {
                        homeProvider.homeNavigationKey.currentState!.pushNamed(
                          '/project',
                          arguments: ProjectListScreenArgs(
                            project,
                          ),
                        );
                      },
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(12, 6, 12, 6),
                        child: Padding(
                          padding: const EdgeInsets.only(top: 4.0, bottom: 4.0),
                          child: ProjectCard(item: project),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
