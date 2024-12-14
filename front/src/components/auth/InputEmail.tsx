import { Input } from '@nextui-org/input';
import { FieldError, UseFormRegister } from 'react-hook-form';

type Props<T> = {
  fieldError: FieldError | undefined;
  serverErrors: string[] | undefined;
  register: T;
};

export const InputEmail = <T,>({
  fieldError,
  serverErrors,
  register,
}: Props<T>) => {
  return (
    <Input
      isRequired
      type="email"
      label="Email Address"
      placeholder="Enter your email"
      id="email"
      variant="bordered"
      isInvalid={!!fieldError}
      color={fieldError ? 'danger' : 'default'}
      {...(register as UseFormRegister<{ email: string }>)('email', {
        required: true,
        maxLength: 255,
        pattern: /^.+@.+$/i,
      })}
      errorMessage={
        (fieldError &&
          ((fieldError.type == 'required' && 'Please enter an email address') ||
            (fieldError.type == 'pattern' &&
              'Please enter a valid email address') ||
            (fieldError.type == 'maxLength' &&
              'E-mail address should be less or equal to 255 chars') ||
            'Invalid')) ??
        serverErrors?.at(0)
      }
    />
  );
};
