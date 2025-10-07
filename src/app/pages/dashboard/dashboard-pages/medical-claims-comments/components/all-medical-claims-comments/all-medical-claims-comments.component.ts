// import { Component, inject, OnInit, OnDestroy } from '@angular/core';
// import { ActivatedRoute, RouterLink } from '@angular/router';
// import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
// import { MessageService } from 'primeng/api';
// import { ToastModule } from 'primeng/toast';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { LoadingDataBannerComponent } from '../../../../../../shared/components/loading-data-banner/loading-data-banner.component';
// import { NoDataFoundBannerComponent } from '../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component';
// import { IMAGE_BASE_URL } from '../../../../../../core/constants/WEB_SITE_BASE_UTL';
// import { AuthService } from '../../../../../../auth/services/auth.service';
// import { MedicalClaimsService, ClaimComment, MedicalClaimResponse, CreateCommentRequest } from '../../../../../../core/services/claims/medical-claim.service';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-medical-claim-comments',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     RouterLink,
//     ToastModule,
//     NgxSpinnerModule,
//     LoadingDataBannerComponent,
//     NoDataFoundBannerComponent
//   ],
//   templateUrl: './all-medical-claims-comments.component.html',
//   styleUrl: './all-medical-claims-comments.component.scss',
//   providers: [MessageService]
// })
// export class AllMedicalClaimsCommentsComponent implements OnInit, OnDestroy {
//   private route = inject(ActivatedRoute);
//   private claimsService = inject(MedicalClaimsService);
//   private messageService = inject(MessageService);
//   private spinnerService = inject(NgxSpinnerService);
//   private authService = inject(AuthService);
//   private routeSub: Subscription | null = null;
//   comments: ClaimComment[] = [];
//   newComment: string = '';
//   selectedFile: File | null = null;
//   loading: boolean = true;
//   sending: boolean = false;
//   currentUserId: number = 1;
//   currentUserRole: string = 'admin';
//   currentUserName: string = 'Admin User';
//   claimId: number = 0;
//   IMAGE_BASE_URL = IMAGE_BASE_URL;
//   claimData!: MedicalClaimResponse;
//   claimStatus: string = '';

//   ngOnInit() {
//     this.claimId = +this.route.snapshot.paramMap.get('id')!;
//     this.loadUserData();
//     this.loadData();
//   }

//   loadUserData() {
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
//     this.currentUserId = user.id || 1;
//     this.currentUserRole = user.role || 'user';
//     this.currentUserName = user.name || 'User Name';
//   }
// loadData() {
//   this.loading = true;
//   this.routeSub = this.route.data.subscribe({
//     next: ({ data }) => {
//       console.log(data);
//       this.claimData = data.claim;
//       this.comments = (data.comments || []).reverse(); // Reverse comments array
//       this.claimStatus = this.claimData.data.status.toLowerCase() || 'pending';
//       let user = JSON.parse(localStorage.getItem('user')!);
//       console.log(user);
//       this.currentUserId = user.id || 1;
//       this.currentUserRole = user.role || 'user';
//       this.currentUserName = user.name || 'user name';
//       this.loading = false;
//       this.scrollToBottom();
//       this.spinnerService.hide('actionsLoader');
//     },
//     error: () => {
//       this.messageService.add({
//         severity: 'error',
//         summary: 'Error',
//         detail: 'Failed to load comments'
//       });
//       this.loading = false;
//       this.spinnerService.hide('actionsLoader');
//     }
//   });
// }

//   onFileSelected(event: any) {
//     const file = event.target.files[0];
//     if (file) {
//       if (file.size > 10 * 1024 * 1024) {
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'File size must be less than 10MB'
//         });
//         return;
//       }
//       this.selectedFile = file;
//     }
//   }

//   removeFile() {
//     this.selectedFile = null;
//   }

//   formatFileSize(bytes: number): string {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   }

//   autoResize(event: any) {
//     const textarea = event.target;
//     textarea.style.height = 'auto';
//     textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
//   }

//   onEnterPress(event: any) {
//     if (event.key === 'Enter' && !event.shiftKey) {
//       event.preventDefault();
//       this.sendComment();
//     }
//   }

//   getFilePreview(file: File): string {
//     if (file.type.startsWith('image/')) {
//       return URL.createObjectURL(file);
//     }
//     return '';
//   }

