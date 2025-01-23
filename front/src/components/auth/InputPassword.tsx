import { Input } from '@heroui/input';
import { useState } from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import {
  PiEyeClosedLight as NotVisibleIcon,
  PiEyeLight as VisibleIcon,
} from 'react-icons/pi';

type Props<T> = {
  fieldError: FieldError | undefined;
  serverErrors: string[] | undefined;
  register: T;
};

export const InputPassword = <T,>({
  fieldError,
  serverErrors,
  register,
}: Props<T>) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  return (
    <Input
      isRequired
      type={isPasswordVisible ? 'text' : 'password'}
      label="Password"
      placeholder="Enter your password"
      id="password"
      variant="bordered"
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={() => {
            setIsPasswordVisible(!isPasswordVisible);
          }}
          aria-label="toggle password visibility"
        >
          {isPasswordVisible ? (
            <NotVisibleIcon className="pointer-events-none text-2xl text-default-400" />
          ) : (
            <VisibleIcon className="pointer-events-none text-2xl text-default-400" />
          )}
        </button>
      }
      isInvalid={!!fieldError}
      color={fieldError ? 'danger' : 'default'}
      {...(register as UseFormRegister<{ password: string }>)('password', {
        required: true,
        maxLength: 255,
      })}
      errorMessage={
        (fieldError &&
          ((fieldError.type == 'required' && 'Required') ||
            (fieldError.type == 'maxLength' &&
              'Password should be less or equal to 255 chars') ||
            'Invalid')) ??
        serverErrors?.at(0)
      }
    />
  );
};
