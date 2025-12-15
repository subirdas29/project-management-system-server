"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SprintController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const sprint_service_1 = require("./sprint.service");
const http_status_1 = __importDefault(require("http-status"));
const createSprint = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield sprint_service_1.SprintService.createSprint(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Sprint created successfully',
        data: result,
    });
}));
const getProjectSprints = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const result = yield sprint_service_1.SprintService.getProjectSprints(projectId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Sprints fetched successfully',
        meta: result.meta,
        data: result.result,
    });
}));
const getSingleSprint = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sprintId } = req.params;
    const result = yield sprint_service_1.SprintService.getSingleSprint(sprintId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Sprint fetched successfully',
        data: result,
    });
}));
const updateSprint = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sprintId } = req.params;
    const result = yield sprint_service_1.SprintService.updateSprint(sprintId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Sprint updated successfully',
        data: result,
    });
}));
const deleteSprint = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sprintId } = req.params;
    yield sprint_service_1.SprintService.deleteSprint(sprintId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Sprint deleted successfully',
        data: null,
    });
}));
const reorderSprints = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield sprint_service_1.SprintService.reorderSprints(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Sprints reordered successfully',
        data: null,
    });
}));
const getSprintDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sprintId } = req.params;
    const result = yield sprint_service_1.SprintService.getSprintDetails(sprintId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Sprint details fetched',
        data: result,
    });
}));
exports.SprintController = {
    createSprint,
    getProjectSprints,
    getSingleSprint,
    updateSprint,
    deleteSprint,
    reorderSprints,
    getSprintDetails
};
