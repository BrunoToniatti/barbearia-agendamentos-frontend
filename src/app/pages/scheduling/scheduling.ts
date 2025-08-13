import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppointmentService, Service, Barber } from '../../services/appointment.service';

interface CalendarDay {
  day: number;
  date: string;
  available: boolean;
}

@Component({
  selector: 'app-scheduling',
  imports: [CommonModule],
  templateUrl: './scheduling.html',
  styleUrl: './scheduling.scss'
})
export class Scheduling {
  currentStep = 1;
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();

  selectedService: Service | null = null;
  selectedBarber: Barber | null = null;
  selectedDate: string | null = null;
  selectedTime: string | null = null;

  dayHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  constructor(
    private router: Router,
    private appointmentService: AppointmentService
  ) {}

  services: Service[] = [
    { id: 1, name: 'Corte Masculino', duration: 30, price: 35, icon: '✂️' },
    { id: 2, name: 'Barba', duration: 20, price: 25, icon: '🧔' },
    { id: 3, name: 'Corte + Barba', duration: 45, price: 55, icon: '💈' },
    { id: 4, name: 'Sobrancelha', duration: 15, price: 15, icon: '👁️' },
    { id: 5, name: 'Bigode', duration: 10, price: 10, icon: '👨‍🦰' },
    { id: 6, name: 'Relaxamento', duration: 60, price: 80, icon: '🧴' }
  ];

  barbers: Barber[] = [
    { id: 1, name: 'João', specialty: 'Especialista em cortes clássicos', avatar: '👨‍🦲', services: [1, 2, 3, 4, 5] },
    { id: 2, name: 'Pedro', specialty: 'Cortes modernos e barbas', avatar: '🧔‍♂️', services: [1, 2, 3, 6] },
    { id: 3, name: 'Carlos', specialty: 'Relaxamento e tratamentos', avatar: '👨‍🦱', services: [1, 4, 5, 6] },
    { id: 4, name: 'Miguel', specialty: 'Todos os serviços', avatar: '👨‍🦳', services: [1, 2, 3, 4, 5, 6] }
  ];

  getStepTitle(): string {
    const titles = ['', 'Escolha o Serviço', 'Escolha o Barbeiro', 'Escolha a Data', 'Escolha o Horário', 'Confirmação'];
    return titles[this.currentStep];
  }

  selectService(service: Service): void {
    this.selectedService = service;
    this.selectedBarber = null;
    this.selectedDate = null;
    this.selectedTime = null;

    // Salvar no service
    this.appointmentService.setService(service);
  }

  selectBarber(barber: Barber): void {
    this.selectedBarber = barber;
    this.selectedDate = null;
    this.selectedTime = null;

    // Salvar no service
    this.appointmentService.setBarber(barber);
  }

  selectDate(day: CalendarDay): void {
    if (day.available) {
      this.selectedDate = day.date;
      this.selectedTime = null;
    }
  }

  selectTime(time: string): void {
    this.selectedTime = time;

    // Salvar data e hora no service quando ambos estiverem selecionados
    if (this.selectedDate && time) {
      this.appointmentService.setDateTime(this.selectedDate, time);
    }
  }

  getAvailableBarbers(): Barber[] {
    if (!this.selectedService) return [];
    return this.barbers.filter(barber =>
      barber.services.includes(this.selectedService!.id)
    );
  }

  get calendarDays(): CalendarDay[] {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDate.getMonth() === this.currentMonth;
      const isToday = currentDate.toDateString() === new Date().toDateString();
      const isPast = currentDate < new Date() && !isToday;

      days.push({
        day: currentDate.getDate(),
        date: currentDate.toISOString().split('T')[0],
        available: isCurrentMonth && !isPast && this.selectedBarber !== null
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }

  getAvailableTimes(): string[] {
    if (!this.selectedDate || !this.selectedService) return [];

    const times = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30', '18:00'
    ];

    // Simula horários ocupados
    const occupiedTimes = ['09:00', '10:30', '15:00', '16:30'];

    return times.filter(time => !occupiedTimes.includes(time));
  }

  getMonthYear(): string {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${months[this.currentMonth]} ${this.currentYear}`;
  }

  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.selectedDate = null;
    this.selectedTime = null;
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.selectedDate = null;
    this.selectedTime = null;
  }

  canProceed(): boolean {
    switch (this.currentStep) {
      case 1: return !!this.selectedService;
      case 2: return !!this.selectedBarber;
      case 3: return !!this.selectedDate;
      case 4: return !!this.selectedTime;
      default: return false;
    }
  }

  canConfirm(): boolean {
    return !!(this.selectedService && this.selectedBarber && this.selectedDate && this.selectedTime);
  }

  nextStep(): void {
    if (this.canProceed() && this.currentStep < 5) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  formatDate(date: string | null): string {
    if (!date) return '';
    const d = new Date(date + 'T00:00:00');
    return d.toLocaleDateString('pt-BR');
  }

  isMobile(): boolean {
    return window.innerWidth < 1024;
  }

  confirmBooking(): void {
    if (!this.canConfirm()) return;

    // Verificar se todos os dados estão completos no service
    if (this.appointmentService.isAppointmentComplete()) {
      console.log('Agendamento confirmado:', this.appointmentService.getFormattedAppointment());

      // Redirecionar para a tela de finalização
      this.router.navigateByUrl('/finish');
    } else {
      console.error('Dados do agendamento incompletos');
    }
  }
}
