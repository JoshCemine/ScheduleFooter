import { Component, viewChild, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DxButtonModule, DxSchedulerComponent, DxSchedulerModule, DxTemplateModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { Appointment } from 'devextreme/ui/scheduler';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DxSchedulerModule, DxTemplateModule, CommonModule, DxButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'schedulerFooter';
  appointmentsData: Appointment[];
  currentDate: Date = new Date(2021, 2, 28);
  appointmentArray: any = []
  constructor(service: AppService) {
    this.appointmentsData = service.getAppointments();
    this.appointmentArray = Array.from({ length: 7 }, () => ({
      dayName: '',
      hour: 0,
      minute: 0,
      texts: []
    }));
  }

  @ViewChild(DxSchedulerComponent, { static: false }) scheduler!: DxSchedulerComponent
  daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  onAppointmentRendered(e: any) {
    const day = (e.appointmentData.startDate.getDay() - 1) % 7;

    const summDate = e.appointmentData.endDate - e.appointmentData.startDate;
    const hours = Math.floor(summDate / (1000 * 60 * 60));
    const minutes = Math.floor((summDate % (1000 * 60 * 60)) / (1000 * 60));

    this.appointmentArray.forEach((e: any, i: any) => {
      e.dayName = this.daysOfWeek[i]
    });

    // Check if the appointment text already exists for that day
    if (!this.appointmentArray[day].texts.includes(e.appointmentData.text)) {
      // Add the appointment text to the day's texts
      this.appointmentArray[day].texts.push(e.appointmentData.text);

      // Update the hour and minute for that day
      this.appointmentArray[day].hour += hours;
      const totalMinutes = this.appointmentArray[day].minute + minutes;

      if (totalMinutes >= 60) {
        this.appointmentArray[day].minute = totalMinutes % 60;
        this.appointmentArray[day].hour++;
      } else {
        this.appointmentArray[day].minute += minutes;
      }
    }
  }

  onContentReady(e: any) {
    console.log(this.scheduler.dateCellTemplate)
    console.log(e.component.dateCellTemplate)
  }
}
