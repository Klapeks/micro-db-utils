/// <reference types="node" />
/// <reference types="node" />
import type { S3Client } from "@aws-sdk/client-s3";
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
    uploadObject(path: string, buffer: Buffer, mimeType: string): Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
    listByPrefix(prefix: string): Promise<import("@aws-sdk/client-s3").ListObjectsCommandOutput>;
    deleteFiles(keys: string[]): Promise<import("@aws-sdk/client-s3").DeleteObjectsCommandOutput | undefined>;
    removeDirectory(directory: string): Promise<void>;
    presignedUploadObjectUrl(path: string, mimeType: string): Promise<{
        url: string;
        mimeType: string;
    }>;
    presignedMultipartUpload(path: string, mimeType: string, parts: number): Promise<{
        pathKey: string;
        uploadId: string;
        urls: {
            partNumber: number;
            url: string;
            isAdditional: boolean;
        }[];
    }>;
    confirmMultipart(data: {
        pathKey: string;
        uploadId: string;
        uploadResults: {
            partNumber: number;
            eTag: string;
        }[];
    }): Promise<void>;
}
