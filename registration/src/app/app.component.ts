import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Registration} from "./model/registration";
import {NgbTypeahead, NgbTypeaheadSelectItemEvent} from "@ng-bootstrap/ng-bootstrap";
import {debounceTime, distinctUntilChanged, filter, map, merge, Observable, OperatorFunction, Subject} from "rxjs";
import {Framework} from "./helpers/framework";
import {Hobbies} from "./helpers/hobbies";
import {Hobby} from "./model/hobby";
import {Duration} from "./helpers/duration";
import {Regex} from "./helpers/regex";
import {UserService} from "./service/user.service";
import {emailAsyncValidator} from "./helpers/email.async-validator";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  @ViewChild('frameworkInstance', { static: true }) frameworkInstance!: NgbTypeahead;
  frameworkFocus$ = new Subject<string>();
  frameworkClick$ = new Subject<string>();

  @ViewChild('hobbyInstance', { static: true }) hobbyInstance!: NgbTypeahead;
  hobbyFocus$ = new Subject<string>();
  hobbyClick$ = new Subject<string>();

  @ViewChild('durationInstance', { static: true }) durationInstance!: NgbTypeahead;
  durationFocus$ = new Subject<string>();
  durationClick$ = new Subject<string>();

  form!: FormGroup;
  hobby!: FormGroup;
  selectedHobbies: Hobby[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      firstName: new FormControl('',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
      ]),
      lastName: new FormControl('',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ]),
      dateOfBirth: new FormControl(null,
        [
          Validators.required,
        ]),
      framework: new FormControl('',
        [
          Validators.required,
        ]),
      frameworkVersion: new FormControl('',
        [
          Validators.required,
        ]),
      email: new FormControl('',
        [
          Validators.required,
          Validators.pattern(Regex.email)
        ],
        [
          emailAsyncValidator(this.userService)
        ]
        ),
    })
    this.hobby = new  FormGroup({
      name: new FormControl('',
        [
          Validators.required,
        ]),
      duration: new FormControl('',
        [
          Validators.required,
        ])
    })
  }

  searchFramework: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.frameworkClick$.pipe(filter(() => !this.frameworkInstance.isPopupOpen()));
    const inputFocus$ = this.frameworkFocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? Framework
        : Framework.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  searchHobbies: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.hobbyClick$.pipe(filter(() => !this.hobbyInstance.isPopupOpen()));
    const inputFocus$ = this.hobbyFocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? Hobbies
        : Hobbies.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  searchDuration: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.durationClick$.pipe(filter(() => !this.durationInstance.isPopupOpen()));
    const inputFocus$ = this.durationFocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? Duration
        : Duration.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  onSubmit() {
    let data = this.form.value as Registration;
    data.hobby = this.selectedHobbies;
    console.log(data)
  }

  addHobby() {
    if(!this.selectedHobbies.some(h => h.name === this.hobby.value.name)){
      this.selectedHobbies.push(this.hobby.value as Hobby);
    }
    this.hobby.reset();
  }
}
