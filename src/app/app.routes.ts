import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Welcome } from './pages/welcome/welcome';
import { Login } from './pages/login/login';
import { guestGuard } from './Services/guard';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { Favourite } from './pages/favourite/favourite';
import { Trash } from './pages/trash/trash';
import { Shared } from './pages/shared/shared';

export const routes: Routes = [


    { path: '', redirectTo: 'home', pathMatch: 'full' },


    {
        path: 'home', 
        component: Home,
      //  canActivate: [guestGuard]
    },


    { path: 'login',
     component: Login,
    // canActivate:[guestGuard]
    },

    {path:'dashboard' , component:DashboardComponent},
   
    {
      path: 'favourite' , component: Favourite
    },
    {
      path: 'trash' , component:Trash
    },
    {
      path: 'shared' , component: Shared
    },

    { path: '**', redirectTo: 'home' }
];
