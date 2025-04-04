import { ListBucketsCommand, S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

export const S3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
  },
});

const bucket = process.env.R2_BUCKET;

// export const listaDeBuckets = async () => {
//   const command = new ListBucketsCommand({});
//   const response = await S3.send(command);
//   return response.Buckets;
// };

// export const listarArquivos = async (nomePasta: string) => {
//   const params = {
//     Bucket: bucket,
//     Prefix: `Backup/${nomePasta}/`
//   };

//   try {
//     const listaPastas = new ListObjectsV2Command(params);
//     const data = await S3.send(listaPastas);

//     const arquivos = data.Contents?.map((arquivo) => ({
//       Key: arquivo.Key?.split('/')[2],
//       Size: arquivo.Size
//     })) || [];
//     return arquivos;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }

// export const upload = (nomePasta: string) => multer({
//   storage: multerS3({
//     s3: S3,
//     bucket: bucket!,
//     key: (req, file, cb) => {
//       cb(null, `Backup/${nomePasta}/${file.originalname}`);
//     }
//   }),
//   limits: {
//     fileSize: 2 * 1024 * 1024 * 1024
//   }
// });

export const downloadArquivo = async (nomePasta: string, nomeArquivo: string) => {
  const params = {
    Bucket: bucket,
    Key: `Backup/${nomePasta}/${nomeArquivo}`,
  };
  const command = new GetObjectCommand(params);
  try {
    const data = await S3.send(command);
    const stream = data.Body as Readable;
    return stream;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error('Error downloading file');
  }
}

export const criarPasta = async (nomePasta: string) => {
  const params = {
    Bucket: bucket,
    Key: `Backup/${nomePasta}/`,
  };
  const command = new PutObjectCommand(params);
  try {
    await S3.send(command);
  } catch (error) {
    console.error(error);
    throw new Error('Error creating folder');
  }
}

// export const uploadArquivo = (nomePasta: string) => upload(nomePasta).single('file');