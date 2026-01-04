import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  imports: [RouterLink],
  standalone:true,
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {

}
