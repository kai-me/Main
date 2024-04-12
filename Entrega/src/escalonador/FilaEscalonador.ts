import { RespostaExecucaoEscalonador } from '../Interface/RespostaExecucaoEscalonador'
import { Processo } from '../process/Processo'
import { SubProcesso } from '../process/SubProcesso'
import { Escalonador } from './Escaduler'
import { TipoEscalonador } from './TypeEscaduler'

export abstract class FilaEscalonador extends Escalonador {
  protected filaProcessos: Processo[]
  protected filaSubProcessos: SubProcesso[]

  constructor() {
    super()
    this.filaProcessos = []
    this.filaSubProcessos = []
  }

  public executar(): RespostaExecucaoEscalonador | undefined {
    const elemento = this.filaSubProcessos.shift()

    if (elemento) {
      return {
        elemento,
        prioridade: elemento.getProcesso.getPrioridade,
        tempoExecucao: elemento.getProcesso.getTempoExecucao,
        tipo: TipoEscalonador.FILA,
      }
    } else {
      return undefined
    }
  }

  public encerrar(processo: Processo): void {
    this.filaProcessos = this.filaProcessos.filter(
      (p) => p.getId !== processo.getId,
    )

    this.filaSubProcessos = this.filaSubProcessos.filter(
      (sp) => sp.getProcesso.getId !== processo.getId,
    )
  }
}
