import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux'

import type { IAppDispatch, IRootState } from './store'

type DispatchFunc = () => IAppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector
