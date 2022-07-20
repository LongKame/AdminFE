import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CellCustomComponent } from './cell-custom/cell-custom.component';
// import { CellCustomComponentComponent } from './cell-custom-component/cell-custom-component.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';


export class Product {
  private name: any;
  private quantity: any;
  private price: any;
  private id_Type: any;
  private image: any;

  constructor(name: any, quantity: any, price: any, id_Type: any, image: any) {
    this.name = name;
    this.quantity = quantity;
    this.price = price;
    this.id_Type = id_Type;
    this.image = image;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'AdminFE';

  ngOnInit(): void {
    this.createTable();
    setTimeout(() => {
      this.onLoad();
    }, 3000)
  }

  name: any;
  quantity: any;
  price: any;
  id_Type: any;
  image: any;

  public product: Product;

  constructor(private http: HttpClient,
    private modalService: BsModalService,
    private toast: ToastrService) {
    this.product = new Product(this.name, this.quantity, this.price, this.id_Type, this.image);
  };

  columnDefs: any;
  rowData: any
  modalRef: BsModalRef | undefined;



  onLoad() {
    this.http.get<any>('http://localhost:8070/api/sp1/product/list').subscribe(
      response => {
        this.rowData = response;
      }
    );
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }


  STYLE_TABLE = {
    'font-weight': '500',
    'font-size': '12px',
    'align-items': 'center',
    'top': '30px',
    'overflow': 'hidden',
    'text-align': 'center'
  }


  createTable() {
    this.columnDefs = [
      {
        headerName: 'Order of list',
        valueGetter: (params: any) => {
          if (params.node.rowIndex == 0) {
            return params.node.rowIndex = 1;
          } else {
            params.node.rowIndex++;
            return params.node.rowIndex++;
          }
        }
        , cellStyle: this.STYLE_TABLE
      },
      { headerName: 'Name', field: 'name', cellStyle: this.STYLE_TABLE },
      {
        headerName: 'Image', field: 'image',
        cellRenderer: (params: any) => {
          return `<img src="${params.value}" width="30px" height="40px">`;
        },
        cellStyle: this.STYLE_TABLE
      },
      { headerName: 'Dop', field: 'dop', cellStyle: this.STYLE_TABLE },
      { headerName: 'Price', field: 'price', cellStyle: this.STYLE_TABLE },
      { headerName: 'Quantity', field: 'quantity', cellStyle: this.STYLE_TABLE },

      { headerName: 'Type', field: 'id_Type', cellStyle: this.STYLE_TABLE },
      {
        headerName: "Action",
        // minWidth: 100,
        // maxWidth: 300,
        cellRendererFramework: CellCustomComponent,
        // cellStyle: this.STYLE_TABLE,
      },

    ];
  }


  addProduct() {
    this.product = new Product(this.name, this.quantity, this.price, this.id_Type, this.image);
    this.http.post<any>('http://localhost:8070/api/sp1/product/add', this.product).subscribe(
      response => {
        this.onLoad();
        this.toast.success("Successfully");
        this.modalRef?.hide();
      }
    )
  }


}
