import { Component } from '@angular/core';
import { ClientesDashboardComponent } from './components/clientes-dashboard/clientes-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ClientesDashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
