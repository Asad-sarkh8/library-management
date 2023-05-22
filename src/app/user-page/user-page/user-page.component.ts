import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { ApiService } from 'src/app/services/api.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  displayedColumns: string[] = [
    'ISBN',
    'First Name',
    'Last Name',
    'Email',
    'Contact no.',
    'Address',
    'Action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  borrowersList: any;

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getData();
  }
  openDialog(): void {
    this.dialog
      .open(UserDialogComponent, {
        width: '50%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val == 'save') {
          this.getData();
        }
      });
  }

  getData() {
    this.api.get('borrowers').subscribe({
      next: (res) => {
        this.borrowersList = res.map((e: any) => {
          const data = e.payload.doc.data();

          data.id = e.payload.doc.id;
          return data;
        });
        this.dataSource = new MatTableDataSource(this.borrowersList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        this.snackBar.open('Failed to fetch data', 'OK', {
          duration: 3000,
        });
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editData(row: any) {
    this.dialog
      .open(UserDialogComponent, {
        width: '50%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val == 'update') {
          this.getData();
        }
      });
  }

  deleteBook(row: any) {
    if (
      window.confirm('Delete "' + row.firstName + ' ' + row.lastName + '"?')
    ) {
      this.api.delete('borrowers', row.id).then(() => {
        this.getData();
      });
    }
  }
}
