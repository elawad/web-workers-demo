import type { MsgDone, MsgWork } from '../types';
import resize from './resize';

self.onmessage = async (event: MessageEvent<MsgWork>) => {
  const image = await resize(event.data);

  const { id } = event.data;
  const msg: MsgDone = { id, image };
  const opts = image ? { transfer: [image] } : undefined;

  self.postMessage(msg, opts);
};
