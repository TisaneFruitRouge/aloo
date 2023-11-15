import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenRuler, faDoorClosed, faWindowRestore } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-toolbox',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './toolbox.component.html',
  styleUrl: './toolbox.component.css'
})
export class ToolboxComponent {
  faPenRuler = faPenRuler;
  faDoorClosed = faDoorClosed;
  faWindowRestore = faWindowRestore
}
