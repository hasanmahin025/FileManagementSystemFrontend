import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Welcome } from './pages/welcome/welcome';
import { Login } from './pages/login/login';
import { guestGuard } from './Services/guard';

import { Favourite } from './pages/favourite/favourite';
import { Trash } from './pages/trash/trash';
import { Drive } from './pages/drive/drive';
import { Layout } from './layout/layout';
import { SharedByMe } from './pages/shared-by-me/shared-by-me';
import { SharedWithMe } from './pages/shared-with-me/shared-with-me';
import { Admin } from './pages/admin/admin';

export const routes: Routes = [


    { path: 'login',
     component: Login,
    // canActivate:[guestGuard]
    },
    {
       path:'home',
       component:Home
    },
    {
      path: 'welcome',
      component:Welcome
    },
    {
      path: '',
      component:Layout,
      children:[
        {
          path:'my-drive',
          component:Drive
        },
        {
          path:'favourite',
          component:Favourite
        },
        {
          path:'shared-by-me',
          component:SharedByMe
        }
        ,
        {
          path:'shared-with-me',
          component:SharedWithMe
        },
        {
          path:'trash',
          component:Trash
        },
        {
          path:'admin',
          component:Admin
        },
        {
        path: '',
        redirectTo: 'my-drive',
        pathMatch: 'full'
       }


      ]
    },
    

    { path: '**', redirectTo: 'home' }
];
