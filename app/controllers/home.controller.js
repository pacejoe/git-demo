'use strict';

angular.module('app')
    .controller('HomeCtrl', function ($scope) {

        var template = new GitGraph.Template({
            branch: {
                color: "#000000",
                lineWidth: 3,
                spacingX: 60,
                mergeStyle: "straight",
                showLabel: true,                // display branch names on graph
                labelFont: "normal 10pt Arial"
            },
            commit: {
                spacingY: -30,
                dot: {
                    size: 8,
                    strokeColor: "#000000",
                    strokeWidth: 4
                },
                tag: {
                    font: "normal 10pt Arial",
                    color: "yellow"
                },
                message: {
                    color: "black",
                    font: "normal 12pt Arial",
                    displayAuthor: false,
                    displayBranch: false,
                    displayHash: false,
                }
            },
            arrow: {
                size: 8,
                offset: 3
            }
        });

        var config = {
            template: template,
            mode: "extended",
            orientation: "horizontal"
        };

        $scope.gitgraph = new GitGraph(config);

        //set columns
        var masterCol = 0;
        var developCol = 1;

        $scope.fCount = 0;

        //create master
        $scope.master = $scope.gitgraph.branch({name: 'master', column: masterCol});

        //create develop from master
        $scope.develop = $scope.gitgraph.branch({parentBranch: $scope.master, name: 'develop', column: developCol});

        //inital Commits
        $scope.master.commit().merge($scope.develop);


        //create integration1
        $scope.int = null;

        $scope.createFeature = function () {

            var feature1 = $scope.gitgraph.branch({
                parentBranch: $scope.develop,
                name: "feature/" + $scope.fCount,
            });

            $scope.fCount++;

            feature1.commit("A feature").commit(
                {
                    messageDisplay: false,
                    message: "msg",
                    onClick: function (commit) {
                        feature1.merge($scope.int, {
                            onClick: function (commit) {
                                $scope.int.merge($scope.develop, {
                                    onClick: function (commit) {
                                        $scope.develop.merge($scope.master);
                                        $scope.int = null;
                                    }
                                });
                            }
                        });
                    }
                }
            )
        };

        $scope.createInt = function () {
            $scope.int = $scope.gitgraph.branch({
                parentBranch: $scope.develop,
                name: "integration"
            });

            $scope.int.commit({
                message: "msg"
            });
        };


        $scope.createHotFix = function () {
            var hotFix = $scope.gitgraph.branch({
                parentBranch: $scope.master,
                name: "Hot Fix"
            });

            hotFix.commit({
                message: "msg",
                onClick: function (commit) {
                    hotFix.merge($scope.master);
                }
            });
        };


        $scope.createBugFix = function () {
            var bugFix = $scope.gitgraph.branch({
                parentBranch: $scope.develop,
                name: "Bug Fix"
            });

            bugFix.commit({
                message: "msg",
                onClick: function (commit) {
                    bugFix.merge($scope.develop, {
                        onClick: function (commit) {
                            $scope.develop.merge($scope.master);
                            $scope.int = null;
                        }
                    });
                }
            });
        };


    });
