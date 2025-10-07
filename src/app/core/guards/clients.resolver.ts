import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ClientsListResponse, ClientResponse, ClientsService } from '../../pages/dashboard/dashboard-pages/clients/services/clients.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class ClientsResolver implements Resolve<ClientsListResponse | ClientResponse> {
  constructor(
    private clientsService: ClientsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ClientsListResponse | ClientResponse> {
    this.ngxSpinnerService.show('actionsLoader');
    const id = route.paramMap.get('id');
    if (id) {
      return this.clientsService.getById(+id);
    }
    return this.clientsService.getAll();
  }
}