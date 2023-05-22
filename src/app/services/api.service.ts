import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private snackBar: MatSnackBar
  ) {}

  // Create operation
  create(collectionName: any, data: any) {
    return this.firestore
      .collection(collectionName)
      .add(data)
      .then(() =>
        this.snackBar.open('Record added successfully!', 'OK', {
          duration: 3000,
        })
      )
      .catch((error: any) => {
        console.error('Error creating document: ', error);
        this.snackBar.open('Failed to add book', 'OK', {
          duration: 3000,
        });
      });
  }

  get(collectionName: any) {
    return this.firestore.collection(collectionName).snapshotChanges();
  }

  delete(collectionName: any, id: any) {
    return this.firestore
      .doc(collectionName + '/' + id)
      .delete()
      .then(() =>
        this.snackBar.open('Record deleted successfully!', 'OK', {
          duration: 3000,
        })
      )
      .catch((error: any) => {
        console.error('Error deleting document: ', error);
        this.snackBar.open('Failed to delete book', 'OK', {
          duration: 3000,
        });
      });
  }

  update(collectionName: any, id: any, data: any) {
    return this.firestore
      .doc(collectionName + '/' + id)
      .update(data)
      .then(() =>
        this.snackBar.open('Record Updated successfully!', 'OK', {
          duration: 3000,
        })
      )
      .catch((error: any) => {
        console.error('Error deleting document: ', error);
        this.snackBar.open('Failed to update book', 'OK', {
          duration: 3000,
        });
      });
  }

  // postTask(data: any) {
  //   return this.http.post<any>("http://localhost:3000/taskList/",data)
  // }

  // getTask() {
  //   return this.http.get<any>('http://localhost:3000/taskList/');
  // }

  // putTask(data: any, id: number) {
  //   return this.http.put<any>('http://localhost:3000/taskList/' + id, data);
  // }

  // deleteTask(id: number) {
  //   return this.http.delete<any>('http://localhost:3000/taskList/' + id);
  // }
}
