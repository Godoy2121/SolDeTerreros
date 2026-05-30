import { useCollection } from './useCollection';
import { eventos as localEventos } from '../data/eventos';

export function useEventos() {
  return useCollection('eventos', localEventos);
}
