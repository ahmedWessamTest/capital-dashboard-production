import { OnInit } from '@angular/core';
import { Component, HostListener, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { timer } from "rxjs";
import { initFlowbite } from "flowbite";
import { FlowbiteService } from "./core/services/core/flowbite.service";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, NgxSpinnerModule, ToastModule,],
  templateUrl: "./app.component.html",
  standalone: true,
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  ngxSpinnerService = inject(NgxSpinnerService);
  flowbiteService = inject(FlowbiteService);
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
    this.ngxSpinnerService.show("mainLoader");
  }
  @HostListener("window:load")
  onWindowLoad() {
    timer(3000).subscribe(() => this.ngxSpinnerService.hide("mainLoader"));
  }

}
