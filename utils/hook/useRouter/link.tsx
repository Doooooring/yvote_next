import LinkOrg, { LinkProps as OrgLinkProps } from 'next/link';
import { MouseEvent, ReactNode, useCallback, useEffect } from 'react';
import { useRouter } from './useRouter';

interface LinkProps extends OrgLinkProps {
  children: ReactNode;
}

export function Link({ href, children, onClick, ...others }: LinkProps) {
  const { router } = useRouter();

  const defaultOnClickHandler = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (e.altKey) {
        window.open(href.toString(), '_blank');
        return;
      }
      router.push(href);
    },
    [router],
  );

  return (
    <LinkOrg href={href} onClick={onClick ?? defaultOnClickHandler} {...others}>
      {children}
    </LinkOrg>
  );
}
