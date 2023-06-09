import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserDialogComponent } from './user-page/user-dialog/user-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'to-do';

  displayedColumns: string[] = [
    'ISBN',
    'Title',
    'Author',
    'Publisher',
    'Publication Date',
    'Action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  bookList: any;
  checker: boolean = true;
  click() {
    this.checker = !this.checker;
  }
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
      .open(DialogComponent, {
        width: '50%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val == 'save') {
          this.getData();
        }
      });
  }

  add(book: any) {
    this.api.create('books', book);
  }

  getData() {
    this.api.get('books').subscribe({
      next: (res) => {
        this.bookList = res.map((e: any) => {
          const data = e.payload.doc.data();

          data.id = e.payload.doc.id;
          return data;
        });
        this.dataSource = new MatTableDataSource(this.bookList);
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
      .open(DialogComponent, {
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
    if (window.confirm('Delete "' + row.title + '"?')) {
      this.api.delete('books', row.id).then(() => {
        this.getData();
      });
    }
  }
}
