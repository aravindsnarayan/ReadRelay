import React from 'react';
import {
  useFormContext,
  Controller,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import { Input, InputProps } from '../base/Input';

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<InputProps, 'value' | 'onChange' | 'error'> {
  name: TName;
  rules?: Parameters<typeof Controller<TFieldValues, TName>>[0]['rules'];
}

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, rules, ...inputProps }: FormFieldProps<TFieldValues, TName>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const error = errors[name]?.message as string | undefined;

  return (
    <Controller<TFieldValues, TName>
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <Input
          ref={ref}
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
          {...inputProps}
        />
      )}
    />
  );
}

export default FormField;
