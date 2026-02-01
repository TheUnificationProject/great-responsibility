import { FirebaseStorageService } from '@modules/firebase/firebase-storage.service';
import { FirebaseService } from '@modules/firebase/firebase.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [FirebaseService, FirebaseStorageService],
  exports: [FirebaseService, FirebaseStorageService],
})
export class FirebaseModule {}
