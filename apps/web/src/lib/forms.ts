'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldValues, type UseFormProps } from 'react-hook-form';
import type { z } from 'zod';

/**
 * React Hook Form wired to a shared @love/validation schema, so client
 * validation is identical to server validation. The server MUST still
 * re-validate with the same schema — client checks are only for UX.
 *
 * @example
 *   const form = useZodForm(signInSchema, { defaultValues: { email: '', password: '' } });
 */
export function useZodForm<TInput extends FieldValues, TOutput extends FieldValues>(
  schema: z.ZodType<TOutput, TInput>,
  options?: Omit<UseFormProps<TInput, unknown, TOutput>, 'resolver'>
) {
  return useForm<TInput, unknown, TOutput>({
    mode: 'onBlur',
    ...options,
    resolver: zodResolver(schema),
  });
}
