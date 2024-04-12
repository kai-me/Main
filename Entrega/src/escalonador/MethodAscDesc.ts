import { Processo } from '../process/Processo'
import { TipoChamadaSistema } from '../so/CallTypes'
import { OperacaoSistema } from '../so/OperacaoSistema'
import { FilaEscalonador } from './FilaEscalonador'
import { SubProcesso } from '../process/SubProcesso'
import { RespostaExecucaoEscalonador } from '../Interface/RespostaExecucaoEscalonador'
import { TipoEscalonador } from './TypeEscaduler'

export class MetodoAscDesc extends FilaEscalonador {
  private ordem: 'ASC' | 'DESC'

  constructor(ordem: 'ASC' | 'DESC' = 'ASC') {
    super()
    this.ordem = ordem
  }

  public adicionarSubProcesso(processo: Processo): void {
    this.filaProcessos.push(processo)
  }

  public executar(): RespostaExecucaoEscalonador | undefined {
    this.ordenarListaPorTempoDeExecucao()

    const elemento = this.filaSubProcessos.shift()

    if (elemento) {
      return {
        elemento,
        prioridade: elemento.getProcesso.getPrioridade,
        tempoExecucao: elemento.getProcesso.getTempoExecucao,
        tipo: TipoEscalonador.ASCDESC,
      }
    } else {
      return undefined
    }
  }

  private ordenarListaPorTempoDeExecucao() {
    if (this.ordem === 'ASC') {
      this.filaProcessos.sort((a, b) => a.getTempoExecucao - b.getTempoExecucao)

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
    } else {
      this.filaProcessos.sort((a, b) => b.getTempoExecucao - a.getTempoExecucao)

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
}
