import { Injectable } from '@angular/core';
import {delay, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private existingEmail = ['test@test.test'];

  checkIfUserEmailExists(value: string) {
    return of(this.existingEmail.some((a) => a === value)).pipe(
      delay(2000)
    );
  }
}
