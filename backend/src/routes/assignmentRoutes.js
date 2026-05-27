"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assignmentController_1 = require("../controllers/assignmentController");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
// Ensure uploads directory exists
if (!fs_1.default.existsSync('uploads')) {
    fs_1.default.mkdirSync('uploads');
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
const router = (0, express_1.Router)();
router.post('/', upload.single('file'), assignmentController_1.createAssignment);
router.get('/', assignmentController_1.getAssignments);
router.get('/:id', assignmentController_1.getAssignmentById);
router.delete('/:id', assignmentController_1.deleteAssignment);
exports.default = router;
//# sourceMappingURL=assignmentRoutes.js.map