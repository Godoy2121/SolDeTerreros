import { useCollection } from './useCollection';
import { playas as localPlayas } from '../data/playas';

export function usePlayas() {
  return useCollection('playas', localPlayas);
}
