import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipsService } from './tips.service';

@Component({
  selector: 'app-tips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tips.component.html',
  styleUrl: './tips.component.css'
})
export class TipsComponent {
  @Input() tipText: string = "";
  @Input() tipsService: TipsService = new TipsService();

  constructor() { }

  getTipService() {
    return this.tipsService;
  }
}