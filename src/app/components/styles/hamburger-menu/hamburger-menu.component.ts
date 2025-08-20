import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hamburger-menu',
  imports: [],
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.scss'],
  standalone: true
})
export class HamburgerMenuComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  @Input() size = 28;
  @Input() thickness = 2;
  @Input() color = '#fff';

  toggle() {
    this.open = !this.open;
    this.openChange.emit(this.open);
  }
}