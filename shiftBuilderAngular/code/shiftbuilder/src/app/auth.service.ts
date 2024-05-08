import { Injectable } from '@angular/core';
import { Auth, reauthenticateWithCredential } from '@angular/fire/auth';
import { EmailAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { Observable, from } from 'rxjs';
import { DatabaseModule } from '@angular/fire/database';
import { Database } from 'firebase/database';
import { Firestore, FirestoreError, getDoc } from '@angular/fire/firestore';
import { setDoc } from '@angular/fire/firestore';
import { addDoc, collection, collectionGroup, doc, getDocs } from 'firebase/firestore';
import { DocumentReference } from 'firebase/firestore';
import { NavigationStart, Router } from '@angular/router';
import { updateProfile as updateAuthProfile } from '@angular/fire/auth';
import { deleteDoc } from 'firebase/firestore';



@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {
    this.authStateChange = new Observable((observer) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });
      return () => unsubscribe();
    });
  }

  authStateChange: any;

  getShiftById(shiftId: string) {
   
    const user = this.auth.currentUser;

    if (user) {
      const userId = user.uid;
      const shiftDocRef = doc(this.firestore, `users/${userId}/shifts/${shiftId}`);
      return getDoc(shiftDocRef).then(docSnapshot => docSnapshot.data());
    } else {
      return;
    }
  }


  register(email: string, password: string, firstName: string, lastName: string, birthDate: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        if (user) {
          const userId = user.uid;
          const usersCollectionRef = collection(this.firestore, 'users');
          const userData = {
            userId,
            email,
            firstName,
            lastName,
            birthDate,
          };

          return setDoc(doc(this.firestore, 'users', userId), userData)
            .then(() => {
              const formDataCollectionRef = collection(this.firestore, `users/${userId}/formData`);
              const formData = {
                email,
                firstName,
                lastName,
                birthDate,
              };

              return setDoc(doc(this.firestore, `users/${userId}/formData/${userId}`), formData)
                .then(() => userCredential);
            });
        } else {
          return Promise.reject(new Error('No authenticated user'));
        }
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  updatePassword(oldPassword: string, newPassword: string): Promise<void> {
    const user = this.auth.currentUser;


    if (user && user.email) {
      const credentials = EmailAuthProvider.credential(user.email, oldPassword);
      return reauthenticateWithCredential(user, credentials)
        .then(() => updatePassword(user, newPassword));
    } else {
      return Promise.reject(new Error('No authenticated user or user email is null'));
    }
  }

 
  getFormData(userId: string): Promise<any> {
    const formDataDocRef = doc(this.firestore, `users/${userId}/formData`, userId);
    return getDoc(formDataDocRef)
      .then((docSnapshot) => {
        return docSnapshot.data();
      });
  }

  loadShiftsData(): Observable<any[]> {
  
    return new Observable((observer) => {
      const user = this.auth.currentUser;

      if (user) {
        const userId = user.uid;
        const shiftsCollectionRef = collection(this.firestore, `users/${userId}/shifts`);

        getDocs(shiftsCollectionRef).then((querySnapshot) => {
          const shifts: any[] = [];
          querySnapshot.forEach((doc) => {
            shifts.push({ id: doc.id, ...doc.data() });
          });
          observer.next(shifts);
        }).catch((error) => {
          observer.error(error);
        });
      } else {
        observer.error(new Error('No authenticated user'));
      }
    });
  }
}
