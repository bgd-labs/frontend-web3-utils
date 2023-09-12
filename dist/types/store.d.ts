import { StoreApi } from 'zustand';
export declare type StoreSlice<T extends object, E extends object = T> = (set: StoreApi<E extends T ? E : E & T>['setState'], get: StoreApi<E extends T ? E : E & T>['getState']) => T;
