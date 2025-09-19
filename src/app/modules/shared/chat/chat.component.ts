import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../service/chat.service';
import { ChatMessage, ChatSession, PREDEFINED_QUESTIONS } from '../../../models/chat';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'app/models/user';
import { UtilService } from 'app/service/util.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  newMessage = '';
  isChatOpen = false;
  isConnected = false;
  adminConnected = false;
  sessionStatus = 'disconnected';
  predefinedQuestions: any[] = [];
  showQuestions = true;
  currentDate = new Date();
  currentLoginUser: any 

  // Admin mode properties
  isAdminMode = false;
  adminSessions: ChatSession[] = [];
  selectedAdminSession: ChatSession | null = null;
  showAdminPanel = false;
  adminLoading = false;
  adminStatus: 'available' | 'busy' = 'available';
  waitingUsers: any[] = [];
  
  // New properties for user handling
  selectedUserId: string | null = null;

  private destroyed$ = new Subject<void>();

  constructor(
    public chatService: ChatService,
    private _utilService: UtilService
  ) { }

  async ngOnInit(): Promise<void> {
    this._utilService.loginChangeObx.subscribe((user) => {
      this.currentLoginUser = user?.role;
      this.getPredefinedQuestion();
      this.checkAdminStatus();
    });

    // Load chat history when component initializes
    await this.loadChatHistory();

    this.chatService.messages$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(messages => {
        this.messages = messages;
        this.scrollToBottom();
      });

    this.chatService.connected$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(connected => {
        this.isConnected = connected;
      });

    this.chatService.adminConnected$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(connected => {
        this.adminConnected = connected;
        if (connected) {
          this.showQuestions = false;
        }
      });

    this.chatService.sessionStatus$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(status => {
        this.sessionStatus = status;
      });

    // Listen for admin session updates
    this.chatService.onAdminSessionUpdate((sessions) => {
      this.adminSessions = sessions;
    });

    this.chatService.onNewUserSession((session) => {
      this.adminSessions = [...this.adminSessions, session];
    });
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  async getPredefinedQuestion() {
    try {
      const questions = await this.chatService.getPreDefinedQA();
      this.predefinedQuestions = questions;
    } catch (error) {
      console.error('Error fetching predefined questions:', error);
    }
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    // this.chatService.emitUserJoin();
    if (this.isChatOpen && !this.isConnected) {
      this.chatService.connectToChat();
    }
    if (this.isChatOpen) {
      this.chatService.emitUserJoin();
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.newMessage.trim());
      this.newMessage = '';
      this.showQuestions = false;
    }
  }

  sendPredefinedQuestion(questionId: string): void {
    const question = this.predefinedQuestions.filter(q => q.id === questionId);
    if(question){
      this.chatService.sendMessage(question[0].question);
    }
    this.showQuestions = false;
  }

  connectToAdmin(): void {
    this.chatService.requestAdminConnection();
    this.showQuestions = false;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  getMessageClass(message: ChatMessage): string {
    switch (message.sender) {
      case 'user':
        return 'user-message';
      case 'bot':
        return 'bot-message';
      case 'admin':
        return 'admin-message';
      default:
        return '';
    }
  }

  formatTime(timestamp: Date): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private async loadChatHistory(): Promise<void> {
    try {
      const result = await this.chatService.getChatHistory();
      const chatHistory: any = result?.messages || [];

      if (chatHistory && chatHistory.length > 0) {
        // Add historical messages to the current messages
        this.messages = [...chatHistory, ...this.messages];
        this.showQuestions = false;
        this.scrollToBottom();
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }

  private async checkActiveSession(): Promise<void> {
    try {
      const activeSession = await this.chatService.getActiveSession();
      if (activeSession) {
        // Handle active session logic
        // You might want to update UI based on active session status
      }
    } catch (error) {
      console.error('Failed to check active session:', error);
    }
  }

  async connectToAdminHttp(): Promise<void> {
    try {
      await this.chatService.requestAdminConnectionHttp();
      this.showQuestions = false;
      // The socket connection will handle the actual admin connection status
    } catch (error) {
      console.error('Failed to request admin connection:', error);
    }
  }

  // Admin mode methods
  private async checkAdminStatus(): Promise<void> {
    const result = await this._utilService.getRoleById(this.currentLoginUser?.id || '');
    this.isAdminMode = result?.role?.toLowerCase() === 'admin';
    if (this.isAdminMode) {
      this.loadAdminSessions();
    }
  }

  async loadAdminSessions(): Promise<void> {
    if (!this.isAdminMode) return;

    this.adminLoading = true;
    try {
      const result: any = await this.chatService.getActiveSessions();
      this.adminSessions = result.items;
    } catch (error) {
      console.error('Failed to load admin sessions:', error);
    } finally {
      this.adminLoading = false;
    }
  }

  toggleAdminPanel(): void {
    this.showAdminPanel = !this.showAdminPanel;
    if (this.showAdminPanel) {
      this.chatService.emitAdminJoin();
      this.loadAdminSessions();
    }
  }

  selectAdminSession(session: ChatSession): void {
    this.selectedAdminSession = session;
    this.chatService.joinSessionAsAdmin(session.id);
    // For admin mode, we need to load the specific session messages
    this.loadSessionMessages(session.id);
  }

  async loadSessionMessages(sessionId: string): Promise<void> {
    try {
      const messages: any = await this.chatService.getSessionMessages(sessionId);
      this.messages = messages.messages;
    } catch (error) {
      console.error('Failed to load session messages:', error);
    }
  }

  sendAdminMessage(): void {
    if (!this.newMessage.trim() || !this.selectedAdminSession) {
      return;
    }

    this.chatService.sendAdminMessage(
      this.newMessage.trim(),
      this.selectedAdminSession.id,
      this.selectedAdminSession.userId._id || this.selectedAdminSession.userId
    );
    this.newMessage = '';
  }

  leaveAdminSession(): void {
    if (this.selectedAdminSession) {
      this.chatService.leaveSessionAsAdmin(this.selectedAdminSession.id);
      this.selectedAdminSession = null;
      this.messages = [];
    }
  }

  async closeAdminSession(): Promise<void> {
    if (!this.selectedAdminSession) {
      return;
    }

    try {
      this.chatService.leaveSessionAsAdmin(this.selectedAdminSession.id);
      await this.chatService.closeSessionAsAdmin(this.selectedAdminSession.id);
      this.selectedAdminSession = null;
      this.messages = [];
      this.loadAdminSessions(); // Refresh session list
      this.loadChatHistory();
    } catch (error) {
      console.error('Error closing session:', error);
    }
  }

  getSessionStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'waiting': return 'status-waiting';
      case 'closed': return 'status-closed';
      case 'bot_only': return 'status-bot';
      default: return 'status-unknown';
    }
  }

  getSessionStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Active';
      case 'waiting': return 'Waiting';
      case 'closed': return 'Closed';
      case 'bot_only': return 'Bot Only';
      default: return 'Unknown';
    }
  }

  // Admin status control methods
  markAdminAsAvailable(): void {
    this.chatService.emitAdminAvailable();
    this.adminStatus = 'available';
  }

  markAdminAsBusy(): void {
    this.chatService.emitAdminBusy();
    this.adminStatus = 'busy';
  }

  takeUserFromQueue(userId: string, sessionId: string): void {
    this.chatService.emitAdminTakeUser(userId, sessionId);
    // Additional logic to handle user taking can be added here
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
