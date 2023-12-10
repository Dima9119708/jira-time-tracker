import { StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

type TMiddleware<State> = [['zustand/immer', never], ['zustand/devtools', never]]

export const createStore = <State extends Record<string, any>>(fn: StateCreator<State, TMiddleware<State>>) =>
    createWithEqualityFn<State, TMiddleware<State>>(immer(devtools(fn)), shallow)
