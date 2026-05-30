import { useCollection } from './useCollection';
import { restaurantes as localRestaurantes } from '../data/restaurantes';

export function useRestaurantes() {
  return useCollection('restaurantes', localRestaurantes);
}
