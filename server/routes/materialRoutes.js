import express from 'express';
import {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  toggleFavorite,
} from '../controllers/materialController.js';

const router = express.Router();

router.route('/')
  .get(getMaterials)
  .post(createMaterial);

router.route('/:id')
  .get(getMaterialById)
  .put(updateMaterial)
  .delete(deleteMaterial);

router.patch('/:id/favorite', toggleFavorite);

export default router;
