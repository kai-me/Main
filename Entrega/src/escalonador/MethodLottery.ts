import { TipoChamadaSistema } from '../so/CallTypes'
import { OperacaoSistema } from '../so/OperacaoSistema'
import { FilaEscalonador } from './FilaEscalonador'
import { TipoEscalonador } from './TypeEscaduler'
import { Processo } from '../process/Processo'
import { RespostaExecucaoEscalonador } from '../Interface/RespostaExecucaoEscalonador'
import { SubProcesso } from '../process/SubProcesso'

export class MetodoLoteria extends FilaEscalonador {
  public adicionarSubProcesso(processo: Processo): void {
    this.filaProcessos.push(processo)
  }

  public executar(): RespostaExecucaoEscalonador | undefined {
    this.primeiroProcessoAleatorio()

    const elemento = this.filaSubProcessos.shift()

    if (elemento) {
      return {
        elemento,
        prioridade: elemento.getProcesso.getPrioridade,
        tempoExecucao: elemento.getProcesso.getTempoExecucao,
        tipo: TipoEscalonador.LOTERIA,
      }
    } else {
      return undefined
    }
  }

  private primeiroProcessoAleatorio() {
    const indiceAleatorio = Math.floor(
      Math.random() * this.filaProcessos.length,
    )
    const processo = this.filaProcessos[indiceAleatorio]

    if (processo) {
      const subProcessos: SubProcesso[] = OperacaoSistema.chamadaSistema({
        tipoChamada: TipoChamadaSistema.LER_EM_MEMORIA,
        processo,
      }) as SubProcesso[]

      subProcessos.forEach((valor) => {
        this.filaSubProcessos.push(valor)
      })

      this.filaProcessos = this.filaProcessos.filter(
        (p) => p.getId !== processo.getId,
      )
    }
  }
}
