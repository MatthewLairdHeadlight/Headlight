import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormRenderer } from '@/components/forms/FormRenderer';
import { Form } from '@/types';

describe('FormRenderer', () => {
  const mockForm: Form = {
    id: 'test-form',
    providerId: 'provider-1',
    title: 'Test Form',
    description: 'A test form',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your name',
        required: true,
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        required: true,
      },
      {
        id: 'notes',
        type: 'textarea',
        label: 'Notes',
        required: false,
      },
      {
        id: 'agree',
        type: 'checkbox',
        label: 'I agree to the terms',
        required: true,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    isTemplate: true,
  };

  it('renders form title and description', () => {
    render(
      <FormRenderer
        form={mockForm}
        values={{}}
        onChange={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText('Test Form')).toBeInTheDocument();
    expect(screen.getByText('A test form')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(
      <FormRenderer
        form={mockForm}
        values={{}}
        onChange={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notes/)).toBeInTheDocument();
    expect(screen.getByLabelText(/I agree to the terms/)).toBeInTheDocument();
  });

  it('calls onChange when field values change', () => {
    const handleChange = jest.fn();
    render(
      <FormRenderer
        form={mockForm}
        values={{}}
        onChange={handleChange}
        onSubmit={jest.fn()}
      />
    );

    const nameInput = screen.getByLabelText(/Full Name/);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    expect(handleChange).toHaveBeenCalledWith('name', 'John Doe');
  });

  it('calls onSubmit when form is submitted', () => {
    const handleSubmit = jest.fn();
    render(
      <FormRenderer
        form={mockForm}
        values={{ name: 'John', email: 'john@example.com' }}
        onChange={jest.fn()}
        onSubmit={handleSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Submit Form/i });
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('hides submit button when readOnly', () => {
    render(
      <FormRenderer
        form={mockForm}
        values={{}}
        onChange={jest.fn()}
        onSubmit={jest.fn()}
        readOnly
      />
    );

    expect(screen.queryByRole('button', { name: /Submit Form/i })).not.toBeInTheDocument();
  });

  it('shows loading state when submitting', () => {
    render(
      <FormRenderer
        form={mockForm}
        values={{}}
        onChange={jest.fn()}
        onSubmit={jest.fn()}
        submitting
      />
    );

    const submitButton = screen.getByRole('button', { name: /Submit Form/i });
    expect(submitButton).toBeDisabled();
  });
});
