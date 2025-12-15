"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const mongoose_1 = require("mongoose");
const teamSchema = new mongoose_1.Schema({
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
        type: String,
        enum: ['admin', 'manager', 'member'],
        required: true,
    },
    department: { type: String },
    skills: { type: [String] },
}, { timestamps: true });
// same user cannot be added twice in same project
teamSchema.index({ projectId: 1, userId: 1 }, { unique: true });
exports.Team = (0, mongoose_1.model)('Team', teamSchema);
