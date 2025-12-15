"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const sprint_route_1 = require("../modules/sprint/sprint.route");
const project_route_1 = require("../modules/project/project.route");
const task_route_1 = require("../modules/task/task.route");
const team_route_1 = require("../modules/team/team.route");
const report_route_1 = require("../modules/report/report.route");
const user_route_1 = require("../modules/user/user.route");
const taskComment_route_1 = require("../modules/taskComment/taskComment.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/comments',
        route: taskComment_route_1.TaskCommentRoutes,
    },
    {
        path: '/sprint',
        route: sprint_route_1.SprintRoutes
    },
    {
        path: '/team',
        route: team_route_1.TeamRoutes
    },
    {
        path: '/reports',
        route: report_route_1.ReportRoutes
    },
    {
        path: '/tasks',
        route: task_route_1.TaskRoutes
    },
    {
        path: '/projects',
        route: project_route_1.ProjectRoutes
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
