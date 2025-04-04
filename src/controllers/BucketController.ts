import { Request, Response } from 'express';
import { downloadArquivo, listaDeArquivos, listaDeBuckets, uploadArquivo } from '../servicos/BucketService.js';

export class BucketController {

  static async listarBuckets(req: Request, res: Response) {
    try {
      const buckets = await listaDeBuckets();
      res.json(buckets);
    } catch (error) {
      res.status(500).json({ error: 'Failed to list buckets' });
    }
  }

  static async listarArquivos(req: Request, res: Response) {
    try {
      const listaPastas = await listaDeArquivos({ NomePasta: req.params.nomePasta });
      res.json(listaPastas);
    } catch (error) {
      res.status(500).json({ error: 'Failed to list files' });
    }
  };

  static async upload(req: Request, res: Response) {
    try {
      const upload = await uploadArquivo({ NomePasta: req.params.nomePasta });

      upload.single('file')(req, res, (err: any) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'File uploaded successfully!', file: req.file });
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload file' });
    }
  }

  static async downloadArquivo(req: Request, res: Response) {
    const { nomePasta, nomeArquivo } = req.query;
    if (typeof nomePasta === 'string' && typeof nomeArquivo === 'string') {
      try {
        const stream = await downloadArquivo({
          NomePasta: nomePasta,
          NomeArquivo: nomeArquivo,
        });
        stream.pipe(res);
      } catch (error) {
        res.status(500).send('Error downloading file');
      }
    } else {
      res.status(400).send('Invalid query parameters');
    }
  }
}
