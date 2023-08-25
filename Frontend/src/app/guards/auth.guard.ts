import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
  
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  var token = !!localStorage.getItem("jwt");
 
  if(token){
    return true
  }
  else{
    router.navigate(['/login'])
    console.log("HEJSA");
    
    return false
  }
};
