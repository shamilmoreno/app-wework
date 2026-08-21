import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';

// ANGULAR MATERIAL
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';

// MODELS
import { InventoryModel } from '@core/models/inventory.model';

// SERVICES
import { InventoryService } from '@core/services/inventory-service';

@Component({
  selector: 'app-inventory-movement-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatIconModule, MatExpansionModule],
  templateUrl: './inventory-movement-list.component.html',
  styleUrl: './inventory-movement-list.component.scss',
  //providers: [InventoryService],
})
export class InventoryMovementListComponent {
  public contextMenuPosition = { x: '0px', y: '0px' };
  public dialogTitle!: string;
  @Input() public breadscrums: Array<any> = [];
  @Input() public showNew: boolean = true;
  @Input() public searchTittle: string | undefined;
  @Input() public columns: Array<any> = [];
  @Output() public action = new EventEmitter();
  @Output() public refresh = new EventEmitter();

  public isTblLoading: boolean | undefined;
  public inventory!: InventoryModel | null;
  public displayedColumns: string[] = [];
  public dataLength!: number;
  public inventoryMovementList: Array<any> = [];
  public product: string = '';
  public panelOpenState = false;
  public expandedElement: any;

  constructor(
    private inventoryMovementListDialog: MatDialogRef<InventoryMovementListComponent>,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public inventoryService: InventoryService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    //super();
  }

  ngOnInit(): void {
    // Captura la información del state
    this.inventoryMovementList = this.data.inventoryListMovements;
    this.product = this.data.product;
  }

  public update(row: any) {
    const info = {
      action: {
        label: '',
        name: 'manage',
      },
      data: {
        row,
      },
    };
    this.action.emit(info);
  }

  public detail(row: any) {
    const info = {
      action: {
        label: '',
        name: 'detail',
      },
      data: {
        row,
      },
    };
    this.action.emit(info);
  }

  public delete(row: any) {
    const info = {
      action: {
        label: '',
        name: 'delete',
      },
      data: {
        row,
      },
    };
    this.action.emit(info);
  }

  public dataRefresh() {
    this.refresh.emit(true);
  }

  public showNotification(colorName: any, text: any, placementFrom: any, placementAlign: any) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  public closeDialog() {
    this.inventoryMovementListDialog.close();
  }
}
