import { Contact as ContactModel } from '../models';
import { Map } from './Map';

export const Contact = ({
  email,
  linkedInHandle,
  githubHandle,
}: ContactModel) => {
  return (
    <>
      <div className="mx-auto my-0 mb-10 mt-52 max-w-7xl">
        <h2> Get In Touch </h2>

        <div className="flex flex-row">
          <span className="flex-grow text-center">
            <a className="border-none" href={`mailto:${email}`}>
              {email}
            </a>
          </span>

          <span className="flex-grow text-center">
            <a
              className="border-none"
              href={`https://linkedin.com/in/${linkedInHandle}`}
            >
              in/{linkedInHandle}
            </a>
          </span>

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
        className="h-[800px] w-full"
        initialCenter={{ lat: 34.0218593, lng: -118.498265 }}
      />
    </>
  );
};
