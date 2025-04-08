import { S3 } from '../../utils/cloud/cloudflareR2Client.js';
import { downloadArquivo, listaDeArquivos, listaDeBuckets, uploadArquivo } from '../../servicos/BucketService.js';

const mockFiles = [
  { Key: 'Backup/test/file1.txt', Size: 100 },
  { Key: 'Backup/test/file2.txt', Size: 200 },
];

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn(() => ({
      send: jest.fn(),
    })),
    ListBucketsCommand: jest.fn(),
    ListObjectsV2Command: jest.fn(),
    GetObjectCommand: jest.fn(),
  };
});

jest.mock('multer-s3', () => {
  return jest.fn(() => {
    return {
      s3: jest.fn(),
      bucket: process.env.R2_BUCKET,
      key: jest.fn(),
    };
  });
});

jest.mock('multer', () => {
  return jest.fn(() => {
    return {
      storage: jest.fn(),
      limits: {
        fileSize: 2 * 1024 * 1024 * 1024,
      },
    };
  });
});

jest.mock('stream', () => {
  return {
    Readable: jest.fn(() => {
      return {
        pipe: jest.fn(),
      };
    }),
  };
});

describe('BucketService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listaDeBuckets', () => {
    it('deve retorna lista de buckets', async () => {
      const mockBuckets = [{ Name: 'bucket1' }, { Name: 'bucket2' }];
      (S3.send as jest.Mock).mockResolvedValue({ Buckets: mockBuckets });

      const buckets = await listaDeBuckets();
      expect(buckets).toEqual(mockBuckets);
    })

    it('deve retornar erro se houver falha no S3', async () => {
      (S3.send as jest.Mock).mockRejectedValue(new Error('Failed to list buckets'));

      await expect(listaDeBuckets()).rejects.toThrow('Failed to list buckets');
    });
  })

  describe('listaDeArquivos', () => {

    it('deve retornar lista de arquivos', async () => {

      (S3.send as jest.Mock).mockResolvedValue({ Contents: mockFiles });

      const response = await listaDeArquivos({ NomePasta: 'test' });
      expect(response).toEqual([
        { Key: 'file1.txt', Size: 100 },
        { Key: 'file2.txt', Size: 200 },
      ]);
    })

    it('deve retornar lista vazia se não houver arquivos', async () => {
      (S3.send as jest.Mock).mockResolvedValue({ Contents: [] });

      const response = await listaDeArquivos({ NomePasta: 'test' });
      expect(response).toEqual([]);
    })

    it('deve retornar erro se houver falha no S3', async () => {
      (S3.send as jest.Mock).mockRejectedValue(new Error('Failed to list files'));

      await expect(listaDeArquivos({ NomePasta: 'test' })).rejects.toThrow('Failed to list files');
    })
  })

  describe('uploadArquivo', () => {

    it('deve retornar upload configurado', async () => {
      const upload = await uploadArquivo({ NomePasta: 'test' });
      expect(upload).toBeDefined();
    })
  })

  describe('downloadArquivo', () => {

    it('deve retornar stream de arquivo', async () => {
      const mockStream = { pipe: jest.fn() };
      (S3.send as jest.Mock).mockResolvedValue({ Body: mockStream });

      const download = await downloadArquivo({ NomePasta: 'test', NomeArquivo: 'file1.txt' });
      expect(download).toBeDefined();
      expect(download.pipe).toBeDefined();
    })

    it('deve retornar erro se houver falha no S3', async () => {
      const error = new Error('Error downloading file');
      (S3.send as jest.Mock).mockRejectedValue(error);

      await expect(downloadArquivo({ NomePasta: 'test', NomeArquivo: 'file1.txt' })).rejects.toThrow('Error downloading file');
    });
  })
})