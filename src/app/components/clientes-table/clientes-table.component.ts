import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-clientes-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientes-table.component.html',
  styleUrl: './clientes-table.component.css'
})
export class ClientesTableComponent {
  @Input() clientes: Cliente[] = [];
  @Input() selectedId?: number;
  @Output() select = new EventEmitter<Cliente>();
  @Output() view = new EventEmitter<Cliente>();
  @Output() edit = new EventEmitter<Cliente>();
  @Output() remove = new EventEmitter<Cliente>();

  onRowClick(cliente: Cliente): void {
    this.select.emit(cliente);
  }
}
