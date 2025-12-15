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
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("./user.model");
const user_constant_1 = require("./user.constant");
const mongoose_1 = require("mongoose");
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // role default member
    const data = Object.assign(Object.assign({}, payload), { role: (_a = payload.role) !== null && _a !== void 0 ? _a : 'member' });
    const created = yield user_model_1.User.create(data);
    return created;
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const qb = new QueryBuilder_1.default(user_model_1.User.find({ isDeleted: false }), query)
        .search(user_constant_1.userSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    return {
        result: yield qb.modelQuery,
        meta: yield qb.countTotal(),
    };
});
const getSingleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid user id');
    }
    const user = yield user_model_1.User.findOne({ _id: userId, isDeleted: false });
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    return user;
});
const getMe = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email, isDeleted: false });
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    return user;
});
const updateProfile = (email, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    if (user.isDeleted)
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User is deleted');
    const updated = yield user_model_1.User.findOneAndUpdate({ email, isDeleted: false }, data, { new: true });
    return updated;
});
exports.UserServices = {
    registerUser,
    getAllUsers,
    getSingleUser,
    getMe,
    updateProfile,
};
