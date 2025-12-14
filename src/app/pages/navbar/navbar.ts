import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Welcome } from '../welcome/welcome';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

}
