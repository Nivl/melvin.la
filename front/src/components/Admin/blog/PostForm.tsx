'use client';

import EditorJS from '@editorjs/editorjs';
import { Input, Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/react';
import { Switch } from '@nextui-org/switch';
import { useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  PiEyeClosedLight as NotPublishedIcon,
  PiEyeLight as PublishedIcon,
} from 'react-icons/pi';

import { Editor } from '#components/Admin/blog/Editor';
import { Footer } from '#components/Home/Footer';
import { Section } from '#components/Home/Section';
import { ServerErrors } from '#error';
import { Input as CreatePostEndpointInput } from '#hooks/blog/useCreateNewPost';
import { Input as UpdatePostEndpointInput } from '#hooks/blog/useUpdatePost';
type FormInputs =
  | Omit<CreatePostEndpointInput, 'contentJson' | 'publish'>
  | Omit<UpdatePostEndpointInput, 'contentJson' | 'publish'>;

import { Post } from '#backend/types';

type OnSave = (
  data: CreatePostEndpointInput | UpdatePostEndpointInput,
) => Promise<void>;

export const PostForm = ({
  post,
  onSave,
  serverErrors,
  cta,
}: {
  post?: Post;
  serverErrors: ServerErrors;
  onSave: OnSave;
  cta: {
    isDisabled: boolean;
    isPending: boolean;
    text: string;
    textWhenPending: string;
  };
}) => {
  const editorRef = useRef<EditorJS | null>(null);
  const publishRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, formState } = useForm<FormInputs>({
    mode: 'onChange',
  });
  const { errors: formErrors, isValid: formIsValid } = formState;

  const onSubmit: SubmitHandler<
    Omit<FormInputs, 'description'>
  > = async data => {
    try {
      await onSave({
        ...data,
        contentJson: await editorRef.current?.save(),
        publish: publishRef.current?.checked,
      });
    } catch (_) {
      // we can just return here because the sign up error will be handled
      // by the useSignUp hook
      return;
    }
  };

  return (
    <>
      <form>
        <Section className="flex flex-col items-center justify-center">
          <h2 className="mb-5 pb-5 text-center text-2xl font-black uppercase">
            Metadata
          </h2>

          <div className="w-full max-w-md">
            <div className="px-8 py-6">
              <div className="flex flex-col gap-3">
                <Input
                  isRequired
                  defaultValue={post?.title}
                  type="text"
                  label="Title"
                  placeholder="Enter your post title"
                  id="title"
                  variant="bordered"
                  isInvalid={!!formErrors.title}
                  color={formErrors.title ? 'danger' : 'default'}
                  {...register('title', {
                    required: true,
                    maxLength: 100,
                  })}
                  errorMessage={
                    (formErrors.title &&
                      ((formErrors.title.type == 'maxLength' &&
                        'Name should be less or equal to 100 chars') ||
                        'Invalid')) ||
                    (serverErrors['title'] && serverErrors['title'][0])
                  }
                />

                <Input
                  defaultValue={post?.slug}
                  type="text"
                  label="Slug"
                  placeholder="Enter your post URL slug"
                  id="slug"
                  variant="bordered"
                  isInvalid={!!formErrors.slug}
                  color={formErrors.slug ? 'danger' : 'default'}
                  {...register('slug', {
                    maxLength: 105,
                  })}
                  errorMessage={
                    (formErrors.slug &&
                      ((formErrors.slug.type == 'maxLength' &&
                        'Name should be less or equal to 105 chars') ||
                        'Invalid')) ||
                    (serverErrors['slug'] && serverErrors['slug'][0])
                  }
                />

                <Input
                  defaultValue={post?.thumbnailUrl}
                  type="text"
                  label="Thumbnail URL"
                  placeholder="Enter your URL of the thumbnail"
                  id="thumbnailUrl"
                  variant="bordered"
                  isInvalid={!!formErrors.thumbnailUrl}
                  color={formErrors.thumbnailUrl ? 'danger' : 'default'}
                  {...register('thumbnailUrl', {
                    maxLength: 255,
                  })}
                  errorMessage={
                    (formErrors.thumbnailUrl &&
                      ((formErrors.thumbnailUrl.type == 'maxLength' &&
                        'Name should be less or equal to 255 chars') ||
                        'Invalid')) ||
                    (serverErrors['thumbnailUrl'] &&
                      serverErrors['thumbnailUrl'][0])
                  }
                />

                <Textarea
                  defaultValue={post?.description}
                  label="Description"
                  id="description"
                  variant="bordered"
                  placeholder="Enter your description"
                  {...register('description', {
                    maxLength: 130,
                  })}
                  errorMessage={
                    (formErrors.description &&
                      ((formErrors.description.type == 'maxLength' &&
                        'Name should be less or equal to 130 chars') ||
                        'Invalid')) ||
                    (serverErrors['description'] &&
                      serverErrors['description'][0])
                  }
                />
              </div>
            </div>
          </div>
        </Section>

        <Section>
          <h2 className="mb-5 pb-5 text-center text-2xl font-black uppercase">
            Post content
          </h2>

          <div className="editor">
            <Editor
              initialData={
                post?.contentJson || {
                  time: new Date().getTime(),
                  blocks: [
                    {
                      type: 'header',
                      data: {
                        text: 'My new Post!',
                        level: 2,
                      },
                    },
                  ],
                }
              }
              editorblock="editorjs-container"
              ref={editorRef}
            />
          </div>
        </Section>

        <Section>
          <h2 className="mb-5 pb-5 text-center text-2xl font-black uppercase">
            Publish
          </h2>

          <div className="flex flex-row justify-center gap-10">
            <Switch
              ref={publishRef}
              color="primary"
              size="lg"
              defaultChecked={post?.publishedAt != null}
              thumbIcon={({ isSelected, className }) =>
                isSelected ? (
                  <PublishedIcon className={className} />
                ) : (
                  <NotPublishedIcon className={className} />
                )
              }
            >
              Make Public
            </Switch>

            <Button
              isDisabled={!formIsValid || cta.isDisabled || cta.isPending}
              isLoading={cta.isPending}
              color="primary"
              type="submit"
              onClick={(...args) => void handleSubmit(onSubmit)(...args)}
            >
              {cta.isPending ? cta.textWhenPending : cta.text}
            </Button>
          </div>
        </Section>
      </form>

      <Section className="mb-3 lg:mb-8">
        <Footer />
      </Section>
    </>
  );
};
