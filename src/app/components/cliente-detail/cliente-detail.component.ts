import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-cliente-detail',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './cliente-detail.component.html',
  styleUrl: './cliente-detail.component.css'
})
export class ClienteDetailComponent {
  @Input() cliente?: Cliente;
  constructor(private datePipe: DatePipe) {}

  formatDate(value?: string): string {
    if (!value) return '';
    return this.datePipe.transform(value, 'dd/MM/yyyy', undefined, 'es') || '';
  }
}
