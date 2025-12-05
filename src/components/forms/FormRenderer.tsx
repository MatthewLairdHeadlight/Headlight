'use client';

import React from 'react';
import { Form, FormField } from '@/types';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

interface FormRendererProps {
  form: Form;
  values: Record<string, string | string[] | boolean>;
  onChange: (fieldId: string, value: string | string[] | boolean) => void;
  onSubmit: () => void;
  submitting?: boolean;
  readOnly?: boolean;
}

export function FormRenderer({
  form,
  values,
  onChange,
  onSubmit,
  submitting = false,
  readOnly = false,
}: FormRendererProps) {
  const renderField = (field: FormField) => {
    const value = values[field.id];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <Input
            key={field.id}
            type={field.type === 'phone' ? 'tel' : field.type}
            label={field.label}
            placeholder={field.placeholder}
            required={field.required}
            value={(value as string) || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            disabled={readOnly}
          />
        );

      case 'number':
        return (
          <Input
            key={field.id}
            type="number"
            label={field.label}
            placeholder={field.placeholder}
            required={field.required}
            value={(value as string) || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            min={field.validation?.min}
            max={field.validation?.max}
            disabled={readOnly}
          />
        );

      case 'date':
        return (
          <Input
            key={field.id}
            type="date"
            label={field.label}
            required={field.required}
            value={(value as string) || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            disabled={readOnly}
          />
        );

      case 'textarea':
        return (
          <Textarea
            key={field.id}
            label={field.label}
            placeholder={field.placeholder}
            required={field.required}
            value={(value as string) || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            disabled={readOnly}
          />
        );

      case 'select':
        return (
          <div key={field.id} className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={(value as string) || ''}
              onChange={(e) => onChange(field.id, e.target.value)}
              disabled={readOnly}
              required={field.required}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={field.id}
              checked={(value as boolean) || false}
              onChange={(e) => onChange(field.id, e.target.checked)}
              disabled={readOnly}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={field.id} className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`${field.id}-${option}`}
                    name={field.id}
                    value={option}
                    checked={(value as string) === option}
                    onChange={(e) => onChange(field.id, e.target.value)}
                    disabled={readOnly}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor={`${field.id}-${option}`} className="text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{form.title}</h2>
        {form.description && (
          <p className="text-gray-600 mt-1">{form.description}</p>
        )}
      </div>

      <div className="space-y-4">
        {form.fields.map(renderField)}
      </div>

      {!readOnly && (
        <div className="pt-4">
          <Button type="submit" loading={submitting} className="w-full">
            Submit Form
          </Button>
        </div>
      )}
    </form>
  );
}
