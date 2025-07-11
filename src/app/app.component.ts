import { Component } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [DashboardComponent, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'csi-document-generator';
}
