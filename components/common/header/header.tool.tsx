import { useRouter } from 'next/router';

export const useCurRoute = () => {
  const router = useRouter();

  if (router.pathname === '/error') {
    console.log("it's error");
    return '';
  }
  if (router.pathname.includes('news')) {
    return 'news';
  } else if (router.pathname.includes('keywords')) {
    return 'keywords';
  } else if (router.pathname.includes('analyze')) {
    return 'analyze';
  } else if (router.pathname.includes('about')) {
    return 'about';
  } else {
    return 'home';
  }
};
