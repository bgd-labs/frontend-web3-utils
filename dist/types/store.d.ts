import { GetState, SetState } from "zustand";
export declare type StoreSlice<T extends object, E extends object = T> = (set: SetState<E extends T ? E : E & T>, get: GetState<E extends T ? E : E & T>) => T;
