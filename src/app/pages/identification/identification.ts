
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-identification',
  imports: [FormsModule],
  templateUrl: './identification.html',
  styleUrl: './identification.scss'
})
export class Identification {
  name = '';
  phone = '';

  constructor(
    private router: Router,
    private appointmentService: AppointmentService
  ) {}


  onPhoneInput(event: Event) {
    let value = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 0) {
      value = value.replace(/(\d{2})(\d)/, '($1) $2');
      if (value.length > 9) {
        value = value.replace(/(\d{5})(\d{4})$/, '$1-$2');
      } else {
        value = value.replace(/(\d{4})(\d{0,4})$/, '$1-$2');
      }
    }
    this.phone = value;
    (event.target as HTMLInputElement).value = value;
  }

  submit() {
    if (this.name && this.phone.length >= 14) {
      // Salvar dados do usuário no service
      this.appointmentService.setUserData({
        name: this.name,
        phone: this.phone
      });

      console.log('Dados do usuário salvos:', { name: this.name, phone: this.phone });
      this.router.navigate(['/agendamento']);
    } else {
      console.error('Form is invalid');
    }
  }
}
