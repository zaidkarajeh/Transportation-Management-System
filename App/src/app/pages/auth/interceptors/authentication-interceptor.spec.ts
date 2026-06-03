/// <reference types="jasmine" />

import { HttpInterceptorFn } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { authenticationInterceptor } from './authentication-interceptor';

describe('authenticationInterceptor', () => {
    const interceptor: HttpInterceptorFn = (req, next) => TestBed.runInInjectionContext(() => authenticationInterceptor(req, next));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });
});
