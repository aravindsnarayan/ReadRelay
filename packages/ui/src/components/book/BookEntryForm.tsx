'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '../base/Input';
import { TextArea } from '../forms/TextArea';
import { Button } from '../base/Button';
import { Text, SmallText } from '../base/Typography';
import { ISBNScanner } from './ISBNScanner';
import type { BookInput } from '@readrelay/shared';
import { safeValidateInput, bookSchema } from '@readrelay/shared';

interface BookEntryFormProps {
  initialData?: Partial<BookInput>;
  onSubmit: (data: BookInput) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: string[];
}

const FORM_STEPS: FormStep[] = [
  {
    id: 'basic',
    title: 'Basic Information',
    description: 'Enter the essential book details',
    fields: ['title', 'author', 'isbn'],
  },
  {
    id: 'details',
    title: 'Details & Condition',
    description: 'Add more information about the book',
    fields: [
      'description',
      'publication_year',
      'publisher',
      'genre',
      'condition',
    ],
  },
  {
    id: 'exchange',
    title: 'Exchange Settings',
    description: 'Set how you want to share this book',
    fields: ['exchange_type', 'max_borrow_days', 'tags'],
  },
];

const CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Excellent - Like new' },
  { value: 'good', label: 'Good - Minor wear' },
  { value: 'fair', label: 'Fair - Noticeable wear' },
  { value: 'poor', label: 'Poor - Significant wear' },
];

const EXCHANGE_TYPE_OPTIONS = [
  { value: 'borrow', label: 'Borrow - Lend temporarily' },
  { value: 'swap', label: 'Swap - Exchange permanently' },
  { value: 'give_away', label: 'Give Away - Gift to others' },
];

const GENRE_OPTIONS = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'Biography',
  'History',
  'Self-Help',
  'Business',
  'Children',
  'Young Adult',
  'Horror',
  'Thriller',
  'Poetry',
  'Drama',
  'Comedy',
  'Adventure',
  'Educational',
  'Reference',
];

