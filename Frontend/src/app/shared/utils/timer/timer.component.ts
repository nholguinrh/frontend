import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { Subscription, Observable, timer } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent implements OnInit {
  private subscription: Subscription;
  @Output() TimerExpired: EventEmitter<any> = new EventEmitter<any>();
  @Input() SearchDate: moment.Moment = moment();
  @Input() ElapsTime: number;

  searchEndDate: moment.Moment;
  remainingTime: number;
  minutes: number;
  seconds: number;

  everySecond: Observable<number> = timer(0, 1000);

  constructor(private ref: ChangeDetectorRef) {
    this.createSubscription();
  }

  createSubscription(): void {
    this.subscription = this.everySecond.subscribe(() => {
      let currentTime: moment.Moment = moment();
      this.remainingTime = this.searchEndDate.diff(currentTime);
      this.remainingTime = this.remainingTime / 1000;

      if (this.remainingTime <= 0) {
        this.SearchDate = moment();
        this.searchEndDate = this.SearchDate.add(this.ElapsTime, 'minutes');

        this.TimerExpired.emit();
        this.subscription.unsubscribe();
      } else {
        this.minutes = Math.floor(this.remainingTime / 60);
        this.seconds = Math.floor(this.remainingTime - this.minutes * 60);
      }
      this.ref.markForCheck();
    });
  }

  ngOnInit(): void {
    this.searchEndDate = this.SearchDate.add(this.ElapsTime, 'minutes');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
