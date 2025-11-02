import { Contact as ContactModel } from '../../models';
import { Heading } from '../layout/Heading';
import { Map } from './Map';

export const Contact = ({
  email,
  linkedInHandle,
  githubHandle,
}: ContactModel) => {
  return (
    <>
      <div className="mx-auto my-0 mt-16 mb-3 w-5/6 md:mb-10 lg:mt-52 lg:max-w-7xl">
        <Heading level={2}> Get In Touch </Heading>

        <div className="flex flex-col md:flex-row">
          <span className="grow text-center">
            <a className="border-none" href={`mailto:${email}`}>
              {email}
            </a>
          </span>

          {linkedInHandle && (
            <span className="grow text-center">
              <a
                className="border-none"
                href={`https://linkedin.com/in/${linkedInHandle}`}
              >
                in/{linkedInHandle}
              </a>
            </span>
          )}

          <span className="grow text-center">
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
        className="h-[800px] w-full"
        initialCenter={{ lat: 34.021_859_3, lng: -118.498_265 }}
      />
    </>
  );
};
