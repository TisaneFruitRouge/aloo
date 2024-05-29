import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TipsService {
  private tipTextSource = "Initial tip text";

  updateTipText(newText: string) {
    this.tipTextSource = newText;
  }

  getTip() {
    return this.tipTextSource;
  }
}