export const BookEntryForm: React.FC<BookEntryFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<BookInput>>({
    language: 'en', // Default language as per schema
    ...initialData,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showISBNScanner, setShowISBNScanner] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    const draftKey = 'book-entry-draft';
    localStorage.setItem(draftKey, JSON.stringify(formData));
  }, [formData]);

  // Load draft on mount
  useEffect(() => {
    const draftKey = 'book-entry-draft';
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft && Object.keys(initialData).length === 0) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData({ language: 'en', ...draft });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Failed to load saved draft:', error);
      }
    }
  }, [initialData]);

  // Real-time field validation using shared Zod schema
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateField = useCallback(
    (fieldName: string, value: any): string | null => {
      // Create a partial data object for validation
      const testData = { ...formData, [fieldName]: value };

      // Use the shared validation schema
      const result = safeValidateInput(bookSchema.partial(), testData);

      if (!result.success) {
        // Find error for this specific field
        const fieldError = result.error.errors.find(err =>
          err.path.includes(fieldName)
        );
        if (fieldError) {
          return fieldError.message;
        }
      }

      // Additional business logic validation
      if (
        fieldName === 'max_borrow_days' &&
        formData.exchange_type === 'borrow' &&
        !value
      ) {
        return 'Maximum borrow days is required for borrow exchanges';
      }

      return null;
    },
    [formData]
  );

  // Handle field changes with validation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFieldChange = useCallback(
    (fieldName: string, value: any) => {
      setFormData((prev: Partial<BookInput>) => ({
        ...prev,
        [fieldName]: value,
      }));

      // Real-time validation
      const error = validateField(fieldName, value);
      setValidationErrors((prev: Record<string, string>) => ({
        ...prev,
        [fieldName]: error || '',
      }));

      // Clear validation error when field is corrected
      if (!error && validationErrors[fieldName]) {
        setValidationErrors((prev: Record<string, string>) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    },
    [validateField, validationErrors]
  );

  // Handle ISBN scanning
  const handleISBNDetected = useCallback(async (isbn: string) => {
    setShowISBNScanner(false);
    setFormData((prev: Partial<BookInput>) => ({ ...prev, isbn }));

    // Try to auto-fill book data from ISBN
    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(`/api/books/isbn/${isbn}`);
      if (response.ok) {
        const bookData = await response.json();
        if (bookData.success && bookData.book) {
          setFormData((prev: Partial<BookInput>) => ({
            ...prev,
            title: bookData.book.title || prev.title,
            author: bookData.book.author || prev.author,
            description: bookData.book.description || prev.description,
            publisher: bookData.book.publisher || prev.publisher,
            publication_year:
              bookData.book.publication_year || prev.publication_year,
            genre: bookData.book.genre || prev.genre,
            cover_image_url:
              bookData.book.cover_image_url || prev.cover_image_url,
          }));
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to fetch book data:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  // Validate current step
  const validateCurrentStep = useCallback((): boolean => {
    const currentStepFields = FORM_STEPS[currentStep].fields;
    let hasErrors = false;

    currentStepFields.forEach(fieldName => {
      const value = formData[fieldName as keyof BookInput];
      const error = validateField(fieldName, value);
      if (error) {
        hasErrors = true;
        setValidationErrors((prev: Record<string, string>) => ({
          ...prev,
          [fieldName]: error,
        }));
      }
    });

    return !hasErrors;
  }, [currentStep, formData, validateField]);

  // Navigate to next step
  const handleNext = useCallback(() => {
    if (validateCurrentStep() && currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [validateCurrentStep, currentStep]);

  // Navigate to previous step
  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Submit form
  const handleSubmit = useCallback(() => {
    // Final validation using shared schema
    const submitData = {
      title: formData.title || '',
      author: formData.author || '',
      condition: formData.condition || 'good',
      exchange_type: formData.exchange_type || 'borrow',
      language: 'en', // Always set to 'en' for now
      isbn: formData.isbn,
      description: formData.description,
      publisher: formData.publisher,
      publication_year: formData.publication_year,
      genre: formData.genre,
      cover_image_url: formData.cover_image_url,
      max_borrow_days: formData.max_borrow_days,
      tags: formData.tags,
      external_id: formData.external_id,
      external_source: formData.external_source,
    };

    const validationResult = safeValidateInput(bookSchema, submitData);

    if (validationResult.success) {
      // Clear draft and submit
      localStorage.removeItem('book-entry-draft');
      onSubmit(validationResult.data as BookInput);
    } else {
      // Set validation errors from Zod
      const newErrors: Record<string, string> = {};
      validationResult.error.errors.forEach(err => {
        if (err.path.length > 0) {
          newErrors[err.path[0]] = err.message;
        }
      });
      setValidationErrors(newErrors);
    }
  }, [formData, onSubmit]);

  // Progress indicator
  const progressPercentage = ((currentStep + 1) / FORM_STEPS.length) * 100;

  const renderStepContent = () => {
    const step = FORM_STEPS[currentStep];

    switch (step.id) {
      case 'basic':
        return (
          <div className="space-y-4">
            <div>
              <Input
                label="Title *"
                value={formData.title || ''}
                onChange={value => handleFieldChange('title', value)}
                error={validationErrors.title}
                placeholder="Enter book title"
                required
              />
            </div>

            <div>
              <Input
                label="Author *"
                value={formData.author || ''}
                onChange={value => handleFieldChange('author', value)}
                error={validationErrors.author}
                placeholder="Enter author name"
                required
              />
            </div>

            <div>
              <div className="flex gap-2">
                <Input
                  label="ISBN (optional)"
                  value={formData.isbn || ''}
                  onChange={value => handleFieldChange('isbn', value)}
                  error={validationErrors.isbn}
                  placeholder="Enter ISBN or scan barcode"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => setShowISBNScanner(true)}
                  className="mt-6"
                >
                  📷 Scan
                </Button>
              </div>
              {isLoadingSuggestions && (
                <SmallText color="secondary" className="mt-1">
                  Loading book data...
                </SmallText>
              )}
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-4">
            <div>
              <TextArea
                label="Description (optional)"
                value={formData.description || ''}
                onChange={value => handleFieldChange('description', value)}
                error={validationErrors.description}
                placeholder="Brief description of the book"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Publication Year"
                type="number"
                value={formData.publication_year?.toString() || ''}
                onChange={value =>
                  handleFieldChange(
                    'publication_year',
                    parseInt(value) || undefined
                  )
                }
                error={validationErrors.publication_year}
                placeholder="YYYY"
              />

              <Input
                label="Publisher"
                value={formData.publisher || ''}
                onChange={value => handleFieldChange('publisher', value)}
                placeholder="Publisher name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre (optional)
              </label>
              <select
                value={formData.genre || ''}
                onChange={e =>
                  handleFieldChange('genre', e.target.value || undefined)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select genre</option>
                {GENRE_OPTIONS.map(genre => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              {validationErrors.genre && (
                <SmallText color="error" className="mt-1">
                  {validationErrors.genre}
                </SmallText>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Condition *
              </label>
              <select
                value={formData.condition || ''}
                onChange={e => handleFieldChange('condition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select condition</option>
                {CONDITION_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {validationErrors.condition && (
                <SmallText color="error" className="mt-1">
                  {validationErrors.condition}
                </SmallText>
              )}
            </div>
          </div>
        );

      case 'exchange':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exchange Type *
              </label>
              <select
                value={formData.exchange_type || ''}
                onChange={e =>
                  handleFieldChange('exchange_type', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select exchange type</option>
                {EXCHANGE_TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {validationErrors.exchange_type && (
                <SmallText color="error" className="mt-1">
                  {validationErrors.exchange_type}
                </SmallText>
              )}
            </div>

            {formData.exchange_type === 'borrow' && (
              <div>
                <Input
                  label="Maximum Borrow Days *"
                  type="number"
                  value={formData.max_borrow_days?.toString() || ''}
                  onChange={value =>
                    handleFieldChange(
                      'max_borrow_days',
                      parseInt(value) || undefined
                    )
                  }
                  error={validationErrors.max_borrow_days}
                  placeholder="How many days can someone borrow this book?"
                  required
                />
              </div>
            )}

            <div>
              <Input
                label="Tags (optional)"
                value={formData.tags?.join(', ') || ''}
                onChange={value =>
                  handleFieldChange(
                    'tags',
                    value ? value.split(',').map(tag => tag.trim()) : []
                  )
                }
                placeholder="fiction, mystery, fantasy (comma-separated)"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto ${className}`}
    >
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            Step {currentStep + 1} of {FORM_STEPS.length}
          </span>
          <span>{Math.round(progressPercentage)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step header */}
      <div className="mb-6">
        <Text className="text-xl font-semibold mb-2">
          {FORM_STEPS[currentStep].title}
        </Text>
        <SmallText color="secondary">
          {FORM_STEPS[currentStep].description}
        </SmallText>
      </div>

      {/* Step content */}
      <div className="mb-6">{renderStepContent()}</div>

      {/* Navigation buttons */}
      <div className="flex justify-between gap-4">
        <div>
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isLoading}
            >
              ← Previous
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}

          {currentStep < FORM_STEPS.length - 1 ? (
            <Button onClick={handleNext} disabled={isLoading}>
              Next →
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Adding Book...' : 'Add Book'}
            </Button>
          )}
        </div>
      </div>

      {/* ISBN Scanner Modal */}
      {showISBNScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <ISBNScanner
            onISBNDetected={handleISBNDetected}
            onClose={() => setShowISBNScanner(false)}
            onError={error => {
              // eslint-disable-next-line no-console
              console.error('ISBN Scanner error:', error);
              setShowISBNScanner(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BookEntryForm;
