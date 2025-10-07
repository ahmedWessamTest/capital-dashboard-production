// data-refresh.service.ts
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DataRefreshService {
  private refreshSubject = new Subject<void>();

  refresh$ = this.refreshSubject.asObservable();

  triggerRefresh() {
    console.log("triggered data refresh")
    this.refreshSubject.next();
  }
}