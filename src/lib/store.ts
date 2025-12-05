import { v4 as uuidv4 } from 'uuid';
import {
  User,
  Provider,
  Patient,
  Message,
  Conversation,
  Form,
  FormSubmission,
  FormAssignment,
  PaymentRequest,
} from '@/types';

// In-memory data store for development/demo purposes
// In production, this would be replaced with a proper database

class DataStore {
  private users: Map<string, User> = new Map();
  private messages: Map<string, Message> = new Map();
  private conversations: Map<string, Conversation> = new Map();
  private forms: Map<string, Form> = new Map();
  private formSubmissions: Map<string, FormSubmission> = new Map();
  private formAssignments: Map<string, FormAssignment> = new Map();
  private paymentRequests: Map<string, PaymentRequest> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create demo provider
    const provider: Provider = {
      id: 'provider-1',
      email: 'dr.smith@clinic.com',
      name: 'Dr. Sarah Smith',
      role: 'provider',
      specialty: 'Family Medicine',
      organization: 'Headlight Health Clinic',
      createdAt: new Date('2024-01-01'),
    };
    this.users.set(provider.id, provider);

    // Create demo patients
    const patient1: Patient = {
      id: 'patient-1',
      email: 'john.doe@email.com',
      name: 'John Doe',
      role: 'patient',
      providerId: provider.id,
      createdAt: new Date('2024-01-15'),
    };
    this.users.set(patient1.id, patient1);

    const patient2: Patient = {
      id: 'patient-2',
      email: 'jane.doe@email.com',
      name: 'Jane Doe',
      role: 'patient',
      providerId: provider.id,
      createdAt: new Date('2024-02-01'),
    };
    this.users.set(patient2.id, patient2);

    // Create demo conversation
    const conversation: Conversation = {
      id: 'conv-1',
      participants: [provider.id, patient1.id],
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
    };
    this.conversations.set(conversation.id, conversation);

    // Create demo messages
    const message1: Message = {
      id: 'msg-1',
      senderId: provider.id,
      receiverId: patient1.id,
      content: 'Hello John, how are you feeling today?',
      createdAt: new Date('2024-02-10T10:00:00'),
      read: true,
    };
    this.messages.set(message1.id, message1);

    const message2: Message = {
      id: 'msg-2',
      senderId: patient1.id,
      receiverId: provider.id,
      content: 'Much better, thank you Dr. Smith!',
      createdAt: new Date('2024-02-10T10:30:00'),
      read: true,
    };
    this.messages.set(message2.id, message2);

