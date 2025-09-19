import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';
import { ChatMessage, ChatUser, ChatSession, PREDEFINED_QUESTIONS, PredefinedQuestion } from '../models/chat';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { ApiUrls } from '../config';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {
  private socket!: Socket;
  private socketUrl = environment.API_URL.replace('/v1/', '');
  private destroyed$ = new Subject<void>();

  // Observable subjects
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private connectedSubject = new BehaviorSubject<boolean>(false);
  private sessionStatusSubject = new BehaviorSubject<string>('disconnected');
  private adminConnectedSubject = new BehaviorSubject<boolean>(false);
  private currentSessionIdSubject = new BehaviorSubject<string | null>(null);

  public messages$ = this.messagesSubject.asObservable();
  public connected$ = this.connectedSubject.asObservable();
  public sessionStatus$ = this.sessionStatusSubject.asObservable();
  public adminConnected$ = this.adminConnectedSubject.asObservable();
  public currentSessionId$ = this.currentSessionIdSubject.asObservable();

  constructor(
    private storageService: StorageService,
    private http: HttpClient
  ) {
    this.initializeSocket();
  }

  private initializeSocket(): void {
    const token = this.storageService.getSessionToken();

    if (!token) {
      console.warn('No authentication token found for socket connection');
      return;
    }

    this.socket = io(this.socketUrl, {
      auth: {
        token: token
      },
      transports: ['polling']
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.connectedSubject.next(true);
      this.sessionStatusSubject.next('connected');
      // Emit user_join event when connected
      // this.emitUserJoin();
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      this.connectedSubject.next(false);
      this.sessionStatusSubject.next('disconnected');
      this.currentSessionIdSubject.next(null);
    });

    this.socket.on('session_created', (data: any) => {
      this.currentSessionIdSubject.next(data.id);
    });

    this.socket.on('bot_message', (message: ChatMessage) => {
      this.addMessage(message);
    });

    this.socket.on('admin_message', (message: ChatMessage) => {
      this.addMessage(message);
      this.adminConnectedSubject.next(true);
    });

    this.socket.on('admin_connected', (data: { admin: ChatUser, sessionId: string }) => {
      this.adminConnectedSubject.next(true);
      this.sessionStatusSubject.next('admin_connected');
      this.currentSessionIdSubject.next(data.sessionId);
    });

    this.socket.on('admin_disconnected', () => {
      console.log('Admin disconnected');
      this.adminConnectedSubject.next(false);
      this.sessionStatusSubject.next('bot_only');
    });

    this.socket.on('admin_available', (data: any) => {
      // console.log('Admin is now available:', data);
    });

    this.socket.on('user_message', (message: ChatMessage) => {
      this.addMessage(message);
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });
  }

  connectToChat(): void {
    if (!this.socket || !this.socket.connected) {
      this.initializeSocket();
    } else {
      // If already connected, emit user_join event
      this.emitUserJoin();
    }
  }

  public emitUserJoin(): void {
    if (this.socket && this.socket.connected) {
      const currentSessionId = this.currentSessionIdSubject.value;
      const payload = currentSessionId ? { sessionId: currentSessionId } : {};
      this.socket.emit('user_join', payload);
    }
  }

  public emitAdminJoin(): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('admin_join');
    }
  }

  public emitAdminBusy(): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('admin_busy');
    }
  }

  public emitAdminAvailable(): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('admin_available');
    }
  }

  public emitAdminTakeUser(userId: string, sessionId: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('admin_take_user', { userId, sessionId });
    }
  }

  disconnectFromChat(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  sendMessage(content: string): void {
    if (!this.socket || !this.socket.connected) {
      console.warn('Socket not connected');
      return;
    }

    const currentSessionId = this.currentSessionIdSubject.value;
    if (!currentSessionId) {
      console.warn('No active session found');
      return;
    }

    const userMessage: ChatMessage = {
      content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
      sessionId: currentSessionId
    };

    this.addMessage(userMessage);
    this.socket.emit('user_message', {
      message: content,
      sessionId: currentSessionId
    });
  }

  requestAdminConnection(): void {
    if (!this.socket || !this.socket.connected) {
      console.warn('Socket not connected');
      return;
    }

    const currentSessionId = this.currentSessionIdSubject.value;
    const payload = currentSessionId ? { sessionId: currentSessionId } : {};

    this.socket.emit('request_admin', payload);
  }

  private addMessage(message: ChatMessage): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  clearMessages(): void {
    this.messagesSubject.next([]);
  }

  async getPreDefinedQA(): Promise<PredefinedQuestion[]> {
    try {
      const response = await lastValueFrom(this.http.get<PredefinedQuestion[]>(`${ApiUrls.PRE_DEFINED_QA}`));
      return response;
    } catch (error) {
      console.error('Error fetching predefined questions:', error);
      throw error;
    }
  }

  // HTTP Methods for REST API endpoints
  async getChatHistory(): Promise<ChatMessage> {
    try {
      const response = await lastValueFrom(this.http.get<ChatMessage>(ApiUrls.CHAT));
      return response;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }

  async getActiveSession(): Promise<ChatSession | null> {
    try {
      const response = await lastValueFrom(this.http.get<ChatSession>(ApiUrls.CHAT_SESSION));
      return response;
    } catch (error) {
      console.error('Error fetching active session:', error);
      return null;
    }
  }

  async closeSession(sessionId: string): Promise<void> {
    try {
      await lastValueFrom(this.http.delete(`${ApiUrls.CHAT_SESSION}/${sessionId}`));
    } catch (error) {
      console.error('Error closing session:', error);
      throw error;
    }
  }

  async requestAdminConnectionHttp(): Promise<void> {
    try {
      await lastValueFrom(this.http.post(ApiUrls.CHAT_REQUEST_ADMIN, { sessionId: this.currentSessionIdSubject.value }));
      this.requestAdminConnection();
    } catch (error) {
      console.error('Error requesting admin connection:', error);
      throw error;
    }
  }

  // Admin-specific methods
  async getActiveSessions(): Promise<ChatSession[]> {
    try {
      const response = await lastValueFrom(this.http.get<ChatSession[]>(ApiUrls.CHAT_ADMIN_SESSIONS));
      return response;
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      throw error;
    }
  }

  async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      const response = await lastValueFrom(this.http.get<ChatMessage[]>(`${ApiUrls.CHAT_ADMIN_SESSIONS}/${sessionId}`));
      return response;
    } catch (error) {
      console.error('Error fetching session messages:', error);
      throw error;
    }
  }

  sendAdminMessage(content: string, sessionId: string, userId: string): void {
    if (!this.socket || !this.socket.connected) {
      console.warn('Socket not connected');
      return;
    }

    const adminMessage: ChatMessage = {
      content,
      sender: 'admin',
      timestamp: new Date(),
      type: 'text',
      sessionId: sessionId
    };

    this.addMessage(adminMessage);
    this.socket.emit('admin_message', {
      userId: userId, // Include userId
      message: content,
      sessionId: sessionId
    });
  }

  joinSessionAsAdmin(sessionId: string): void {
    if (!this.socket || !this.socket.connected) {
      console.warn('Socket not connected');
      return;
    }

    this.socket.emit('admin_join_session', { sessionId });
  }

  leaveSessionAsAdmin(sessionId: string): void {
    if (!this.socket || !this.socket.connected) {
      console.warn('Socket not connected');
      return;
    }

    this.socket.emit('admin_leave_session', { sessionId });
  }

  async closeSessionAsAdmin(sessionId: string): Promise<void> {
    try {
      await lastValueFrom(this.http.delete(`${ApiUrls.CHAT_ADMIN_SESSIONS}/${sessionId}`));
    } catch (error) {
      console.error('Error closing session as admin:', error);
      throw error;
    }
  }

  // Listen for admin-specific events
  onAdminSessionUpdate(callback: (sessions: ChatSession[]) => void): void {
    this.socket?.on('admin_sessions_update', callback);
  }

  onNewUserSession(callback: (session: ChatSession) => void): void {
    this.socket?.on('new_user_session', callback);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.disconnectFromChat();
  }
}
