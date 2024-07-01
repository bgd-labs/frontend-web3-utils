/**
 * A set of useful basic types that are often used.
 * @module GenericTypes
 */

import { Client, PublicClient } from 'viem';
import { StoreApi } from 'zustand';

export type ClientsRecord = Record<number, Client>;
export type PublicClientsRecord = Record<number, PublicClient>;

export type StoreSlice<T extends object, E extends object = T> = (
  set: StoreApi<E extends T ? E : E & T>['setState'],
  get: StoreApi<E extends T ? E : E & T>['getState'],
) => T;
