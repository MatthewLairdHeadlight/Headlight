import {
  Provider,
  Patient,
  Message,
  Form,
  FormField,
  FormSubmission,
  PaymentRequest,
} from '@/types';

describe('Type definitions', () => {
  describe('User types', () => {
    it('should allow creating a Provider', () => {
      const provider: Provider = {
        id: 'provider-1',
        email: 'doctor@clinic.com',
        name: 'Dr. Smith',
        role: 'provider',
        specialty: 'Family Medicine',
        organization: 'Test Clinic',
        createdAt: new Date(),
      };

      expect(provider.role).toBe('provider');
      expect(provider.specialty).toBe('Family Medicine');
    });

    it('should allow creating a Patient', () => {
      const patient: Patient = {
        id: 'patient-1',
        email: 'patient@email.com',
        name: 'John Doe',
        role: 'patient',
        providerId: 'provider-1',
        createdAt: new Date(),
      };

      expect(patient.role).toBe('patient');
      expect(patient.providerId).toBe('provider-1');
    });
  });

  describe('Message type', () => {
    it('should allow creating a Message', () => {
      const message: Message = {
        id: 'msg-1',
        senderId: 'provider-1',
        receiverId: 'patient-1',
        content: 'Hello!',
        createdAt: new Date(),
        read: false,
      };

      expect(message.content).toBe('Hello!');
      expect(message.read).toBe(false);
    });

    it('should allow messages with attachments', () => {
      const message: Message = {
        id: 'msg-2',
        senderId: 'patient-1',
        receiverId: 'provider-1',
        content: 'Here is my document',
        createdAt: new Date(),
        read: true,
        attachments: [
          {
            id: 'attach-1',
            name: 'document.pdf',
            url: 'https://example.com/doc.pdf',
            type: 'application/pdf',
          },
        ],
      };

      expect(message.attachments).toHaveLength(1);
      expect(message.attachments![0].name).toBe('document.pdf');
    });
  });

  describe('Form types', () => {
    it('should allow creating a Form with various field types', () => {
      const fields: FormField[] = [
        { id: '1', type: 'text', label: 'Name', required: true },
        { id: '2', type: 'email', label: 'Email', required: true },
        { id: '3', type: 'phone', label: 'Phone', required: false },
        { id: '4', type: 'textarea', label: 'Notes', required: false },
        { id: '5', type: 'date', label: 'Date of Birth', required: true },
        { id: '6', type: 'select', label: 'Gender', required: true, options: ['Male', 'Female', 'Other'] },
        { id: '7', type: 'checkbox', label: 'Agree', required: true },
        { id: '8', type: 'radio', label: 'Preferred Contact', required: true, options: ['Email', 'Phone'] },
      ];

      const form: Form = {
        id: 'form-1',
        providerId: 'provider-1',
        title: 'Patient Intake',
        description: 'New patient intake form',
        fields,
        createdAt: new Date(),
        updatedAt: new Date(),
        isTemplate: true,
      };

      expect(form.fields).toHaveLength(8);
      expect(form.isTemplate).toBe(true);
    });

    it('should allow creating a FormSubmission', () => {
      const submission: FormSubmission = {
        id: 'sub-1',
        formId: 'form-1',
        patientId: 'patient-1',
        providerId: 'provider-1',
        responses: {
          name: 'John Doe',
          email: 'john@example.com',
          agree: true,
        },
        submittedAt: new Date(),
        status: 'submitted',
      };

      expect(submission.status).toBe('submitted');
      expect(submission.responses.name).toBe('John Doe');
    });
  });

  describe('Payment types', () => {
    it('should allow creating a PaymentRequest', () => {
      const payment: PaymentRequest = {
        id: 'pay-1',
        providerId: 'provider-1',
        patientId: 'patient-1',
        amount: 15000, // $150.00 in cents
        currency: 'usd',
        description: 'Office visit co-pay',
        status: 'pending',
        createdAt: new Date(),
      };

      expect(payment.amount).toBe(15000);
      expect(payment.status).toBe('pending');
    });

    it('should allow PaymentRequest with Stripe fields', () => {
      const payment: PaymentRequest = {
        id: 'pay-2',
        providerId: 'provider-1',
        patientId: 'patient-1',
        amount: 5000,
        currency: 'usd',
        description: 'Lab work',
        status: 'completed',
        createdAt: new Date(),
        stripePaymentIntentId: 'pi_123456789',
        stripePaymentMethodId: 'pm_123456789',
        paidAt: new Date(),
        metadata: {
          invoiceNumber: 'INV-001',
        },
      };

      expect(payment.stripePaymentIntentId).toBe('pi_123456789');
      expect(payment.paidAt).toBeInstanceOf(Date);
    });
  });
});
