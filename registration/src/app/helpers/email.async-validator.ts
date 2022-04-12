import {UserService} from "../service/user.service";
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {map, Observable} from "rxjs";

export function emailAsyncValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return userService.checkIfUserEmailExists(control.value)
      .pipe(
        map((result: boolean ) => {
          return  result ? { emailExists: true } : null
        })
      );
  };
}
