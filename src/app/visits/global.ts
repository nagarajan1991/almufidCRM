import { InjectionToken } from '@angular/core';

export class Global {
    user: User = {};
}

export const GLOBALS = new InjectionToken<Global>('GLOBALS');
