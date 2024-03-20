import { v4 } from 'uuid';

export function uuid(): string {
  // This is a bit silly, but helps distinguish Cord UUIDs from this app's
  // UUIDs. Not important unless you're a Cord employee manually debugging
  // things, which we are!
  return v4().replaceAll('-', '.');
}
