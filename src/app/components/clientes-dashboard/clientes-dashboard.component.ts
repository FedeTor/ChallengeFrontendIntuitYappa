import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ClientesTableComponent } from '../clientes-table/clientes-table.component';
import { ClienteDetailComponent } from '../cliente-detail/cliente-detail.component';
import { ClienteFormComponent } from '../cliente-form/cliente-form.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ToastComponent } from '../toast/toast.component';
import { Cliente, ClienteCreateDto, ClienteUpdateDto } from '../../models/cliente.model';
import { ClientesService } from '../../services/clientes.service';
import { HttpErrorResponse } from '@angular/common/http';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

@Component({
  selector: 'app-clientes-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SearchBarComponent,
    ClientesTableComponent,
    ClienteDetailComponent,
    ClienteFormComponent,
    DeleteDialogComponent,
    ToastComponent
  ],
  templateUrl: './clientes-dashboard.component.html',
  styleUrl: './clientes-dashboard.component.css'
})
export class ClientesDashboardComponent implements OnInit {
  private clientesService = inject(ClientesService);

  clientes: Cliente[] = [];
  selectedCliente?: Cliente;
  loading = false;
  actionLoading = false;
  showForm = false;
  formMode: 'create' | 'edit' = 'create';
  showDelete = false;
  toast?: ToastState;
  errorMessage: string | null = null;
  validationErrors: string[] = [];
  showErrorModal = false;
  private errorModalTimeout?: ReturnType<typeof setTimeout>;
  readonly errorModalDuration = 4000;

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.resetErrors();
    this.loading = true;
    this.clientesService.getAll().subscribe({
      next: (data) => {
        this.clientes = data;
        if (this.selectedCliente) {
          this.selectedCliente = this.clientes.find((c) => c.id === this.selectedCliente?.id);
        }
      },
      error: (err) => {
        this.handleError(err, 'No se pudieron cargar los clientes');
        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }

  onSearch(term: string): void {
    if (!term) {
      this.loadClientes();
      return;
    }
    this.resetErrors();
    this.loading = true;
    this.clientesService.search(term).subscribe({
      next: (data) => (this.clientes = data),
      error: (err) => {
        this.handleError(err, 'No se pudo realizar la búsqueda');
        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }

  onClearSearch(): void {
    this.loadClientes();
  }

  selectCliente(cliente: Cliente): void {
    this.selectedCliente = cliente;
  }

  openCreate(): void {
    this.formMode = 'create';
    this.selectedCliente = undefined;
    this.showForm = true;
  }

  openEdit(cliente: Cliente): void {
    this.formMode = 'edit';
    this.selectedCliente = cliente;
    this.showForm = true;
  }

  onSubmitForm(data: Partial<Cliente>): void {
    if (this.formMode === 'create') {
      this.createCliente(data as ClienteCreateDto);
    } else if (this.selectedCliente) {
      this.updateCliente(this.selectedCliente.id, data as ClienteUpdateDto);
    }
  }

  createCliente(payload: ClienteCreateDto): void {
    this.resetErrors();
    this.actionLoading = true;
    this.clientesService.create(payload).subscribe({
      next: (cliente) => {
        this.clientes = [cliente, ...this.clientes];
        this.selectedCliente = cliente;
        this.toast = { message: 'Cliente creado correctamente', type: 'success' };
      },
      error: (err) => {
        this.handleError(err, 'No se pudo crear el cliente');
        this.actionLoading = false;
      },
      complete: () => {
        this.actionLoading = false;
        this.showForm = false;
      }
    });
  }

  updateCliente(id: number, payload: ClienteUpdateDto): void {
    this.resetErrors();
    this.actionLoading = true;
    this.clientesService.update(id, payload).subscribe({
      next: (cliente) => {
        this.clientes = this.clientes.map((c) => (c.id === id ? { ...c, ...cliente } : c));
        this.selectedCliente = this.clientes.find((c) => c.id === id);
        this.toast = { message: 'Cliente actualizado correctamente', type: 'success' };
      },
      error: (err) => {
        this.handleError(err, 'No se pudo actualizar el cliente');
        this.actionLoading = false;
      },
      complete: () => {
        this.actionLoading = false;
        this.showForm = false;
      }
    });
  }

  confirmDelete(cliente: Cliente): void {
    this.selectedCliente = cliente;
    this.showDelete = true;
  }

  deleteCliente(): void {
    if (!this.selectedCliente) return;
    this.resetErrors();
    this.actionLoading = true;
    const id = this.selectedCliente.id;
    this.clientesService.delete(id).subscribe({
      next: () => {
        this.clientes = this.clientes.filter((c) => c.id !== id);
        this.selectedCliente = undefined;
        this.toast = { message: 'Cliente eliminado', type: 'success' };
      },
      error: (err) => {
        this.handleError(err, 'No se pudo eliminar el cliente');
        this.actionLoading = false;
      },
      complete: () => {
        this.actionLoading = false;
        this.showDelete = false;
      }
    });
  }

  closeForm(): void {
    this.showForm = false;
  }

  closeDelete(): void {
    this.showDelete = false;
  }

  private resetErrors(): void {
    this.errorMessage = null;
    this.validationErrors = [];
    this.showErrorModal = false;
    if (this.errorModalTimeout) {
      clearTimeout(this.errorModalTimeout);
      this.errorModalTimeout = undefined;
    }
  }

  private handleError(error: HttpErrorResponse, fallbackMessage?: string): void {
    console.error('Error en petición de clientes', error);

    if (error.error && typeof error.error === 'object' && 'message' in error.error) {
      this.errorMessage = error.error.message;
      this.openErrorModal();
      return;
    }

    if (Array.isArray(error.error)) {
      this.validationErrors = error.error;
      this.errorMessage = 'Se encontraron errores de validación.';
      this.openErrorModal();
      return;
    }

    if (error.error && error.error.errors && typeof error.error.errors === 'object') {
      const errorsObj = error.error.errors;
      this.validationErrors = Object.keys(errorsObj)
        .map((key) => errorsObj[key])
        .flat();
      this.errorMessage = 'Se encontraron errores de validación.';
      this.openErrorModal();
      return;
    }

    this.errorMessage = fallbackMessage || 'Ocurrió un error al procesar la solicitud.';
    this.openErrorModal();
  }

  private openErrorModal(): void {
    this.showErrorModal = true;
    if (this.errorModalTimeout) {
      clearTimeout(this.errorModalTimeout);
    }
    this.errorModalTimeout = setTimeout(() => {
      this.resetErrors();
    }, this.errorModalDuration);
  }
}
