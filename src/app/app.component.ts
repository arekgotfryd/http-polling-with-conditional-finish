import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
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

  constructor(private http: HttpClient) {
    const poll = of({})
      .pipe(
        mergeMap(_ => this.request()),
        delay(3000),
        repeat(),
        completeWith(resp => {
          return resp.userId === 1;
        })
      )
      .pipe(tap(this.log));

    poll.subscribe();
  }

  request() {
    return this.http.get<any>("https://jsonplaceholder.typicode.com/todos/1");
  }

  log = response => {
    console.log(response);
  };
}
