import * as path from 'path';

import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

@Injectable()
export class ProfileService {
  async uploadImage(userId: string, file: Express.Multer.File) {
    return await s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: path.join('user-thmb', userId),
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();
  }
}
