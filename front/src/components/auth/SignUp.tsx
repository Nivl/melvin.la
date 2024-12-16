'use client';

import { Input } from '@nextui-org/input';
import { Button, Link } from '@nextui-org/react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  PiEyeClosedLight as NotVisibleIcon,
  PiEyeLight as VisibleIcon,
} from 'react-icons/pi';

import { FLAG_SIGN_UP_ALLOWED } from '#backend/flags';
import { RequestError, ServerErrors } from '#error';
import { useSignIn } from '#hooks/auth/useSignIn';
import { Input as SignUpInput, useSignUp } from '#hooks/auth/useSignUp';

import { Divider } from './Divider';
import { InputEmail } from './InputEmail';
import { InputPassword } from './InputPassword';
import { Layout } from './Layout';

type Inputs = SignUpInput & {
  passwordAgain: string;
};

export const SignUp = () => {
  const router = useRouter();
  const flags = useFlags();

  const {
    isPending: isSigningUp,
    error: signUpError,
    signUpAsync,
  } = useSignUp();

  // We automatically sign in the user after sign up
  const { isPending: isSigningIn, signInAsync } = useSignIn();
  const [isPasswordAgainVisible, setIsPasswordAgainVisible] =
    useState<boolean>(false);

  const { register, handleSubmit, formState, watch, trigger } = useForm<Inputs>(
    {
      mode: 'onChange',
    },
  );
  const { errors: formErrors, isValid: formIsValid } = formState;
  const password = watch('password');

  // Automatically validate passwordAgain when password changes
  useEffect(() => {
    void trigger('passwordAgain');
  }, [trigger, password]);

  // Parse the server errors
  const [serverError, setServerError] = useState<ServerErrors>({});
  useEffect(() => {
    if (signUpError) {
      const errors: ServerErrors = {};
      if (signUpError instanceof RequestError) {
        errors[signUpError.info.field ?? '_'] = [signUpError.info.message];
      } else if (signUpError instanceof Error) {
        errors._ = [signUpError.message || 'Unknown server error'];
      }
      setServerError(errors);
    }
  }, [signUpError]);

  const onSubmit: SubmitHandler<Inputs> = async data => {
    const { email, password, name } = data;
    if (!email || !password || !name) {
      // TODO(melvin): we fucked up the form, we can't recover from that error.
      // Need to log the error somewhere.
      return;
    }

    try {
      await signUpAsync({ email, password, name });
    } catch (_) {
      // we can just return here because the sign up error will be handled
      // by the useSignUp hook
      return;
    }

    try {
      await signInAsync({ email, password });
      router.push('/admin');
    } catch (_) {
      // TODO(melvin): Report error somewhere
      // In case of error we'll let the user try again manually
      router.replace('/auth/sign-in');
    }
  };

  return (
    <Layout title="Create your account to get started">
      {serverError._ && (
        <div className="mb-4 flex flex-col text-center text-sm text-danger">
          {serverError._.map(e => (
            <span key={e}>{e}</span>
          ))}
        </div>
      )}

      <form
        className="flex flex-col gap-3"
        onSubmit={e => {
          e.preventDefault();
          void handleSubmit(onSubmit)(e);
        }}
      >
        <Input
          isRequired
          type="text"
          label="Name"
          placeholder="Enter your name"
          id="name"
          variant="bordered"
          isInvalid={!!formErrors.name}
          color={formErrors.name ? 'danger' : 'default'}
          {...register('name', {
            required: true,
            maxLength: 50,
          })}
          errorMessage={
            (formErrors.name &&
              ((formErrors.name.type == 'required' && 'Please enter a name') ||
                (formErrors.name.type == 'maxLength' &&
                  'Name should be less or equal to 50 chars') ||
                'Invalid')) ??
            (serverError.name && serverError.name[0])
          }
        />

        <InputEmail
          register={register}
          fieldError={formErrors.email}
          serverErrors={serverError.email}
        />

        <InputPassword
          register={register}
          fieldError={formErrors.password}
          serverErrors={serverError.password}
        />

        <Input
          isRequired
          type={isPasswordAgainVisible ? 'text' : 'password'}
          label="Confirm Password"
          placeholder="Confirm your password"
          id="passwordAgain"
          variant="bordered"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() => {
                setIsPasswordAgainVisible(!isPasswordAgainVisible);
              }}
              aria-label="toggle password visibility"
            >
              {isPasswordAgainVisible ? (
                <NotVisibleIcon className="pointer-events-none text-2xl text-default-400" />
              ) : (
                <VisibleIcon className="pointer-events-none text-2xl text-default-400" />
              )}
            </button>
          }
          isInvalid={!!formErrors.passwordAgain}
          color={formErrors.passwordAgain ? 'danger' : 'default'}
          {...register('passwordAgain', {
            maxLength: 255,
            validate: {
              match: (passwordAgain: string) => {
                if (passwordAgain !== password) {
                  return 'Passwords do not match';
                }
              },
            },
          })}
          errorMessage={
            formErrors.passwordAgain &&
            ((formErrors.passwordAgain.type == 'maxLength' &&
              'Password should be less or equal to 255 chars') ||
              (formErrors.passwordAgain.type == 'required' && 'Required') ||
              (formErrors.passwordAgain.type == 'match' &&
                "Password don't match") ||
              'Invalid')
          }
        />

        <Button
          isDisabled={!formIsValid || !flags[FLAG_SIGN_UP_ALLOWED]}
          className="mt-2"
          isLoading={isSigningUp || isSigningIn}
          color="primary"
          type="submit"
        >
          {isSigningUp || isSigningIn ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </form>

      <Divider text="or" />

      <p className="text-center text-small">
        Already have an account?&nbsp;
        <Link className="text-small text-accent" href="/auth/sign-in">
          Log In
        </Link>
      </p>
    </Layout>
  );
};
