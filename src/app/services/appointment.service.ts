import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserData {
  name: string;
  phone: string;
}

export interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
  icon: string;
}

export interface Barber {
  id: number;
  name: string;
  specialty: string;
  avatar: string;
  services: number[];
}

export interface AppointmentData {
  userData?: UserData;
  service?: Service;
  barber?: Barber;
  date?: string;
  time?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointmentData = new BehaviorSubject<AppointmentData>({});

  // Observable para que os componentes possam reagir às mudanças
  appointmentData$ = this.appointmentData.asObservable();

  constructor() { }

  // Métodos para atualizar cada parte dos dados
  setUserData(userData: UserData): void {
    const current = this.appointmentData.value;
    this.appointmentData.next({ ...current, userData });
  }

  setService(service: Service): void {
    const current = this.appointmentData.value;
    this.appointmentData.next({ ...current, service });
  }

  setBarber(barber: Barber): void {
    const current = this.appointmentData.value;
    this.appointmentData.next({ ...current, barber });
  }

  setDateTime(date: string, time: string): void {
    const current = this.appointmentData.value;
    this.appointmentData.next({ ...current, date, time });
  }

  // Método para obter os dados atuais
  getCurrentData(): AppointmentData {
    return this.appointmentData.value;
  }

  // Método para limpar os dados (útil para novo agendamento)
  clearData(): void {
    this.appointmentData.next({});
  }

  // Método para validar se todos os dados estão completos
  isAppointmentComplete(): boolean {
    const data = this.appointmentData.value;
    return !!(data.userData?.name &&
             data.userData?.phone &&
             data.service &&
             data.barber &&
             data.date &&
             data.time);
  }

  // Método para formatar os dados para exibição
  getFormattedAppointment() {
    const data = this.appointmentData.value;
    return {
      clientName: data.userData?.name || '',
      clientPhone: data.userData?.phone || '',
      serviceName: data.service?.name || '',
      servicePrice: data.service ? `R$ ${data.service.price.toFixed(2).replace('.', ',')}` : '',
      serviceDuration: data.service ? `${data.service.duration} min` : '',
      barberName: data.barber?.name || '',
      barberSpecialty: data.barber?.specialty || '',
      appointmentDate: data.date || '',
      appointmentTime: data.time || '',
      totalPrice: data.service ? `R$ ${data.service.price.toFixed(2).replace('.', ',')}` : ''
    };
  }
}