    // Create demo form
    const intakeForm: Form = {
      id: 'form-1',
      providerId: provider.id,
      title: 'New Patient Intake Form',
      description: 'Please complete this form before your first appointment',
      fields: [
        {
          id: 'field-1',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
        },
        {
          id: 'field-2',
          type: 'date',
          label: 'Date of Birth',
          required: true,
        },
        {
          id: 'field-3',
          type: 'phone',
          label: 'Phone Number',
          placeholder: '(555) 555-5555',
          required: true,
        },
        {
          id: 'field-4',
          type: 'textarea',
          label: 'Medical History',
          placeholder: 'Please describe any relevant medical history',
          required: false,
        },
        {
          id: 'field-5',
          type: 'checkbox',
          label: 'Do you have any allergies?',
          required: true,
        },
      ],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      isTemplate: true,
    };
    this.forms.set(intakeForm.id, intakeForm);
  }

  // User operations
  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  getPatientsByProvider(providerId: string): Patient[] {
    const patients: Patient[] = [];
    for (const user of this.users.values()) {
      if (user.role === 'patient' && (user as Patient).providerId === providerId) {
        patients.push(user as Patient);
      }
    }
    return patients;
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: uuidv4(),
      createdAt: new Date(),
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  // Message operations
  getMessage(id: string): Message | undefined {
    return this.messages.get(id);
  }

  getMessagesByConversation(conversationId: string): Message[] {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return [];

    const messages: Message[] = [];
    for (const message of this.messages.values()) {
      if (
        conversation.participants.includes(message.senderId) &&
        conversation.participants.includes(message.receiverId)
      ) {
        messages.push(message);
      }
    }
    return messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  getMessagesBetweenUsers(userId1: string, userId2: string): Message[] {
    const messages: Message[] = [];
    for (const message of this.messages.values()) {
      if (
        (message.senderId === userId1 && message.receiverId === userId2) ||
        (message.senderId === userId2 && message.receiverId === userId1)
      ) {
        messages.push(message);
      }
    }
    return messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  createMessage(message: Omit<Message, 'id' | 'createdAt' | 'read'>): Message {
    const newMessage: Message = {
      ...message,
      id: uuidv4(),
      createdAt: new Date(),
      read: false,
    };
    this.messages.set(newMessage.id, newMessage);
    return newMessage;
  }

  markMessageAsRead(id: string): Message | undefined {
    const message = this.messages.get(id);
    if (message) {
      message.read = true;
      this.messages.set(id, message);
    }
    return message;
  }

  // Conversation operations
  getConversation(id: string): Conversation | undefined {
    return this.conversations.get(id);
  }

  getConversationsByUser(userId: string): Conversation[] {
    const conversations: Conversation[] = [];
    for (const conv of this.conversations.values()) {
      if (conv.participants.includes(userId)) {
        conversations.push(conv);
      }
    }
    return conversations;
  }

  getOrCreateConversation(participant1: string, participant2: string): Conversation {
    // Check if conversation already exists
    for (const conv of this.conversations.values()) {
      if (
        conv.participants.includes(participant1) &&
        conv.participants.includes(participant2)
      ) {
        return conv;
      }
    }

    // Create new conversation
    const newConversation: Conversation = {
      id: uuidv4(),
      participants: [participant1, participant2],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.set(newConversation.id, newConversation);
    return newConversation;
  }

  // Form operations
  getForm(id: string): Form | undefined {
    return this.forms.get(id);
  }

  getFormsByProvider(providerId: string): Form[] {
    const forms: Form[] = [];
    for (const form of this.forms.values()) {
      if (form.providerId === providerId) {
        forms.push(form);
      }
    }
    return forms;
  }

  createForm(form: Omit<Form, 'id' | 'createdAt' | 'updatedAt'>): Form {
    const newForm: Form = {
      ...form,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.forms.set(newForm.id, newForm);
    return newForm;
  }

  updateForm(id: string, updates: Partial<Omit<Form, 'id' | 'createdAt'>>): Form | undefined {
    const form = this.forms.get(id);
    if (form) {
      const updatedForm: Form = {
        ...form,
        ...updates,
        updatedAt: new Date(),
      };
      this.forms.set(id, updatedForm);
      return updatedForm;
    }
    return undefined;
  }

  // Form Assignment operations
  getFormAssignment(id: string): FormAssignment | undefined {
    return this.formAssignments.get(id);
  }

  getFormAssignmentsByPatient(patientId: string): FormAssignment[] {
    const assignments: FormAssignment[] = [];
    for (const assignment of this.formAssignments.values()) {
      if (assignment.patientId === patientId) {
        assignments.push(assignment);
      }
    }
    return assignments;
  }

  getFormAssignmentsByProvider(providerId: string): FormAssignment[] {
    const assignments: FormAssignment[] = [];
    for (const assignment of this.formAssignments.values()) {
      if (assignment.providerId === providerId) {
        assignments.push(assignment);
      }
    }
    return assignments;
  }

  createFormAssignment(
    assignment: Omit<FormAssignment, 'id' | 'assignedAt' | 'status'>
  ): FormAssignment {
    const newAssignment: FormAssignment = {
      ...assignment,
      id: uuidv4(),
      assignedAt: new Date(),
      status: 'pending',
    };
    this.formAssignments.set(newAssignment.id, newAssignment);
    return newAssignment;
  }

  updateFormAssignment(
    id: string,
    updates: Partial<Omit<FormAssignment, 'id' | 'assignedAt'>>
  ): FormAssignment | undefined {
    const assignment = this.formAssignments.get(id);
    if (assignment) {
      const updatedAssignment: FormAssignment = {
        ...assignment,
        ...updates,
      };
      this.formAssignments.set(id, updatedAssignment);
      return updatedAssignment;
    }
    return undefined;
  }

  // Form Submission operations
  getFormSubmission(id: string): FormSubmission | undefined {
    return this.formSubmissions.get(id);
  }

  getFormSubmissionsByPatient(patientId: string): FormSubmission[] {
    const submissions: FormSubmission[] = [];
    for (const submission of this.formSubmissions.values()) {
      if (submission.patientId === patientId) {
        submissions.push(submission);
      }
    }
    return submissions;
  }

  createFormSubmission(
    submission: Omit<FormSubmission, 'id' | 'submittedAt' | 'status'>
  ): FormSubmission {
    const newSubmission: FormSubmission = {
      ...submission,
      id: uuidv4(),
      submittedAt: new Date(),
      status: 'submitted',
    };
    this.formSubmissions.set(newSubmission.id, newSubmission);
    return newSubmission;
  }

  // Payment Request operations
  getPaymentRequest(id: string): PaymentRequest | undefined {
    return this.paymentRequests.get(id);
  }

  getPaymentRequestsByPatient(patientId: string): PaymentRequest[] {
    const requests: PaymentRequest[] = [];
    for (const request of this.paymentRequests.values()) {
      if (request.patientId === patientId) {
        requests.push(request);
      }
    }
    return requests;
  }

  getPaymentRequestsByProvider(providerId: string): PaymentRequest[] {
    const requests: PaymentRequest[] = [];
    for (const request of this.paymentRequests.values()) {
      if (request.providerId === providerId) {
        requests.push(request);
      }
    }
    return requests;
  }

  createPaymentRequest(
    request: Omit<PaymentRequest, 'id' | 'createdAt' | 'status'>
  ): PaymentRequest {
    const newRequest: PaymentRequest = {
      ...request,
      id: uuidv4(),
      createdAt: new Date(),
      status: 'pending',
    };
    this.paymentRequests.set(newRequest.id, newRequest);
    return newRequest;
  }

  updatePaymentRequest(
    id: string,
    updates: Partial<Omit<PaymentRequest, 'id' | 'createdAt'>>
  ): PaymentRequest | undefined {
    const request = this.paymentRequests.get(id);
    if (request) {
      const updatedRequest: PaymentRequest = {
        ...request,
        ...updates,
      };
      this.paymentRequests.set(id, updatedRequest);
      return updatedRequest;
    }
    return undefined;
  }
}

// Export singleton instance
export const dataStore = new DataStore();
