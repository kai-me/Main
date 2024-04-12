import { TipoChamadaSistema } from '../so/CallTypes'
import { OperacaoSistema } from '../so/OperacaoSistema'
import { FilaEscalonador } from './FilaEscalonador'
import { TipoEscalonador } from './TypeEscaduler'
import { Processo } from '../process/Processo'
import { RespostaExecucaoEscalonador } from '../Interface/RespostaExecucaoEscalonador'
import { SubProcesso } from '../process/SubProcesso'

export class MetodoFila extends FilaEscalonador {
  public adicionarSubProcesso(processo: Processo): void {
    this.filaProcessos.push(processo)

    const subProcessos = OperacaoSistema.chamadaSistema({
      tipoChamada: TipoChamadaSistema.LER_EM_MEMORIA,
      processo,
    }) as SubProcesso[]

    subProcessos.forEach((sp) => {
      this.filaSubProcessos.push(sp)
    })
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
}
