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
// import { MotorRequestCommentsService, MotorRequestComment, CreateMotorCommentRequest } from '../../services/motors-comments.service';
// import { AuthService } from '../../../../../../auth/services/auth.service';
// import { MotorRequestResponse } from '../../../motors-requests/services/motors-requests.service';

// @Component({
//   selector: 'app-motor-request-comments',
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
//   templateUrl: './all-motors-comments.component.html',
//   styleUrl: './all-motors-comments.component.scss',
//   providers: [MessageService]
// })
// export class AllMotorsCommentsComponent implements OnInit, OnDestroy {
//  private route = inject(ActivatedRoute);
//    private commentsService = inject(MotorRequestCommentsService);
//    private messageService = inject(MessageService);
//    private spinnerService = inject(NgxSpinnerService);
//    private authService = inject(AuthService);
//    comments: MotorRequestComment[] = [];
//    newComment: string = '';
//    selectedFile: File | null = null;
//    loading: boolean = true;
//    sending: boolean = false;
//    currentUserId: number = 1; // Replace with actual user ID from auth service
//    currentUserRole: string = 'admin'; // Replace with actual user role
//    currentUserName: string = 'User'; // Replace with actual user name
//    requestId: number = 0;
//    IMAGE_BASE_URL = IMAGE_BASE_URL;
//    requestData!:MotorRequestResponse;
//  requestStatus:string = '';
//    ngOnInit() {
//      this.requestId = +this.route.snapshot.paramMap.get('id')!;
//      this.loadData();
//  let user=JSON.parse(localStorage.getItem('user')!);
//  console.log(user)
//  this.currentUserId = user.id || 1;
//  this.currentUserRole = user.role || 'admin';
//  this.currentUserName = user.name || 'admin name';
//    }
 
//    loadData() {
//      this.loading = true;
     
//      this.route.data.subscribe({
//        next: (data) => {
//  Object.keys(data['data']).forEach(key => {
//    console.log(key, data['data'][key]);
//  });        this.comments = data['data'].data;
//  this.requestData = data['data'].request;
//  this.comments = data['data'].comments;
//  for (let index = 0; index < this.comments.length; index++) {
//    const element = this.comments[index].comment;
//    console.log(element)
//  }
//  console.log(this.comments)
//          this.loading = false;
//          this.scrollToBottom();
//          this.currentUserId = this.requestData.data.user_id   || 1;
 
//          // // read the user from authentication and send its role and name
//          // this.currentUserRole = this.comments[0].user_role || 'admin';
//          // this.currentUserName = this.comments[0].user_name || 'User';
//          this.requestStatus = this.requestData.data.active_status.toLowerCase() || 'pending';
//          console.log(this.currentUserId, this.currentUserRole, this.currentUserName);
//          this.spinnerService.hide('actionsLoader');
//        },
//        error: () => {
//          this.messageService.add({
//            severity: 'error',
//            summary: 'Error',
//            detail: 'Failed to load comments'
//          });
//          this.loading = false;
//          this.spinnerService.hide('actionsLoader');
//        }
//      });
//      this.spinnerService.hide('actionsLoader');
 
//    }
 
//    onFileSelected(event: any) {
//      const file = event.target.files[0];
//      if (file) {
//        // Validate file size (max 10MB)
//        if (file.size > 10 * 1024 * 1024) {
//          this.messageService.add({
//            severity: 'error',
//            summary: 'Error',
//            detail: 'File size must be less than 10MB'
//          });
//          return;
//        }
       
//        this.selectedFile = file;
//      }
//    }
 
//    removeFile() {
//      this.selectedFile = null;
//    }
 
//    formatFileSize(bytes: number): string {
//      if (bytes === 0) return '0 Bytes';
//      const k = 1024;
//      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//      const i = Math.floor(Math.log(bytes) / Math.log(k));
//      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//    }
 