//   ngOnDestroy() {
//     if (this.selectedFile && this.selectedFile.type.startsWith('image/')) {
//       URL.revokeObjectURL(this.getFilePreview(this.selectedFile));
//     }
//     if (this.routeSub) {
//       this.routeSub.unsubscribe();
//     }
//   }

// sendComment() {
//   if (!this.newComment.trim() && !this.selectedFile) {
//     this.messageService.add({
//       severity: 'warn',
//       summary: 'Warning',
//       detail: 'Please enter a message or select a file'
//     });
//     return;
//   }

//   this.sending = true;
//   const commentData: CreateCommentRequest = {
//     user_id: this.currentUserId,
//     user_role: this.currentUserRole,
//     user_name: this.currentUserName,
//     comment: this.newComment || 'File attachment',
//     reciver_id: this.claimData.data.user_id,
//     reciver_role: this.claimData.data.user?.role || 'user',
//     reciver_name: this.claimData.data.user?.name || 'Receiver Name',
//     claim_id: this.claimData.data.id,
//     claim_number: this.claimData.data.claim_number,
//     claim_status: this.claimData.data.status
//   };

//   this.claimsService.createComment(this.claimId, commentData, this.selectedFile).subscribe({
//     next: (response) => {
//       this.comments.push(response.data); // Add new comment to the end
//       this.newComment = '';
//       this.selectedFile = null;
//       this.resetTextarea();
//       this.messageService.add({
//         severity: 'success',
//         summary: 'Success',
//         detail: 'Comment sent successfully'
//       });
//       this.sending = false;
//       this.scrollToBottom();
//     },
//     error: (error) => {
//       this.messageService.add({
//         severity: 'error',
//         summary: 'Error',
//         detail: error.error?.message || 'Failed to send comment'
//       });
//       this.sending = false;
//     }
//   });
// }

//   private resetTextarea() {
//     setTimeout(() => {
//       const textarea = document.querySelector('textarea');
//       if (textarea) {
//         textarea.style.height = 'auto';
//         textarea.style.height = '44px';
//       }
//     }, 0);
//   }

//   formatDate(dateString: string): string {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

//     if (diffInHours < 24) {
//       return date.toLocaleString('en-US', {
//         hour: 'numeric',
//         minute: 'numeric',
//         hour12: true
//       });
//     } else if (diffInHours < 48) {
//       return 'Yesterday ' + date.toLocaleString('en-US', {
//         hour: 'numeric',
//         minute: 'numeric',
//         hour12: true
//       });
//     } else {
//       return date.toLocaleString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         hour: 'numeric',
//         minute: 'numeric',
//         hour12: true
//       });
//     }
//   }

//   private scrollToBottom(): void {
//     setTimeout(() => {
//       const messagesContainer = document.querySelector('.chat-messages');
//       if (messagesContainer) {
//         messagesContainer.scrollTop = messagesContainer.scrollHeight;
//       }
//     }, 100);
//   }

