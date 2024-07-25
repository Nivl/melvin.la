import { Contact as ContactModel } from '../../models';
import { Heading } from './Heading';
import { Map } from './Map';

export const Contact = ({
  email,
  linkedInHandle,
  githubHandle,
}: ContactModel) => {
  return (
    <>
      <div className="mx-auto my-0 mb-3 mt-16 w-5/6 md:mb-10 lg:mt-52 lg:max-w-7xl">
        <Heading level={2}> Get In Touch </Heading>

        <div className="flex flex-col md:flex-row">
          <span className="flex-grow text-center">
            <a className="border-none" href={`mailto:${email}`}>
              {email}
            </a>
          </span>

          {linkedInHandle && (
            <span className="flex-grow text-center">
              <a
                className="border-none"
                href={`https://linkedin.com/in/${linkedInHandle}`}
              >
                in/{linkedInHandle}
              </a>
            </span>
          )}

          <span className="flex-grow text-center">
            <a
              className="border-none"
              href={`https://github.com/${githubHandle}`}
            >
              @{githubHandle}
            </a>
          </span>
        </div>
      </div>
      <Map
        data-chromatic="ignore"
        className="h-[800px] w-full"
        initialCenter={{ lat: 34.0218593, lng: -118.498265 }}
      />
    </>
  );
};
