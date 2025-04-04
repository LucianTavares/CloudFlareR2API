import { Router } from "express";
import { keycloak } from "../config/keycloack.js";
import { BucketController } from "../controllers/BucketController.js";

const router = Router();

router.get('/buckets', keycloak.protect(), BucketController.listarBuckets);

router.get('/buckets/:nomePasta', keycloak.protect(), BucketController.listarArquivos);

router.put('/upload/:nomePasta', keycloak.protect(), BucketController.upload);

router.get('/download-arquivo', keycloak.protect(), BucketController.downloadArquivo);

export default router;