//   getStatusStyles(status: string): string {
//     switch (status.toLowerCase()) {
//       case 'requested':
//         return 'bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded font-medium';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded font-medium';
//       case 'confirmed':
//         return 'bg-green-100 text-green-800 px-2.5 py-0.5 rounded font-medium';
//       case 'canceled':
//         return 'bg-red-100 text-red-800 px-2.5 py-0.5 rounded font-medium';
//       default:
//         return 'bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded font-medium';
//     }
//   }
// }

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingDataBannerComponent } from '../../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component';
import { IMAGE_BASE_URL } from '../../../../../../core/constants/WEB_SITE_BASE_UTL';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { MedicalClaimsService, ClaimComment, MedicalClaimResponse, CreateCommentRequest } from '../../../../../../core/services/claims/medical-claim.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-medical-claim-comments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ToastModule,
    NgxSpinnerModule,
    LoadingDataBannerComponent,
    NoDataFoundBannerComponent
  ],
  templateUrl: './all-medical-claims-comments.component.html',
  styleUrl: './all-medical-claims-comments.component.scss',
  providers: [MessageService]
})
export class AllMedicalClaimsCommentsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private claimsService = inject(MedicalClaimsService);
  private messageService = inject(MessageService);
  private spinnerService = inject(NgxSpinnerService);
  private authService = inject(AuthService);
  private routeSub: Subscription | null = null;
  comments: ClaimComment[] = [];
  newComment: string = '';
  selectedFile: File | null = null;
  loading: boolean = true;
  sending: boolean = false;
  currentUserId: number = 1;
  currentUserRole: string = 'admin';
  currentUserName: string = 'Admin User';
  claimId: number = 0;
  IMAGE_BASE_URL = IMAGE_BASE_URL;
  claimData!: MedicalClaimResponse;
  claimStatus: string = '';
  private pollingInterval: any; // Added for polling

  ngOnInit() {
    this.claimId = +this.route.snapshot.paramMap.get('id')!;
    this.loadUserData();
    this.loadData();
    this.startPolling(); // Start polling
  }

  loadUserData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUserId = user.id || 1;
    this.currentUserRole = user.role || 'user';
    this.currentUserName = user.name || 'User Name';
  }

  loadData() {
    this.loading = true;
    this.routeSub = this.route.data.subscribe({
      next: ({ data }) => {
        console.log(data);
        this.claimData = data.claim;
        this.comments = (data.comments || []).reverse(); // Reverse comments array
        this.claimStatus = this.claimData.data.status.toLowerCase() || 'pending';
        let user = JSON.parse(localStorage.getItem('user')!);
        console.log(user);
        this.currentUserId = user.id || 1;
        this.currentUserRole = user.role || 'user';
        this.currentUserName = user.name || 'user name';
        this.loading = false;
        this.scrollToBottom();
        this.spinnerService.hide('actionsLoader');
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load comments'
        });
        this.loading = false;
        this.spinnerService.hide('actionsLoader');
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'File size must be less than 10MB'
        });
        return;
      }
      this.selectedFile = file;
    }
  }

  removeFile() {
    this.selectedFile = null;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  autoResize(event: any) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
  }

  onEnterPress(event: any) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendComment();
    }
  }

  getFilePreview(file: File): string {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return '';
  }

  ngOnDestroy() {
    this.stopPolling(); // Clean up polling
    if (this.selectedFile && this.selectedFile.type.startsWith('image/')) {
      URL.revokeObjectURL(this.getFilePreview(this.selectedFile));
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  sendComment() {
    if (!this.newComment.trim() && !this.selectedFile) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter a message or select a file'
      });
      return;
    }

    this.sending = true;
    const commentData: CreateCommentRequest = {
      user_id: this.currentUserId,
      user_role: this.currentUserRole,
      user_name: this.currentUserName,
      comment: this.newComment || 'File attachment',
      reciver_id: this.claimData.data.user_id,
      reciver_role: this.claimData.data.user?.role || 'user',
      reciver_name: this.claimData.data.user?.name || 'Receiver Name',
      claim_id: this.claimData.data.id,
      claim_number: this.claimData.data.claim_number,
      claim_status: this.claimData.data.status
    };

    this.claimsService.createComment(this.claimId, commentData, this.selectedFile).subscribe({
      next: (response) => {
        this.comments.push(response.data); // Add new comment to the end
        this.newComment = '';
        this.selectedFile = null;
        this.resetTextarea();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Comment sent successfully'
        });
        this.sending = false;
        this.scrollToBottom();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to send comment'
        });
        this.sending = false;
      }
    });
  }

  private resetTextarea() {
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = '44px';
      }
    }, 0);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } else if (diffInHours < 48) {
      return 'Yesterday ' + date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } else {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const messagesContainer = document.querySelector('.chat-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  }

  getStatusStyles(status: string): string {
    switch (status.toLowerCase()) {
      case 'requested':
        return 'bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded font-medium';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded font-medium';
      case 'confirmed':
        return 'bg-green-100 text-green-800 px-2.5 py-0.5 rounded font-medium';
      case 'canceled':
        return 'bg-red-100 text-red-800 px-2.5 py-0.5 rounded font-medium';
      default:
        return 'bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded font-medium';
    }
  }

  // Added polling methods
  private startPolling() {
    this.pollingInterval = setInterval(() => {
      this.claimsService.getClaimComments(this.claimId).subscribe({
        next: (response) => {
          this.comments = (response.data || []).reverse(); // Silent update, maintaining reverse order
          this.scrollToBottom();
        },
        error: (error) => {
          console.error('Error fetching comments:', error); // Silent error handling
        }
      });
    }, 30000); // 30 seconds
  }

  private stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }
}