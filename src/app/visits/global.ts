import { InjectionToken } from '@angular/core';

export class Global {
    user: any = {};
}

export const GLOBALS = new InjectionToken<Global>('GLOBALS');
