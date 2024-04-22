import { useDevice } from '@utils/hook/useDevice';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export const useCurRoute = () => {
  const navigation = useRouter();

  if (navigation.pathname === '/error') {
    console.log("it's error");
    return '';
  }
  if (navigation.pathname.includes('news')) {
    return 'news';
  } else if (navigation.pathname.includes('keywords')) {
    return 'keywords';
  } else if (navigation.pathname.includes('analyze')) {
    return 'analyze';
  } else if (navigation.pathname.includes('about')) {
    return 'about';
  } else {
    return 'home';
  }
};
