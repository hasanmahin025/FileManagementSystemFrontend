import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { Welcome } from '../welcome/welcome';

@Component({
  selector: 'app-home',
  imports:  [Welcome],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
