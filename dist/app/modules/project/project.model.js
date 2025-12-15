"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = require("mongoose");
const projectSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    client: { type: String, required: true },
    description: String,
    startDate: Date,
    endDate: Date,
    budget: Number,
    status: {
        type: String,
        enum: ['planned', 'active', 'completed', 'archived'],
        default: 'planned',
    },
    taskStats: {
        total: { type: Number, default: 0 },
        completed: { type: Number, default: 0 },
    },
    thumbnail: String,
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.Project = (0, mongoose_1.model)('Project', projectSchema);