//    autoResize(event: any) {
//      const textarea = event.target;
//      textarea.style.height = 'auto';
//      textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
//    }
 
//    onEnterPress(event:any) {
//      if (event.key === 'Enter' && !event.shiftKey) {
//        event.preventDefault();
//        this.sendComment();
//      }
//    }
//    getFilePreview(file: File): string {
//      if (file.type.startsWith('image/')) {
//        return URL.createObjectURL(file);
//      }
//      return '';
//    }
//    ngOnDestroy() {
//      if (this.selectedFile && this.selectedFile.type.startsWith('image/')) {
//        URL.revokeObjectURL(this.getFilePreview(this.selectedFile));
//      }
//    }
//    sendComment() {
//      if (!this.newComment.trim() && !this.selectedFile) {
//        this.messageService.add({
//          severity: 'warn',
//          summary: 'Warning',
//          detail: 'Please enter a message or select a file'
//        });
//        return;
//      }
 
//      this.sending = true;
//      // this.spinnerService.show('commentsLoader');
 
//      // update the user id to use the registered user in the dashboard 
 
//      const commentData: CreateMotorCommentRequest = {
//        user_id: this.currentUserId,
//        user_role: this.currentUserRole,
//        user_name: this.currentUserName,
//        comment: this.newComment || 'File attachment',
//        reciver_id: this.requestData.data.user_id,
//        reciver_role: this.requestData.data.user?.role || 'user',
//        reciver_name: this.requestData.data.name || 'Reciver name',
//        request_id: this.requestData.data.id,
//        request_status: this.requestData.data.active_status
//      };
 
//      this.commentsService.create(this.requestId, commentData, this.selectedFile || undefined).subscribe({
//        next: (response) => {
//          this.comments.push(response.data);
//          this.newComment = '';
//          this.selectedFile = null;
//          this.resetTextarea();
//          this.messageService.add({
//            severity: 'success',
//            summary: 'Success',
//            detail: 'Comment sent successfully'
//          });
//          this.sending = false;
//          // this.spinnerService.hide('commentsLoader');
//          this.scrollToBottom();
//        },
//        error: (error) => {
//          this.messageService.add({
//            severity: 'error',
//            summary: 'Error',
//            detail: error.error?.message || 'Failed to send comment'
//          });
//          this.sending = false;
//          // this.spinnerService.hide('commentsLoader');
//        }
//      });
//    }
 
//    private resetTextarea() {
//      setTimeout(() => {
//        const textarea = document.querySelector('textarea');
//        if (textarea) {
//          textarea.style.height = 'auto';
//          textarea.style.height = '44px';
//        }
//      }, 0);
//    }
 
//    formatDate(dateString: string): string {
//      const date = new Date(dateString);
//      const now = new Date();
//      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
 
//      if (diffInHours < 24) {
//        return date.toLocaleString('en-US', {
//          hour: 'numeric',
//          minute: 'numeric',
//          hour12: true
//        });
//      } else if (diffInHours < 48) {
//        return 'Yesterday ' + date.toLocaleString('en-US', {
//          hour: 'numeric',
//          minute: 'numeric',
//          hour12: true
//        });
//      } else {
//        return date.toLocaleString('en-US', {
//          month: 'short',
//          day: 'numeric',
//          hour: 'numeric',
//          minute: 'numeric',
//          hour12: true
//        });
//      }
//    }
 
