import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink , Navbar],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {

}
