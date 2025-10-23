


import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { AuthService } from '../../services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class LoginComponent {
  private readonly authService = inject(AuthService);

  readonly email = signal('');
  readonly password = signal('');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async handleLogin(event: Event): Promise<void> {
    event.preventDefault(); // This is the critical fix to prevent page reload.

    if (!this.email().trim() || !this.password().trim()) {
      this.error.set('Please enter both email and password.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    // Simulate a small network delay for better UX, as the check is now instant.
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const result = this.authService.signInWithPassword(this.email(), this.password());
      
      if (!result.success) {
          this.error.set(result.error || 'An unknown error occurred.');
      }
      // On successful login, the session signal in the service will be updated,
      // and the app component will automatically switch the view. Nothing more to do here.
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred during login.';
      this.error.set(message);
      console.error('Login Exception:', e);
    } finally {
      this.loading.set(false);
    }
  }
}