//    private scrollToBottom(): void {
//      setTimeout(() => {
//        const messagesContainer = document.querySelector('.chat-messages');
//        if (messagesContainer) {
//          messagesContainer.scrollTop = messagesContainer.scrollHeight;
//        }
//      }, 100);
//    }
//    getStatusStyles(status: string): string {
//      switch (status.toLowerCase()) {
//        case 'requested':
//          return 'bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded font-medium'; // Example: Light blue for requested
//        case 'pending':
//          return 'bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded font-medium'; // Yellow for pending
//        case 'confirmed':
//          return 'bg-green-100 text-green-800 px-2.5 py-0.5 rounded font-medium'; // Green for confirmed
//        case 'canceled':
//          return 'bg-red-100 text-red-800 px-2.5 py-0.5 rounded font-medium'; // Red for canceled
//        default:
//          return 'bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded font-medium'; // Default neutral style
//      }
//    }
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
import { MotorRequestCommentsService, MotorRequestComment, CreateMotorCommentRequest } from '../../services/motors-comments.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { MotorRequestResponse } from '../../../motors-requests/services/motors-requests.service';

@Component({
  selector: 'app-motor-request-comments',
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
  templateUrl: './all-motors-comments.component.html',
  styleUrl: './all-motors-comments.component.scss',
  providers: [MessageService]
})
export class AllMotorsCommentsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private commentsService = inject(MotorRequestCommentsService);
  private messageService = inject(MessageService);
  private spinnerService = inject(NgxSpinnerService);
  private authService = inject(AuthService);
  comments: MotorRequestComment[] = [];
  newComment: string = '';
  selectedFile: File | null = null;
  loading: boolean = true;
  sending: boolean = false;
  currentUserId: number = 1; // Replace with actual user ID from auth service
  currentUserRole: string = 'admin'; // Replace with actual user role
  currentUserName: string = 'User'; // Replace with actual user name
  requestId: number = 0;
  IMAGE_BASE_URL = IMAGE_BASE_URL;
  requestData!: MotorRequestResponse;
  requestStatus: string = '';
  private pollingInterval: any; // Added for polling

  ngOnInit() {
    this.requestId = +this.route.snapshot.paramMap.get('id')!;
    this.loadData();
    let user = JSON.parse(localStorage.getItem('user')!);
    console.log(user);
    this.currentUserId = user.id || 1;
    this.currentUserRole = user.role || 'admin';
    this.currentUserName = user.name || 'admin name';
    this.startPolling(); // Start polling
  }

  loadData() {
    this.loading = true;
    
    this.route.data.subscribe({
      next: (data) => {
        Object.keys(data['data']).forEach(key => {
          console.log(key, data['data'][key]);
        });
        this.comments = data['data'].data;
        this.requestData = data['data'].request;
        this.comments = data['data'].comments;
        for (let index = 0; index < this.comments.length; index++) {
          const element = this.comments[index].comment;
          console.log(element);
        }
        console.log(this.comments);
        this.loading = false;
        this.scrollToBottom();
        this.currentUserId = this.requestData.data.user_id || 1;
        this.requestStatus = this.requestData.data.active_status.toLowerCase() || 'pending';
        console.log(this.currentUserId, this.currentUserRole, this.currentUserName);
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
    this.spinnerService.hide('actionsLoader');
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
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
    // this.spinnerService.show('commentsLoader');

    const commentData: CreateMotorCommentRequest = {
      user_id: this.currentUserId,
      user_role: this.currentUserRole,
      user_name: this.currentUserName,
      comment: this.newComment || 'File attachment',
      reciver_id: this.requestData.data.user_id,
      reciver_role: this.requestData.data.user?.role || 'user',
      reciver_name: this.requestData.data.name || 'Reciver name',
      request_id: this.requestData.data.id,
      request_status: this.requestData.data.active_status
    };

    this.commentsService.create(this.requestId, commentData, this.selectedFile || undefined).subscribe({
      next: (response) => {
        this.comments.push(response.data);
        this.newComment = '';
        this.selectedFile = null;
        this.resetTextarea();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Comment sent successfully'
        });
        this.sending = false;
        // this.spinnerService.hide('commentsLoader');
        this.scrollToBottom();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to send comment'
        });
        this.sending = false;
        // this.spinnerService.hide('commentsLoader');
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
      this.commentsService.getAll(this.requestId).subscribe({
        next: (response) => {
          this.comments = response.data; // Silent update
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