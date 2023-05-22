import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  borrowers!: FormGroup;
  ngOnInit(): void {
    this.borrowers = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      contact: ['', Validators.required],
      address: [''],
      isbn: ['', Validators.required],
    });

    if (this.editData) {
      this.borrowers.controls['isbn'].setValue(this.editData.isbn);
      this.borrowers.controls['firstName'].setValue(this.editData.firstName);
      this.borrowers.controls['lastName'].setValue(this.editData.lastName);
      this.borrowers.controls['email'].setValue(this.editData.email);
      this.borrowers.controls['contact'].setValue(this.editData.contact);
      this.borrowers.controls['address'].setValue(this.editData.address);
    }
  }
  addTask() {
    if (!this.editData) {
      if (this.borrowers.valid) {
        this.api.create('borrowers', this.borrowers.value).then(() => {
          this.borrowers.reset();
          this.dialogRef.close('save');
        });
      }
    } else {
      this.updateData();
    }
  }

  updateData() {
    this.api
      .update('borrowers', this.editData.id, this.borrowers.value)
      .then(() => {
        this.borrowers.reset();
        this.dialogRef.close('update');
      });
  }
}
