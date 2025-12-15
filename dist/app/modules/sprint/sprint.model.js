"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sprint = void 0;
const mongoose_1 = require("mongoose");
const sprintSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    sprintNumber: { type: Number, required: true },
    order: { type: Number, required: true },
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
sprintSchema.index({ projectId: 1, sprintNumber: 1 }, { unique: true });
sprintSchema.index({ projectId: 1, order: 1 }, { unique: true });
exports.Sprint = (0, mongoose_1.model)('Sprint', sprintSchema);
