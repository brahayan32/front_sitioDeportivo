import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-cliente-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <!-- Sidebar -->
    <div class="sidebar" [class.sidebar-open]="sidebarOpen">
      <div class="sidebar-header">
        <h2>🎾 MIS ESPACIOS</h2>
        <button class="sidebar-close" (click)="toggleSidebar()" aria-label="Cerrar menú">
          ✕
        </button>
      </div>

      <nav class="sidebar-nav">
        <a
          routerLink="/cliente/reservas"
          routerLinkActive="active"
          class="nav-item"
          (click)="sidebarOpen = false"
        >
          <span class="icon">📅</span>
          <span class="label">Mis Reservas</span>
        </a>
        <a
          routerLink="/cliente/entrenamientos"
          routerLinkActive="active"
          class="nav-item"
          (click)="sidebarOpen = false"
        >
          <span class="icon">🏃</span>
          <span class="label">Entrenamientos</span>
        </a>
        <a
          routerLink="/cliente/mis-pagos"
          routerLinkActive="active"
          class="nav-item"
          (click)="sidebarOpen = false"
        >
          <span class="icon">💳</span>
          <span class="label">Mis Pagos</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">C</div>
          <div class="user-details">
            <p class="user-name">{{ userName }}</p>
            <p class="user-role">Cliente</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay móvil -->
    <div
      *ngIf="sidebarOpen"
      class="sidebar-overlay"
      (click)="toggleSidebar()"
    ></div>

    <!-- Header -->
    <header class="header">
      <button class="btn-menu" (click)="toggleSidebar()" aria-label="Abrir menú">
        ☰
      </button>
      <h1 class="header-title">Mi Panel</h1>
      <div class="header-actions">
        <button class="btn-user" (click)="showUserMenu = !showUserMenu">
          {{ userName }}
          <span class="dropdown-icon">▼</span>
        </button>

        <!-- Menú usuario -->
        <div *ngIf="showUserMenu" class="user-menu">
          <a href="#" class="user-menu-item">👤 Mi Perfil</a>
          <a href="#" class="user-menu-item">⚙️ Configuración</a>
          <hr />
          <button class="user-menu-item logout-btn" (click)="logout()">
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :host {
      display: flex;
      height: 100vh;
      background: #f5f5f5;
    }

    /* ============ SIDEBAR ============ */
    .sidebar {
      width: 260px;
      height: 100vh;
      background: linear-gradient(135deg, #e53935 0%, #c62828 100%);
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      overflow-y: auto;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .sidebar-header {
      padding: 24px 16px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sidebar-header h2 {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }

    .sidebar-close {
      display: none;
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
    }

    .sidebar-nav {
      flex: 1;
      padding: 16px 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-item.active {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border-left-color: #ff9100;
      font-weight: 600;
    }

    .nav-item .icon {
      font-size: 20px;
      width: 24px;
      text-align: center;
    }

    .nav-item .label {
      flex: 1;
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .user-info {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #ff9100;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
    }

    .user-details {
      flex: 1;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      margin: 0;
    }

    .user-role {
      font-size: 12px;
      opacity: 0.7;
      margin: 0;
    }

    .sidebar-overlay {
      display: none;
    }

    /* ============ HEADER ============ */
    .header {
      position: fixed;
      top: 0;
      left: 260px;
      right: 0;
      height: 64px;
      background: white;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 0 24px;
      z-index: 900;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: left 0.3s ease;
    }

    .btn-menu {
      display: none;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #333;
    }

    .header-title {
      font-size: 22px;
      font-weight: 700;
      color: #e53935;
      margin: 0;
      flex: 1;
    }

    .header-actions {
      position: relative;
    }

    .btn-user {
      background: #f0f0f0;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .btn-user:hover {
      background: #e0e0e0;
    }

    .dropdown-icon {
      font-size: 10px;
    }

    .user-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      min-width: 200px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      margin-top: 8px;
      overflow: hidden;
    }

    .user-menu-item {
      display: block;
      padding: 12px 16px;
      color: #333;
      text-decoration: none;
      transition: background 0.2s ease;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      font-size: 14px;
    }

    .user-menu-item:hover {
      background: #f5f5f5;
    }

    .user-menu hr {
      margin: 4px 0;
      border: none;
      border-top: 1px solid #e0e0e0;
    }

    .logout-btn {
      color: #e53935;
    }

    .logout-btn:hover {
      background: #ffebee;
    }

    /* ============ MAIN CONTENT ============ */
    .main-content {
      margin-left: 260px;
      margin-top: 64px;
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      transition: margin-left 0.3s ease;
    }

    /* ============ RESPONSIVE ============ */
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }

      .sidebar.sidebar-open {
        transform: translateX(0);
      }

      .sidebar-close {
        display: block;
      }

      .sidebar-overlay {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
      }

      .btn-menu {
        display: block;
      }

      .header {
        left: 0;
      }

      .main-content {
        margin-left: 0;
      }
    }

    @media (max-width: 480px) {
      .header-title {
        font-size: 16px;
      }

      .main-content {
        padding: 16px;
      }
    }
  `]
})
export class ClienteLayoutComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  sidebarOpen = false;
  showUserMenu = false;
  userName = 'Cliente';

  ngOnInit(): void {
    this.userName = this.authService.getNombre() || 'Cliente';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}