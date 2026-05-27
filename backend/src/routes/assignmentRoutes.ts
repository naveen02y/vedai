import { Router } from 'express';
import { createAssignment, getAssignments, getAssignmentById, deleteAssignment } from '../controllers/assignmentController';
import multer from 'multer';
import fs from 'fs';

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
  }
});

const upload = multer({ storage: storage });

const router = Router();

router.post('/', upload.single('file'), createAssignment);
router.get('/', getAssignments);
router.get('/:id', getAssignmentById);
router.delete('/:id', deleteAssignment);

export default router;
