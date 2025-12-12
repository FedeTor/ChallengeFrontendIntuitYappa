import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css'
})
export class ClienteFormComponent implements OnChanges {
  @Input() open = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() cliente?: Cliente;
  @Output() submitForm = new EventEmitter<Partial<Cliente>>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  readonly maxBirthDate = new Date().toISOString().split('T')[0];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      razonSocial: ['', [Validators.required]],
      cuit: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{8}-\d{1}$/)]],
      fechaNacimiento: ['', [Validators.required, this.fechaAnteriorAHoyValidator]],
      telefonoCelular: ['', [Validators.required, Validators.pattern(/^\d{2}\s\d{4}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cliente'] || changes['mode']) {
      if (this.mode === 'edit' && this.cliente) {
        this.form.reset({
          nombre: this.cliente.nombre,
          apellido: this.cliente.apellido,
          razonSocial: { value: this.cliente.razonSocial, disabled: true },
          cuit: { value: this.cliente.cuit, disabled: true },
          fechaNacimiento: { value: this.cliente.fechaNacimiento, disabled: true },
          telefonoCelular: this.cliente.telefonoCelular,
          email: this.cliente.email
        });
      } else {
        this.form.reset();
        this.form.enable();
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.submitForm.emit(value);
  }

  get nombre() {
    return this.form.get('nombre');
  }

  get apellido() {
    return this.form.get('apellido');
  }

  get razonSocial() {
    return this.form.get('razonSocial');
  }

  get cuit() {
    return this.form.get('cuit');
  }

  get fechaNacimiento() {
    return this.form.get('fechaNacimiento');
  }

  get telefonoCelular() {
    return this.form.get('telefonoCelular');
  }

  get email() {
    return this.form.get('email');
  }

  private fechaAnteriorAHoyValidator(control: AbstractControl) {
    if (!control.value) return null;
    const today = new Date().toISOString().split('T')[0];
    return control.value < today ? null : { futureDate: true };
  }
}
