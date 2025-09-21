// import type { DeleteObjectsCommand, ListObjectsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { S3Client } from "@aws-sdk/client-s3";
import { Logger } from "@klapeks/utils";
import { quietRequire } from "../quiet.require";

const s3ClientModule = quietRequire<
    typeof import('@aws-sdk/client-s3')
>('@aws-sdk/client-s3');

const s3PresignerModule = quietRequire<
    typeof import('@aws-sdk/s3-request-presigner')
>('@aws-sdk/s3-request-presigner')


export interface S3ConnectionConfig {
    bucket: string,
    url: string,
    accessKeyId: string,
    secretAccessKey: string
}

const logger = new Logger("S3/R2");

const fixPath = (path: string) => {
    while (path[0] == '/') path = path.substring(1);
    if (path.includes('?')) path = path.split('?')[0];
    return path;
}

export class S3Connection {

    readonly client: S3Client;
    private _config: S3ConnectionConfig;
    constructor(config: S3ConnectionConfig) {
        if (!s3ClientModule) throw "No @aws-sdk/client-s3 module installed";
        this._config = config;
        this.client = new s3ClientModule.S3Client({
            region: "auto",
            endpoint: config.url,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey
            },
        });
        logger.log("S3 connection created:", config.bucket);
    }
    
    get bucketName() {
        return this._config.bucket;
    }

    async presignedUploadObjectUrl(path: string, mimeType: string) {
        if (!s3PresignerModule) throw "No @aws-sdk/s3-request-presigner module";
        const url = await s3PresignerModule.getSignedUrl(this.client, 
            new s3ClientModule!.PutObjectCommand({
                Bucket: this.bucketName, 
                Key: fixPath(path), 
                ContentType: mimeType,
            }), { expiresIn: 3600 }
        );
        return { url, mimeType };
    }

    async uploadObject(path: string, buffer: Buffer, mimeType: string) {
        return await this.client.send(
            new s3ClientModule!.PutObjectCommand({
                Bucket: this.bucketName,
                Key: fixPath(path),
                Body: buffer,
                ContentType: mimeType,
            })
        );
    }
    
    async listByPrefix(prefix: string) {
        while (prefix[0] == '/') prefix = prefix.substring(1);
        return await this.client.send(
            new s3ClientModule!.ListObjectsCommand({
                Bucket: this.bucketName, Prefix: prefix
            })
        );
    }

    async deleteFiles(keys: string[]) {
        if (!keys.length) return;
        return await this.client.send(
            new s3ClientModule!.DeleteObjectsCommand({
                Bucket: this.bucketName,
                Delete: {
                    Objects: keys.map(k => ({ Key: fixPath(k) }))
                }
            })
        );
    }

    async removeDirectory(directory: string) {
        while (directory[0] == '/') directory = directory.substring(1);

        const listedObjects = await this.listByPrefix(directory);
        listedObjects.Contents = listedObjects.Contents?.filter(k => k.Key);
        logger.log("content:", listedObjects.Contents);

        if (!listedObjects.Contents?.length) return;

        const result = await this.deleteFiles(listedObjects.Contents.map(k => k.Key!));
        logger.log("Deleted:", result);
    }
}