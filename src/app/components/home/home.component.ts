import { Component } from '@angular/core';
import { BannerComponent } from "../banner/banner.component";

@Component({
  selector: 'app-home',
  imports: [
    BannerComponent, BannerComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
