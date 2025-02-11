import LinkOrg, { LinkProps as OrgLinkProps } from 'next/link';
import { MouseEvent, ReactNode, useCallback } from 'react';
import { useRouter } from './useRouter';

interface LinkProps extends OrgLinkProps {
  children: ReactNode;
}

export default function Link({ href, children, ...others }: LinkProps) {
  const { router } = useRouter();

  const defaultClickHandler = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (e.altKey) {
      window.open(href.toString(), '_blank');
    }
    router.push(href);
  }, []);

  return (
    <LinkOrg href={href} {...others}>
      {children}
    </LinkOrg>
  );
}
