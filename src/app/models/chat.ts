import { User } from "./user";

export interface ChatMessage {
  id?: string;
  content: string;
  sender: 'user' | 'bot' | 'admin';
  timestamp: Date;
  type: 'text' | 'question' | 'system';
  userId?: string;
  adminId?: string;
  sessionId?: string;
  messages?: string[];
}

export interface ChatUser {
  id: string;
  name: string;
  email?: string;
  type: 'user' | 'admin';
  isOnline?: boolean;
}

export interface ChatSession {
  id: string;
  userId: any;
  adminId?: string;
  status: 'active' | 'waiting' | 'closed' | 'bot_only';
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
}

export interface PredefinedQuestion {
 id: string;
  question: string;
  answer: string;
  createdBy: User;
  updatedBy: User;
}

export const PREDEFINED_QUESTIONS: PredefinedQuestion[] = [
  // {
  //   id: '1',
  //   question: 'What products do you offer?',
  //   response: 'We offer a wide range of B2B products including industrial equipment, raw materials, and business supplies. You can browse our catalog to see all available products.',
  //   category: 'Products'
  // },
  // {
  //   id: '2',
  //   question: 'How do I place an order?',
  //   response: 'To place an order, simply browse our products, add items to your cart, and proceed to checkout. You\'ll need to have a registered business account.',
  //   category: 'Orders'
  // },
  // {
  //   id: '3',
  //   question: 'What are your payment terms?',
  //   response: 'We offer various payment options including net 30 terms for qualified businesses, credit card, and bank transfers. Contact our sales team for specific payment arrangements.',
  //   category: 'Payment'
  // },
  // {
  //   id: '4',
  //   question: 'Do you offer bulk discounts?',
  //   response: 'Yes! We offer volume discounts for bulk orders. The discount percentage depends on the quantity and product category. Please contact us for specific pricing.',
  //   category: 'Pricing'
  // },
  // {
  //   id: '5',
  //   question: 'How can I track my order?',
  //   response: 'Once your order is shipped, you\'ll receive a tracking number via email. You can also check your order status in your account dashboard.',
  //   category: 'Shipping'
  // },
  // {
  //   id: '6',
  //   question: 'Connect with a real person',
  //   response: 'I\'ll connect you with one of our support representatives. Please wait while we find an available agent.',
  //   category: 'Support'
  // }
];
