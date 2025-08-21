import { Component } from '@angular/core';
import { BannerComponent } from "../banner/banner.component";
import { HeaderComponent } from "../header/header.component";
import { AboutComponent } from "../about/about.component";

@Component({
  selector: 'app-home',
  imports: [
    BannerComponent, BannerComponent,
    HeaderComponent, AboutComponent,
    AboutComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
