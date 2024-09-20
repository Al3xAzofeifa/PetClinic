import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from '../../share/generic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2'; // Asegúrate de tener SweetAlert2 instalado para notificaciones
import {
  NotificacionService,
  TipoMessage,
} from '../../share/notification.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-factura-detail',
  templateUrl: './factura-detail.component.html',
  styleUrls: ['./factura-detail.component.css'],
})
export class FacturaDetailComponent implements OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSourceProductos = new MatTableDataSource<any>();
  dataSourceServicios = new MatTableDataSource<any>();

  displayedColumnsProductos: string[] = [
    'id',
    'Producto',
    'Precio',
    'Cantidad',
    'Impuesto',
    'Subtotal',
  ];
  displayedColumnsServicios: string[] = [
    'id',
    'Servicio',
    'Precio',
    'Cantidad',
    'Impuesto',
    'Subtotal',
  ];

  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  mostrarProductos = false;
  mostrarServicios = false;

  isChecked = false;
  idFactura = 0;

  constructor(
    private gService: GenericService,
    private route: ActivatedRoute,
    private router: Router,
    private noti: NotificacionService,
    private http: HttpClient // Inyección de HttpClient
  ) {
    let id = this.route.snapshot.paramMap.get('id');
    if (!isNaN(Number(id))) this.obtenerFactura(Number(id));
  }

  obtenerFactura(id: any) {
    this.gService
      .get('factura', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data;
        this.idFactura = data.id;
        this.dataSourceProductos.data = this.datos.FacturaDetalle.filter(
          (detalle: any) => detalle.producto
        );
        this.dataSourceServicios.data = this.datos.FacturaDetalle.filter(
          (detalle: any) => detalle.servicio
        );
      });
  }

  calcularSubtotal(detalle: any): number {
    let precio = detalle.producto
      ? detalle.producto.precio
      : detalle.servicio
      ? detalle.servicio.precio
      : 0;
    return (
      precio * detalle.cantidad + precio * detalle.cantidad * detalle.impuesto
    );
  }

  calcularTotal(): number {
    return this.datos.FacturaDetalle.reduce(
      (total, detalle) => total + this.calcularSubtotal(detalle),
      0
    );
  }

  toggleCheck() {
    this.isChecked = !this.isChecked;
  }

  confirmarSeleccion() {
    if (this.isChecked) {
      console.log('Checkbox está seleccionado. Confirmar la acción.');

      // Crear un objeto con solo el estado a actualizar y el ID
      const statusUpdate = {
        id: this.idFactura, // Asegúrate de incluir el ID en el objeto
        estado: true, // Actualiza solo el campo estado
      };

      // Utiliza el método update del GenericService
      this.gService
        .update('factura/updateStatus', statusUpdate) // Solo pasa el objeto con el ID
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response: any) => {
            Swal.fire({
              title: 'Factura actualizada correctamente!',
              icon: 'success',
              showConfirmButton: true,
              timer: 2000,
              timerProgressBar: true,
            });
            this.close(); // Llama a la función detalle después del éxito
          },
          (error: any) => {
            console.error('Error al actualizar la factura:', error);
          }
        );
    } else {
      this.noti.mensaje(
        'Atención',
        'No se ha seleccionado el confirmar',
        TipoMessage.error
      );
    }
  }

  actualizarProforma(id: number) {
    this.router.navigate(['/factura/update', id], {
      relativeTo: this.route,
    });
  }

  detalle(id: number) {
    this.router.navigate(['/factura', id]);
  }

  close() {
    this.router.navigate(['/factura-table']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  toggleProductos() {
    this.mostrarProductos = !this.mostrarProductos;
  }

  toggleServicios() {
    this.mostrarServicios = !this.mostrarServicios;
  }
}
