import { Device } from '../interface/common';

export const HeaderHeight = (device: Device) => {
  return device === Device.pc ? '65px' : '50px';
};
