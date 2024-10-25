'use client';

import { Button, Link } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { isSignUpEnabled } from '#backend/features';
import { RequestError } from '#error';
import { Input, useSignIn } from '#hooks/auth/useSignIn';

import { Divider } from './Divider';
import { InputEmail } from './InputEmail';
import { InputPassword } from './InputPassword';
import { Layout } from './Layout';

type ServerErrors = {
  [key: string]: string[];
};

export const SignIn = () => {
  const router = useRouter();

  const {
    isPending: isSigningIn,
    error: signInError,
    signInAsync,
  } = useSignIn();

  const { register, handleSubmit, formState } = useForm<Input>({
    mode: 'onChange',
  });
  const { errors: formErrors, isValid: formIsValid } = formState;

  // Parse the server errors
  const [serverError, setServerError] = useState<ServerErrors>({});
  useEffect(() => {
    if (signInError) {
      const errors: ServerErrors = {};
      if (signInError instanceof RequestError) {
        errors[signInError.info.field ?? '_'] = [signInError.info.message];
      } else if (signInError instanceof Error) {
        errors['_'] = [signInError.message ?? 'Unknown server error'];
      }
      setServerError(errors);
    }
  }, [signInError]);

  const onSubmit: SubmitHandler<Input> = async data => {
    const { email, password } = data;
    if (!email || !password) {
      // TODO(melvin): we fucked up the form, we can't recover from that error.
      // Need to log the error somewhere.
      return;
    }

    try {
      await signInAsync({ email, password });
    } catch (_) {
      // we can just return here because the sign up error will be handled
      // by the useSignUp hook
      return;
    }

    try {
      await signInAsync({ email, password });
      router.replace('/admin');
    } catch (error) {
      // TODO(melvin): Report error somewhere
    }
  };

  return (
    <Layout title="Log in to your account to continue">
      {serverError['_'] && (
        <div className="mb-4 flex flex-col text-center text-sm text-danger">
          {serverError['_'].map(e => (
            <span key={e}>{e}</span>
          ))}
        </div>
      )}

      <form className="flex flex-col gap-3">
        <InputEmail
          register={register}
          fieldError={formErrors.email}
          serverErrors={serverError['email']}
        />

        <InputPassword
          register={register}
          fieldError={formErrors.password}
          serverErrors={serverError['password']}
        />

        <Button
          isDisabled={!formIsValid}
          className="mt-2"
          isLoading={isSigningIn || isSigningIn}
          color="primary"
          type="submit"
          onClick={(...args) => void handleSubmit(onSubmit)(...args)}
        >
          {isSigningIn || isSigningIn ? 'Logging In...' : 'Log In'}
        </Button>
      </form>

      {isSignUpEnabled && (
        <>
          <Divider text="or" />

          <p className="text-center text-small">
            Need to create an account?&nbsp;
            <Link className="text-small text-accent" href="/auth/sign-up">
              Sign Up
            </Link>
          </p>
        </>
      )}
    </Layout>
  );
};