import { inject } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  var token = !!localStorage.getItem("jwt");
 
  if(token){
    return true
  }
  else{
    router.navigate(['/login'])    
    return false
  }
};

export const authGuardRole: CanActivateFn = (route, state) => {

  const router = inject(Router);
  var token = !!localStorage.getItem("jwt"),
    role = inject(AuthService),
    reg = new RegExp('*Admin')


  if(token && reg.test(role.getUserRole())){
    console.log("It works!!!");
    return true
  }
  else{
    console.log("OOOOOH NOOOOO");
    return false    
  }
}
