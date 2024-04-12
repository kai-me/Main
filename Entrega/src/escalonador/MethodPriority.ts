import { TipoChamadaSistema } from '../so/CallTypes'
import { OperacaoSistema } from '../so/OperacaoSistema'
import { FilaEscalonador } from './FilaEscalonador'
import { TipoEscalonador } from './TypeEscaduler'
import { Processo } from '../process/Processo'
import { RespostaExecucaoEscalonador } from '../Interface/RespostaExecucaoEscalonador'
import { SubProcesso } from '../process/SubProcesso'

export class MetodoPrioridade extends FilaEscalonador {
  public adicionarSubProcesso(processo: Processo): void {
    this.filaProcessos.push(processo)
  }

  public executar(): RespostaExecucaoEscalonador | undefined {
    this.ordenarListaPorPrioridade()
    const elemento = this.filaSubProcessos.shift()

    if (elemento) {
      return {
        elemento,
        prioridade: elemento.getProcesso.getPrioridade,
        tempoExecucao: elemento.getProcesso.getTempoExecucao,
        tipo: TipoEscalonador.PRIORIDADE,
      }
    } else {
      return undefined
    }
  }

  private ordenarListaPorPrioridade() {
    this.filaProcessos.sort((a, b) => b.getPrioridade - a.getPrioridade)

    const processo = this.filaProcessos.shift()

    if (processo) {
      const subProcessos: SubProcesso[] = OperacaoSistema.chamadaSistema({
        tipoChamada: TipoChamadaSistema.LER_EM_MEMORIA,
        processo,
      }) as SubProcesso[]

      subProcessos.forEach((valor) => {
        this.filaSubProcessos.push(valor)
      })
    }
  }
}
