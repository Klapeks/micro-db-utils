import { DeleteObjectsCommand, ListObjectsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Logger } from "@klapeks/utils";

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
        this._config = config;
        this.client = new S3Client({
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
        const url = await getSignedUrl(this.client, new PutObjectCommand({
            Bucket: this.bucketName, 
            Key: fixPath(path), 
            ContentType: mimeType,
        }), { expiresIn: 3600 });
        return { url, mimeType };
    }

    async uploadObject(path: string, buffer: Buffer, mimeType: string) {
        return await this.client.send(new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fixPath(path),
            Body: buffer,
            ContentType: mimeType,
        }));
    }
    
    async listByPrefix(prefix: string) {
        while (prefix[0] == '/') prefix = prefix.substring(1);
        return await this.client.send(new ListObjectsCommand({
            Bucket: this.bucketName, Prefix: prefix
        }));
    }

    async deleteFiles(keys: string[]) {
        if (!keys.length) return;
        return await this.client.send(new DeleteObjectsCommand({
            Bucket: this.bucketName,
            Delete: {
                Objects: keys.map(k => ({ Key: fixPath(k) }))
            }
        }));
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