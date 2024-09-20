import { AfterViewInit, Component, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GenericService } from '../../share/generic.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NotificacionService,
  TipoMessage,
} from '../../share/notification.service';

@Component({
  selector: 'app-factura-table',
  templateUrl: './factura-table.component.html',
  styleUrls: ['./factura-table.component.css'],
})
export class FacturaTableComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();
  displayedColumns = ['id', 'cliente', 'fecha', 'total', 'estado', 'acciones'];
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  clienteList: any;
  filtro: string = '';
  filterDatos: any;

  selectedDate: any;

  //Para datetime picker
  //minDate: Date;
  allowedDates: Date[] = [];
  sucursalHorarioData: any[] = [];
  rangosPermitidos: { start: string; end: string }[] = [];
  dateSelected: Date;

  currentUser = {
    email: 'isw@prueba.com',
    idUsuario: '2',
  };

  constructor(
    private gService: GenericService,
    private router: Router,
    private noti: NotificacionService,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.listFacturas();
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) {
      return false; // No permitir fechas nulas
    }

    // Obtener la fecha actual sin la hora
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Establecer la hora a medianoche

    // Comparar la fecha proporcionada con la fecha actual
    return date <= today;
  };

  listFacturas() {
    // Obtenemos las facturas directamente usando el idSucursal
    this.gService
      .get(`factura/facturasByIdSucursal`, this.currentUser.idUsuario)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (respuesta: any) => {
          console.log(respuesta);
          this.datos = respuesta;
          this.dataSource = new MatTableDataSource(this.datos);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.log('Error al obtener las facturas:', error);
          this.dataSource = new MatTableDataSource([]);
        }
      );
  }

  //Obtiene todos los usuarios con rol = cliente
  getClientes() {
    this.gService
      .list('usuario/getClientes')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.clienteList = data;
      });
  }

  convertDateToFormat(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes es 0-tableado
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  convertDateToUTCFormat(date: Date): string {
    // Convierte la fecha local a UTC-6 y luego a formato YYYY-MM-DD
    const utcDate = new Date(date.toUTCString());
    const day = utcDate.getUTCDate().toString().padStart(2, '0');
    const month = (utcDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = utcDate.getUTCFullYear();
    return `${year}-${month}-${day}`; // Formato YYYY-MM-DD
  }

  //Convierte los minutos a horas para ser mostradas en la interfaz
  convertToHours(minutes: number): string {
    if (isNaN(minutes)) {
      console.error('El valor de minutos no es un número:', minutes);
      return '00:00';
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convertir 0 a 12 para el formato de 12 horas
    const formattedMinutes = remainingMinutes.toString().padStart(2, '0');

    return `${formattedHours
      .toString()
      .padStart(2, '0')}:${formattedMinutes} ${period}`;
  }

  searchFacturaCliente(nombre: any) {
    if (nombre) {
      this.gService
        .list(`factura/byCliente/${nombre}/${this.currentUser.idUsuario}`)
        .pipe(takeUntil(this.destroy$))
        .subscribe((respuesta: any) => {
          console.log('Respuesta: ');
          console.log(respuesta);

          const transformedData = respuesta.map((item: any) => ({
            ...item,
            fecha: item.fecha,
          }));

          const filteredFacturas = respuesta.filter(
            (factura: any) => factura.sucursalId === this.currentUser.idUsuario
          );
          console.log(filteredFacturas);

          this.dataSource = new MatTableDataSource(transformedData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
    } else {
      this.listFacturas();
    }
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    const formattedDate = this.convertDateToUTCFormat(event.value);

    this.gService
      .list(
        `factura/facturasByFecha/${formattedDate}/${this.currentUser.idUsuario}`
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any[]) => {
        // Verifica si no hay datos
        if (data.length === 0) {
          this.noti.mensaje(
            'Atención',
            'No existen registros para esta fecha',
            TipoMessage.warning
          );
        }

        // Procesar y asignar los datos transformados a la tabla
        const transformedData = data.map((item: any) => ({
          ...item,
          fecha: item.fecha,
        }));

        this.dataSource = new MatTableDataSource(transformedData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  actualizarProforma(id: number) {
    this.router.navigate(['/factura/update', id], {
      relativeTo: this.route,
    });
  }

  detalle(id: number) {
    this.router.navigate(['/factura', id]);
  }

  limpiarFiltroInput() {
    if (this.filtro != '') {
      this.listFacturas();
    }
    this.filtro = '';
  }

  limpiarFiltroDate() {
    if (this.selectedDate != null) {
      this.listFacturas();
    }
    this.selectedDate = null;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
