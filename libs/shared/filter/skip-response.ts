import { SetMetadata } from '@nestjs/common';

export const SKIP_RESPONSE = 'SKIP_RESPONSE';
export const SkipResponseWrap = () => SetMetadata(SKIP_RESPONSE, true);
