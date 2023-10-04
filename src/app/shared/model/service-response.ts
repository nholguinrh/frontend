export class ServiceResponse<T> {
  httpStatus: number;
  status?: string = '';
  message: string = '';
  date: string = '';
  data?: T;

  dateTime?: string;
  empresas?: T;
}
