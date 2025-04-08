import { GetObjectCommand, ListBucketsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { S3 } from "../utils/cloud/cloudflareR2Client.js";
import multerS3 from 'multer-s3';
import multer from "multer";
import { Readable } from "stream";

interface InputListaDeArquivos {
  NomePasta: string;
}

interface InputUpload {
  NomePasta: string;
}

interface InputDownload {
  NomePasta: string, 
  NomeArquivo: string
}

const bucket = process.env.R2_BUCKET;

export const listaDeBuckets = async () => {
  const command = new ListBucketsCommand({});
  const response = await S3.send(command);
  return response.Buckets;
};

export const listaDeArquivos = async (params: InputListaDeArquivos) => {
  try {
    const bucketParams = {
      Bucket: bucket,
      Prefix: `Backup/${params.NomePasta}/`
    }
    const listaPastas = new ListObjectsV2Command(bucketParams);
    const data = await S3.send(listaPastas);

    const arquivos = data.Contents?.map((arquivo) =>
    ({
      Key: arquivo.Key?.split("/")[2],
      Size: arquivo.Size,
    })) || [];
    return arquivos;
  } catch (error) {
    throw new Error('Failed to list files');
  }
}

export const uploadArquivo = async (params: InputUpload) => {
  try {
    const upload = multer({
      storage: multerS3({
        s3: S3,
        bucket: bucket!,
        key: (req, file, cb) => {
          cb(null, `Backup/${params.NomePasta}/${file.originalname}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024 * 1024,
      },
    });
    return upload;
  } catch (error) {
    throw new Error("Error uploading file");
  }
}

export const downloadArquivo = async (params: InputDownload) => {
  const paramsDownload = {
    Bucket: bucket!,
    Key: `Backup/${params.NomePasta}/${params.NomeArquivo}`,
  }

  const command = new GetObjectCommand(paramsDownload);

  try {
    const data = await S3.send(command);
    const stream = data.Body as Readable;
    return stream;
  } catch (error) {
    throw new Error("Error downloading file");
  }
}