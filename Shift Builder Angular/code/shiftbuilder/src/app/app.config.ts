import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"shiftbuilder-ed2e0","appId":"1:667360274742:web:9e25358a7e2ea342c66b97","storageBucket":"shiftbuilder-ed2e0.appspot.com","apiKey":"AIzaSyCsKEm9m-zftadgt8KnnqH3EYAGl212Py4","authDomain":"shiftbuilder-ed2e0.firebaseapp.com","messagingSenderId":"667360274742"}))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore()))]
};