import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  List = ['Yes', 'No'];

  books!: FormGroup;

  ngOnInit(): void {
    this.books = this.formBuilder.group({
      isbn: ['', Validators.required],
      title: ['', Validators.required],
      authors: [[], Validators.required],
      publisher: ['', Validators.required],
      publicationDate: [''],
    });

    if (this.editData) {
      this.books.controls['isbn'].setValue(this.editData.isbn);
      this.books.controls['title'].setValue(this.editData.title);
      this.books.controls['authors'].setValue(this.editData.authors);
      this.books.controls['publisher'].setValue(this.editData.publisher);
      this.books.controls['publicationDate'].setValue(
        this.editData.publicationDate
      );
    }
  }
  addTask() {
    if (!this.editData) {
      if (this.books.valid) {
        this.api.create('books', this.books.value).then(() => {
          this.books.reset();
          this.dialogRef.close('save');
        });
      }
    } else {
      this.updateData();
    }
  }

  updateData() {
    this.api.update('books', this.editData.id, this.books.value).then(() => {
      this.books.reset();
      this.dialogRef.close('update');
    });
  }
}
