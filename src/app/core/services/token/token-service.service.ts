import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenCheckInterval: any;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  setToken(token: string, expiresIn?: number) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token); // Consider cookies/in-memory
      this.startTokenExpiryCheck(expiresIn);
    }
  }

  startTokenExpiryCheck(expiresIn?: number) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token')?.replace(/^"|"$/g, '');
      if (!token) return;

      let expiryTime: number;
      try {
        const payload = this.decodeJwt(token);
        expiryTime = expiresIn ? Date.now() + expiresIn * 1000 : payload.exp * 1000;
      } catch (e) {
        this.logout();
        return;
      }

      this.tokenCheckInterval = setInterval(() => {
        console.log("check authorization")
        if (Date.now() >= expiryTime - 30000) {
          this.logout();
        }
      }, 60000); // Check every minute
    }
  }

  private decodeJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1]; // Get payload part
      if (!base64Url) throw new Error('Invalid token');
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Convert Base64URL to Base64
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      throw new Error('Failed to decode token');
    }
  }

  stopTokenCheck() {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  }

  private logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('savedEmail');
      this.stopTokenCheck();
      this.router.navigate(['/login'], { queryParams: { reason: 'session_expired' } });
    }
  }
}