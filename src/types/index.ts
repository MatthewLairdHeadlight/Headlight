// User types
export type UserRole = 'provider' | 'patient';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface Provider extends User {
  role: 'provider';
  specialty?: string;
  organization?: string;
}

export interface Patient extends User {
  role: 'patient';
  providerId: string;
}

// Message types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
}

// Conversation thread
export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
}

// Form types
export type FormFieldType = 'text' | 'textarea' | 'email' | 'phone' | 'select' | 'checkbox' | 'radio' | 'date' | 'number';

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, checkbox, radio
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface Form {
  id: string;
  providerId: string;
  title: string;
  description?: string;
  fields: FormField[];
  createdAt: Date;
  updatedAt: Date;
  isTemplate: boolean;
}

export interface FormSubmission {
  id: string;
  formId: string;
  patientId: string;
  providerId: string;
  responses: Record<string, string | string[] | boolean>;
  submittedAt: Date;
  status: 'pending' | 'submitted' | 'reviewed';
}

export interface FormAssignment {
  id: string;
  formId: string;
  patientId: string;
  providerId: string;
  assignedAt: Date;
  dueDate?: Date;
  status: 'pending' | 'completed' | 'overdue';
  submissionId?: string;
}

// Payment types - uses third-party secure payment processor (Stripe)
export interface PaymentRequest {
  id: string;
  providerId: string;
  patientId: string;
  amount: number; // in cents
  currency: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  createdAt: Date;
  stripePaymentIntentId?: string;
  stripePaymentMethodId?: string;
  paidAt?: Date;
  metadata?: Record<string, string>;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
