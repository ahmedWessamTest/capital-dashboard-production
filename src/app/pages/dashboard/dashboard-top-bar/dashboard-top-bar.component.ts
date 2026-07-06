import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DashboardLayoutService } from "../../../core/services/core/dashboard-layout.service";

@Component({
  selector: "app-dashboard-top-bar",
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: "./dashboard-top-bar.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTopBarComponent {
  layoutService = inject(DashboardLayoutService);
}
