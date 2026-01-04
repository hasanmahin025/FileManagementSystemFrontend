import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNav } from '../pages/side-nav/side-nav';
import { Header } from '../pages/header/header';

@Component({
  selector: 'app-layout',
  imports: [SideNav , Header , RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}
