import { TipoEscalonador } from '../escalonador/TypeEscaduler'
import { SubProcesso } from '../process/SubProcesso'

export interface RespostaExecucaoEscalonador {
  elemento: SubProcesso
  tipo: TipoEscalonador
  prioridade: number
  tempoExecucao: number
}
