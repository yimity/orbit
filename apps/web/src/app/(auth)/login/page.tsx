import Link from 'next/link';

import { GitHubLogoIcon } from '@radix-ui/react-icons';

import { env } from '@orbitkit/env/web/server';
import { Button } from '@orbitkit/ui/button';

const googleAuthIsEnabled =
  env.AUTH_GOOGLE_ID !== undefined &&
  env.AUTH_GOOGLE_SECRET !== undefined &&
  env.AUTH_GOOGLE_CODE_VERIFIER !== undefined;

const githubAuthIsEnabled =
  env.AUTH_GITHUB_SECRET !== undefined && env.AUTH_GITHUB_ID !== undefined;

export default function Page() {
  return (
    <main className="container mx-auto flex flex-col items-center w-100">
      <div className={'mt-20'}>
        <img
          className="w-auto h-7 relative block dark:hidden"
          src={
            'https://mintlify.s3-us-west-1.amazonaws.com/orbitkit/logo/orbitkit-light.svg'
          }
          alt={'orbitKit'}
        />
      </div>
      {githubAuthIsEnabled && (
        <Button className={'w-64 my-10'} asChild>
          <div>
            <GitHubLogoIcon className="mr-2 h-4 w-4" />{' '}
            <Link href="/login/github">Sign in with Github</Link>
          </div>
        </Button>
      )}
      {googleAuthIsEnabled && (
        <Button className={'w-64'} asChild>
          <div>
            <GitHubLogoIcon className="mr-2 h-4 w-4" />{' '}
            <Link href="/login/google">Sign in with Google</Link>
          </div>
        </Button>
      )}

      {!githubAuthIsEnabled && !googleAuthIsEnabled && (
        <p>Authentication environment variables are not configured.</p>
      )}
    </main>
  );
}
