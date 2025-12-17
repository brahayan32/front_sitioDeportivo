import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-entrenador-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './solicitudes-layout.component.html',
  styleUrls: ['./entrenador-layout.component.scss']
})
export class EntrenadorLayoutComponent {
  menuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}