import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';

interface DisplayAppointmentData {
  clientName: string;
  clientPhone: string;
  serviceName: string;
  servicePrice: string;
  serviceDuration: string;
  barberName: string;
  barberSpecialty: string;
  appointmentDate: string;
  appointmentTime: string;
  totalPrice: string;
}

@Component({
  selector: 'app-finish',
  imports: [CommonModule, FormsModule],
  templateUrl: './finish.html',
  styleUrl: './finish.scss'
})
export class Finish implements OnInit {
  appointmentData: DisplayAppointmentData | null = null;
  rating = 0;
  hoverRating = 0;
  feedbackText = '';
  feedbackSubmitted = false;

  constructor(
    private router: Router,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    // Verificar se há dados de agendamento
    if (this.appointmentService.isAppointmentComplete()) {
      this.appointmentData = this.appointmentService.getFormattedAppointment();
    } else {
      // Se não há dados, redirecionar para o início
      console.warn('Não há dados de agendamento, redirecionando...');
      this.router.navigate(['/identificacao']);
    }
  }

  formatDate(date: any): string {
    let date_separete = date.split('-')
    return `${date_separete[2]}/${date_separete[1]}/${date_separete[0]}`
  }

  setRating(rating: number): void {
    this.rating = rating;
  }

  setHoverRating(rating: number): void {
    this.hoverRating = rating;
  }

  getRatingText(): string {
    const texts = ['', 'Muito Ruim', 'Ruim', 'Regular', 'Bom', 'Excelente'];
    return texts[this.rating] || '';
  }

  submitFeedback(): void {
    if (this.rating === 0) return;

    // Aqui enviaria o feedback para o backend
    console.log('Feedback enviado:', {
      rating: this.rating,
      feedback: this.feedbackText,
      appointment: this.appointmentData
    });

    this.feedbackSubmitted = true;

    // Feedback visual
    setTimeout(() => {
      this.feedbackSubmitted = false;
    }, 3000);
  }

  goHome(): void {
    // Limpar dados do agendamento ao ir para home
    this.appointmentService.clearData();
    this.router.navigateByUrl('/intro');
  }

  newAppointment(): void {
    // Limpar dados do agendamento para novo agendamento
    this.appointmentService.clearData();
    this.router.navigateByUrl('/identificacao');
  }
}
