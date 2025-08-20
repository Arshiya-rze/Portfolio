import { Component, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { ThisReceiver } from '@angular/compiler';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { HamburgerMenuComponent } from '../styles/hamburger-menu/hamburger-menu.component';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule, NgbNavModule, NgbDropdownModule,
    HamburgerMenuComponent
  ],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  responsiveMenuVisible = false;
}