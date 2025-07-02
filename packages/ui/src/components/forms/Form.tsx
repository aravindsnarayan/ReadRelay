import React from 'react';
import {
  useForm,
  FormProvider,
  UseFormReturn,
  FieldValues,
  UseFormProps,
  SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export interface FormProps<TFieldValues extends FieldValues = FieldValues> {
  children: React.ReactNode;
  onSubmit: SubmitHandler<TFieldValues>;
  schema?: z.ZodSchema<TFieldValues>;
  defaultValues?: UseFormProps<TFieldValues>['defaultValues'];
  className?: string;
  methods?: UseFormReturn<TFieldValues>;
}

export function Form<TFieldValues extends FieldValues = FieldValues>({
  children,
  onSubmit,
  schema,
  defaultValues,
  className = '',
  methods: externalMethods,
}: FormProps<TFieldValues>) {
  const internalMethods = useForm<TFieldValues>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });

  const methods = externalMethods || internalMethods;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={className}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
}

export default Form;
