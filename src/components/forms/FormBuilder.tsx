'use client';

import React, { useState } from 'react';
import { FormField, FormFieldType } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { v4 as uuidv4 } from 'uuid';

interface FormBuilderProps {
  initialTitle?: string;
  initialDescription?: string;
  initialFields?: FormField[];
  onSave: (title: string, description: string, fields: FormField[]) => void;
  onCancel?: () => void;
}

const fieldTypes: { value: FormFieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio Buttons' },
];

export function FormBuilder({
  initialTitle = '',
  initialDescription = '',
  initialFields = [],
  onSave,
  onCancel,
}: FormBuilderProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const addField = (type: FormFieldType) => {
    const newField: FormField = {
      id: uuidv4(),
      type,
      label: `New ${type} field`,
      required: false,
      placeholder: '',
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined,
    };
    setFields([...fields, newField]);
    setEditingFieldId(newField.id);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, ...updates } : f));
  };

  const removeField = (fieldId: string) => {
    setFields(fields.filter(f => f.id !== fieldId));
    if (editingFieldId === fieldId) {
      setEditingFieldId(null);
    }
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const index = fields.findIndex(f => f.id === fieldId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;

    const newFields = [...fields];
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    setFields(newFields);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a form title');
      return;
    }
    if (fields.length === 0) {
      alert('Please add at least one field');
      return;
    }
    onSave(title, description, fields);
  };

  return (
    <div className="space-y-6">
      {/* Form Details */}
      <Card>
        <CardHeader>
          <CardTitle>Form Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Form Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter form title"
            required
          />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter form description (optional)"
          />
        </CardContent>
      </Card>

      {/* Field List */}
      <Card>
        <CardHeader>
          <CardTitle>Form Fields</CardTitle>
        </CardHeader>
        <CardContent>
          {fields.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No fields added yet. Click a field type below to add fields.
            </p>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={`border rounded-lg p-4 ${
                    editingFieldId === field.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        {fieldTypes.find(t => t.value === field.type)?.label}
                      </span>
                      {field.required && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveField(field.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveField(field.id, 'down')}
                        disabled={index === fields.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => setEditingFieldId(editingFieldId === field.id ? null : field.id)}
                        className="p-1 text-blue-500 hover:text-blue-600"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => removeField(field.id)}
                        className="p-1 text-red-500 hover:text-red-600"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <p className="font-medium">{field.label}</p>

                  {editingFieldId === field.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      <Input
                        label="Field Label"
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                      />
                      {(field.type === 'text' || field.type === 'textarea' || field.type === 'email' || field.type === 'phone' || field.type === 'number') && (
                        <Input
                          label="Placeholder"
                          value={field.placeholder || ''}
                          onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        />
                      )}
                      {(field.type === 'select' || field.type === 'radio') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Options (one per line)
                          </label>
                          <textarea
                            value={field.options?.join('\n') || ''}
                            onChange={(e) => updateField(field.id, { 
                              options: e.target.value.split('\n').filter(o => o.trim()) 
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            rows={3}
                          />
                        </div>
                      )}
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Required field</span>
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Field Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Add Field:</p>
            <div className="flex flex-wrap gap-2">
              {fieldTypes.map(({ value, label }) => (
                <Button
                  key={value}
                  variant="secondary"
                  size="sm"
                  onClick={() => addField(value)}
                >
                  + {label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave}>
          Save Form
        </Button>
      </div>
    </div>
  );
}
