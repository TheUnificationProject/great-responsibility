import { ConfigService } from '@modules/config/config.service';
import * as Types from '@modules/firebase/firebase.types';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AppOptions, cert, initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

@Injectable()
export class FirebaseService implements OnModuleInit {
  public readonly app: Types.FirebaseAppInstance;
  public readonly storage: Types.FirebaseStorageInstance;
  private readonly logger = new Logger(FirebaseService.name);

  constructor(private readonly configService: ConfigService) {
    const credentials = this.configService.get(
      'GOOGLE_APPLICATION_CREDENTIALS',
    );

    const firebaseConfig: AppOptions = {
      credential: cert(credentials),
      storageBucket: this.configService.get('FIREBASE_STORAGE_BUCKET'),
    };

    this.app = initializeApp(firebaseConfig);
    this.storage = getStorage(this.app);
  }

  onModuleInit(): void {
    this.logger.log('Firebase initialized successfully');
    this.logger.log(
      `Storage bucket: ${this.configService.get('FIREBASE_STORAGE_BUCKET')}`,
    );
    this.logger.log(`Environment: ${this.configService.get('NODE_ENV')}`);
  }
}
