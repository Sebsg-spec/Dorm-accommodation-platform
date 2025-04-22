import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { UserService, UserDto, UpdateRoleDto } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  users: UserDto[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  userRole: number | null = null;
  
  selectedRoles: { [key: number]: number } = {};
  originalRoles: { [key: number]: number } = {};
  successfulUpdates: { [key: number]: boolean } = {};
  
  processingApplications: boolean = false;
  processingSuccess: boolean = false;
  
  roles = [
    { id: 1, name: 'Neverificat' },
    { id: 2, name: 'Student' },
    { id: 3, name: 'Secretar' },
    { id: 4, name: 'Admin' }
  ];

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.userRole = parseInt(this.profileService.getUserProp("role") ?? "0");
    
    if ( this.userRole !== 3 && this.userRole !== 4) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.loadUsers();
  }
  
  processApplications(): void {
    this.processingApplications = true;
    this.processingSuccess = false;
    
    this.userService.processApplications().subscribe({
      next: () => {
        this.processingApplications = false;
        this.processingSuccess = true;

        setTimeout(() => {
          this.processingSuccess = false;
        }, 3000);
      },
      error: (error) => {
        this.processingApplications = false;
        this.processingSuccess = false;
        this.errorMessage = 'A apărut o eroare la procesarea dosarelor.';
        console.error(error);
      }
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
        
        this.users.forEach(user => {
          this.selectedRoles[user.id] = user.role;
          this.originalRoles[user.id] = user.role;
          this.successfulUpdates[user.id] = false;
        });
      },
      error: (error) => {
        this.errorMessage = 'Error loading users.';
        console.error(error);
        this.loading = false;
      }
    });
  }
  
  isRoleChanged(userId: number): boolean {
    return this.selectedRoles[userId] != this.originalRoles[userId];
  }
  
  isAdmin(role: number): boolean {
    return role == 4;
  }
  
  updateUserRole(userId: number): void {
    if (!this.isRoleChanged(userId)) return;
    
    const newRole = this.selectedRoles[userId];
    const data: UpdateRoleDto = {
      id: userId,
      role: newRole
    };

    this.userService.updateUserRole(data).subscribe({
      next: () => {
        // Update the original role after successful update
        this.originalRoles[userId] = newRole;
        this.errorMessage = '';
        
        // Set success feedback
        this.successfulUpdates[userId] = true;
        
        // Hide success indicator after 3 seconds
        setTimeout(() => {
          this.successfulUpdates[userId] = false;
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = 'A apărut o eroare la actualizarea rolului.';
        console.error(error);
        // Reset to original value on error
        this.selectedRoles[userId] = this.originalRoles[userId];
      }
    });
  }
  
  onRoleChange(userId: number, newRole: number): void {
    this.selectedRoles[userId] = newRole;
    // Reset success indicator when changing role again
    this.successfulUpdates[userId] = false;
  }
}
