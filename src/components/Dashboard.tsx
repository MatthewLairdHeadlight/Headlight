'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MessageList } from '@/components/messaging/MessageList';
import { ConversationList } from '@/components/messaging/ConversationList';
import { FormBuilder } from '@/components/forms/FormBuilder';
import { FormRenderer } from '@/components/forms/FormRenderer';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { CreatePaymentRequest } from '@/components/payments/CreatePaymentRequest';
import { PaymentList } from '@/components/payments/PaymentList';
import {
  User,
  Patient,
  Message,
  Conversation,
  Form,
  FormField,
  FormAssignment,
  PaymentRequest,
} from '@/types';
import { v4 as uuidv4 } from 'uuid';

type Tab = 'messages' | 'forms' | 'payments' | 'patients';

// Demo data for the application
const demoPatients: Patient[] = [
  {
    id: 'patient-1',
    email: 'john.doe@email.com',
    name: 'John Doe',
    role: 'patient',
    providerId: 'provider-1',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'patient-2',
    email: 'jane.doe@email.com',
    name: 'Jane Doe',
    role: 'patient',
    providerId: 'provider-1',
    createdAt: new Date('2024-02-01'),
  },
];

const demoProvider: User = {
  id: 'provider-1',
  email: 'dr.smith@clinic.com',
  name: 'Dr. Sarah Smith',
  role: 'provider',
  createdAt: new Date('2024-01-01'),
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('messages');
  
  // Messaging state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      senderId: 'provider-1',
      receiverId: 'patient-1',
      content: 'Hello John, how are you feeling today?',
      createdAt: new Date('2024-02-10T10:00:00'),
      read: true,
    },
    {
      id: 'msg-2',
      senderId: 'patient-1',
      receiverId: 'provider-1',
      content: 'Much better, thank you Dr. Smith! The medication is really helping.',
      createdAt: new Date('2024-02-10T10:30:00'),
      read: true,
    },
  ]);
  const [conversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      participants: ['provider-1', 'patient-1'],
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
    },
  ]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>('conv-1');
  
  // Forms state
  const [forms, setForms] = useState<Form[]>([
    {
      id: 'form-1',
      providerId: 'provider-1',
      title: 'New Patient Intake Form',
      description: 'Please complete this form before your first appointment',
      fields: [
        { id: 'f1', type: 'text', label: 'Full Name', placeholder: 'Enter your full name', required: true },
        { id: 'f2', type: 'date', label: 'Date of Birth', required: true },
        { id: 'f3', type: 'phone', label: 'Phone Number', placeholder: '(555) 555-5555', required: true },
        { id: 'f4', type: 'textarea', label: 'Medical History', placeholder: 'Please describe any relevant medical history', required: false },
        { id: 'f5', type: 'checkbox', label: 'I agree to the terms and conditions', required: true },
      ],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      isTemplate: true,
    },
  ]);
  const [formAssignments, setFormAssignments] = useState<FormAssignment[]>([
    {
      id: 'assignment-1',
      formId: 'form-1',
      patientId: 'patient-1',
      providerId: 'provider-1',
      assignedAt: new Date('2024-02-15'),
      status: 'pending',
    },
  ]);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string | string[] | boolean>>({});
  
  // Payments state
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([
    {
      id: 'payment-1',
      providerId: 'provider-1',
      patientId: 'patient-1',
      amount: 15000, // $150.00
      currency: 'usd',
      description: 'Office Visit Co-pay',
      status: 'pending',
      createdAt: new Date('2024-02-12'),
    },
  ]);
  const [showPaymentForm, setShowPaymentForm] = useState<string | null>(null);
  const [showCreatePayment, setShowCreatePayment] = useState<string | null>(null);
  
  // Selected patient for provider view
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  if (!user) return null;

  const isProvider = user.role === 'provider';

  // Get users map for lookups
  const usersMap = new Map<string, User>();
  usersMap.set(demoProvider.id, demoProvider);
  demoPatients.forEach(p => usersMap.set(p.id, p));

  // Get current user's conversations with extra info
  const conversationData = conversations
    .filter(c => c.participants.includes(user.id))
    .map(conversation => {
      const otherUserId = conversation.participants.find(id => id !== user.id) || '';
      const otherUser = usersMap.get(otherUserId) || { 
        id: otherUserId, 
        name: 'Unknown', 
        email: '', 
        role: 'patient' as const, 
        createdAt: new Date() 
      };
      
      const conversationMessages = messages.filter(
        m => conversation.participants.includes(m.senderId) && 
             conversation.participants.includes(m.receiverId)
      );
      
      const lastMsg = conversationMessages[conversationMessages.length - 1];
      
      return {
        conversation,
        otherUser,
        lastMessage: lastMsg ? {
          content: lastMsg.content,
          createdAt: lastMsg.createdAt,
          isFromCurrentUser: lastMsg.senderId === user.id,
        } : undefined,
        unreadCount: conversationMessages.filter(m => m.receiverId === user.id && !m.read).length,
      };
    });

  // Get selected conversation
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const otherUserId = selectedConversation?.participants.find(id => id !== user.id);
  const otherUser = otherUserId ? usersMap.get(otherUserId) : undefined;
  const conversationMessages = selectedConversation 
    ? messages.filter(
        m => selectedConversation.participants.includes(m.senderId) && 
             selectedConversation.participants.includes(m.receiverId)
      )
    : [];

  // Handle sending message
  const handleSendMessage = (content: string) => {
    if (!selectedConversation || !otherUserId) return;
    
    const newMessage: Message = {
      id: uuidv4(),
      senderId: user.id,
      receiverId: otherUserId,
      content,
      createdAt: new Date(),
      read: false,
    };
    setMessages([...messages, newMessage]);
  };

  // Handle form save
  const handleSaveForm = (title: string, description: string, fields: FormField[]) => {
    const newForm: Form = {
      id: uuidv4(),
      providerId: user.id,
      title,
      description,
      fields,
      createdAt: new Date(),
      updatedAt: new Date(),
      isTemplate: true,
    };
    setForms([...forms, newForm]);
    setShowFormBuilder(false);
  };

  // Handle form assignment
  const handleAssignForm = (formId: string, patientId: string) => {
    const newAssignment: FormAssignment = {
      id: uuidv4(),
      formId,
      patientId,
      providerId: user.id,
      assignedAt: new Date(),
      status: 'pending',
    };
    setFormAssignments([...formAssignments, newAssignment]);
  };

  // Handle form submission
  const handleSubmitForm = (assignmentId: string) => {
    setFormAssignments(
      formAssignments.map(a => 
        a.id === assignmentId ? { ...a, status: 'completed' as const } : a
      )
    );
    setSelectedFormId(null);
    setFormValues({});
  };

  // Handle payment creation
  const handleCreatePayment = (patientId: string, amount: number, description: string) => {
    const newPayment: PaymentRequest = {
      id: uuidv4(),
      providerId: user.id,
      patientId,
      amount,
      currency: 'usd',
      description,
      status: 'pending',
      createdAt: new Date(),
    };
    setPaymentRequests([...paymentRequests, newPayment]);
    setShowCreatePayment(null);
  };

  // Handle payment completion
  const handlePaymentSuccess = (paymentId: string) => {
    setPaymentRequests(
      paymentRequests.map(p => 
        p.id === paymentId 
          ? { ...p, status: 'completed' as const, paidAt: new Date() } 
          : p
      )
    );
    setShowPaymentForm(null);
  };

  // Get patient's pending forms
  const patientPendingAssignments = formAssignments.filter(
    a => a.patientId === user.id && a.status === 'pending'
  );

  // Get patient's pending payments
  const patientPendingPayments = paymentRequests.filter(
    p => p.patientId === user.id && p.status === 'pending'
  );

  // Render tabs
  const tabs: { id: Tab; label: string; show: boolean }[] = [
    { id: 'messages', label: 'Messages', show: true },
    { id: 'forms', label: 'Forms', show: true },
    { id: 'payments', label: 'Payments', show: true },
    { id: 'patients', label: 'Patients', show: isProvider },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Headlight</h1>
              <p className="text-sm text-gray-500">Healthcare Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>
            <Button variant="ghost" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            {tabs.filter(t => t.show).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.id === 'forms' && !isProvider && patientPendingAssignments.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                    {patientPendingAssignments.length}
                  </span>
                )}
                {tab.id === 'payments' && !isProvider && patientPendingPayments.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-600 text-xs rounded-full">
                    {patientPendingPayments.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-3 gap-6 h-[calc(100vh-220px)]">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
              </CardHeader>
              <div className="overflow-y-auto">
                <ConversationList
                  conversations={conversationData}
                  selectedConversationId={selectedConversationId}
                  onSelectConversation={setSelectedConversationId}
                />
              </div>
            </Card>
            <Card className="col-span-2 overflow-hidden flex flex-col">
              {selectedConversation && otherUser ? (
                <MessageList
                  messages={conversationMessages}
                  currentUserId={user.id}
                  otherUser={otherUser}
                  onSendMessage={handleSendMessage}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a conversation to start messaging
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Forms Tab */}
        {activeTab === 'forms' && (
          <div>
            {isProvider ? (
              // Provider view - Form management
              showFormBuilder ? (
                <FormBuilder
                  onSave={handleSaveForm}
                  onCancel={() => setShowFormBuilder(false)}
                />
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Form Templates</h2>
                    <Button onClick={() => setShowFormBuilder(true)}>
                      Create New Form
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {forms.filter(f => f.providerId === user.id).map(form => (
                      <Card key={form.id}>
                        <CardHeader>
                          <CardTitle>{form.title}</CardTitle>
                          <p className="text-sm text-gray-500">{form.description}</p>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">
                            {form.fields.length} field{form.fields.length !== 1 ? 's' : ''}
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => setSelectedFormId(form.id)}
                            >
                              Preview
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => setSelectedPatientId('select')}
                            >
                              Send to Patient
                            </Button>
                          </div>
                          
                          {selectedPatientId === 'select' && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-sm font-medium mb-2">Select patient:</p>
                              <div className="space-y-2">
                                {demoPatients.map(patient => (
                                  <button
                                    key={patient.id}
                                    onClick={() => {
                                      handleAssignForm(form.id, patient.id);
                                      setSelectedPatientId(null);
                                    }}
                                    className="w-full text-left p-2 rounded bg-gray-50 hover:bg-gray-100"
                                  >
                                    {patient.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Preview Modal */}
                  {selectedFormId && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <CardContent className="pt-6">
                          {forms.find(f => f.id === selectedFormId) && (
                            <FormRenderer
                              form={forms.find(f => f.id === selectedFormId)!}
                              values={formValues}
                              onChange={(id, value) => setFormValues({ ...formValues, [id]: value })}
                              onSubmit={() => {}}
                              readOnly
                            />
                          )}
                          <div className="mt-4 pt-4 border-t flex justify-end">
                            <Button variant="secondary" onClick={() => {
                              setSelectedFormId(null);
                              setFormValues({});
                            }}>
                              Close Preview
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )
            ) : (
              // Patient view - Assigned forms
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Your Forms</h2>
                
                {patientPendingAssignments.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-gray-500">
                      No pending forms to complete
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {patientPendingAssignments.map(assignment => {
                      const form = forms.find(f => f.id === assignment.formId);
                      if (!form) return null;
                      
                      return (
                        <Card key={assignment.id}>
                          <CardHeader>
                            <CardTitle>{form.title}</CardTitle>
                            <p className="text-sm text-gray-500">{form.description}</p>
                          </CardHeader>
                          <CardContent>
                            {selectedFormId === assignment.id ? (
                              <>
                                <FormRenderer
                                  form={form}
                                  values={formValues}
                                  onChange={(id, value) => setFormValues({ ...formValues, [id]: value })}
                                  onSubmit={() => handleSubmitForm(assignment.id)}
                                />
                                <Button 
                                  variant="secondary" 
                                  className="mt-4"
                                  onClick={() => {
                                    setSelectedFormId(null);
                                    setFormValues({});
                                  }}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <Button onClick={() => setSelectedFormId(assignment.id)}>
                                Complete Form
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {isProvider ? 'Payment Requests' : 'Your Payments'}
              </h2>
            </div>

            {/* Show payment form modal */}
            {showPaymentForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="max-w-md w-full">
                  <PaymentForm
                    paymentRequest={paymentRequests.find(p => p.id === showPaymentForm)!}
                    onPaymentSuccess={() => handlePaymentSuccess(showPaymentForm)}
                    onCancel={() => setShowPaymentForm(null)}
                  />
                </div>
              </div>
            )}

            {/* Show create payment modal for provider */}
            {showCreatePayment && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <CreatePaymentRequest
                  patientId={showCreatePayment}
                  patientName={usersMap.get(showCreatePayment)?.name || 'Patient'}
                  onSubmit={(amount, description) => handleCreatePayment(showCreatePayment, amount, description)}
                  onCancel={() => setShowCreatePayment(null)}
                />
              </div>
            )}

            <Card>
              <CardContent className="py-4">
                <PaymentList
                  payments={paymentRequests.filter(p => 
                    isProvider ? p.providerId === user.id : p.patientId === user.id
                  )}
                  currentUser={user}
                  users={usersMap}
                  onPayNow={setShowPaymentForm}
                />
              </CardContent>
            </Card>

            {/* Provider: Quick create payment */}
            {isProvider && (
              <Card>
                <CardHeader>
                  <CardTitle>Request Payment from Patient</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {demoPatients.map(patient => (
                      <button
                        key={patient.id}
                        onClick={() => setShowCreatePayment(patient.id)}
                        className="p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors"
                      >
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-gray-500">{patient.email}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Patients Tab (Provider only) */}
        {activeTab === 'patients' && isProvider && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Your Patients</h2>
            <div className="grid grid-cols-2 gap-4">
              {demoPatients.map(patient => (
                <Card key={patient.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{patient.name}</h3>
                        <p className="text-sm text-gray-500">{patient.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => {
                            setSelectedConversationId('conv-1');
                            setActiveTab('messages');
                          }}
                        >
                          Message
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => setShowCreatePayment(patient.id)}
                        >
                          Request Payment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>
            Headlight Healthcare Portal • Secure communications powered by encrypted messaging • 
            Payments securely processed by Stripe
          </p>
        </div>
      </footer>
    </div>
  );
}
