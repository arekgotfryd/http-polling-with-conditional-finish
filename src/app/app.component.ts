import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { timer } from "rxjs/internal/observable/timer";
import { filter, repeatWhen, switchMap, take, takeUntil } from "rxjs/operators";
import { Observable, of, Subject } from "rxjs";
import { delay, tap, mergeMap, repeat } from "rxjs/operators";

const completeWith = <T>(predicate: (arg: T) => boolean) => (
  source: Observable<T>
) =>
  new Observable<T>(observer =>
    source.subscribe(
      value => {
        observer.next(value);
        if (predicate(value)) {
          observer.complete();
        }
      },
      error => observer.error(error),
      () => observer.complete()
    )
  );

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular";
  poll: any;
  sub: any;

  stop$ = new Subject();

  constructor(private http: HttpClient) {
    this.poll = of({})
      .pipe(
        mergeMap(_ => this.request()),
        delay(3000),
        repeat(),
        completeWith(resp => {
          return resp.userId === 1;
        })
      )
      .pipe(tap(this.log));

    this.sub = this.poll.subscribe();
  }
  // takeUntil(this.stop$),

  request() {
    // now returns an Observable of Config
    return this.http.get<any>("https://jsonplaceholder.typicode.com/todos/1");
  }
  //fakeDelayedRequest = () => of(new Date()).pipe(delay(1000));

  delayedRequest = () => {
    // return this.request().pipe(delay(1000));
    return this.request();
  };

  checkResponse = resp => {
    // console.log(resp);
    if (resp.userId === 1) {
      // this.sub.unsubscribe();
      // return resp;
      this.stop$.next();
    }
  };

  log = response => {
    console.log(response);
  };
}
