import {Hobby} from "./hobby";

export interface Registration {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  framework: string;
  frameworkVersion: string;
  email: string;
  hobby: Hobby[];
}
