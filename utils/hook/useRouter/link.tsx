import LinkOrg, { LinkProps as OrgLinkProps } from 'next/link';
import { MouseEvent, ReactNode, useCallback } from 'react';
import { useRouter } from './useRouter';

interface LinkProps extends OrgLinkProps {
  children: ReactNode;
}

export function Link({ href, children, onClick, ...others }: LinkProps) {
  const { router } = useRouter();

  const defaultOnClickHandler = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      if (onClick) {
        onClick(e);
        return;
      }
      if (e.altKey) {
        window.open(href.toString(), '_blank');
        return;
      }
      router.push(href);
    },
    [onClick, router],
  );

  return (
    <LinkOrg href={href} onClick={defaultOnClickHandler} {...others}>
      {children}
    </LinkOrg>
  );
}
