/// <reference types="node" />
/// <reference types="node" />
import { S3Client } from "@aws-sdk/client-s3";
export interface S3ConnectionConfig {
    bucket: string;
    url: string;
    accessKeyId: string;
    secretAccessKey: string;
}
export declare class S3Connection {
    readonly client: S3Client;
    private _config;
    constructor(config: S3ConnectionConfig);
    get bucketName(): string;
    presignedUploadObjectUrl(path: string, mimeType: string): Promise<{
        url: string;
        mimeType: string;
    }>;
    uploadObject(path: string, buffer: Buffer, mimeType: string): Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
    listByPrefix(prefix: string): Promise<import("@aws-sdk/client-s3").ListObjectsCommandOutput>;
    deleteFiles(keys: string[]): Promise<import("@aws-sdk/client-s3").DeleteObjectsCommandOutput | undefined>;
    removeDirectory(directory: string): Promise<void>;
}
