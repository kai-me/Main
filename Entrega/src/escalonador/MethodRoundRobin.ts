import { TipoChamadaSistema } from '../so/CallTypes'
import { OperacaoSistema } from '../so/OperacaoSistema'
import { FilaEscalonador } from './FilaEscalonador'
import { TipoEscalonador } from './TypeEscaduler'
import { Processo } from '../process/Processo'
import { SubProcesso } from '../process/SubProcesso'
import { RespostaExecucaoEscalonador } from '../Interface/RespostaExecucaoEscalonador'
import { GerenciadorCpu } from '../cpu/GerenciadorCpu'

export class MetodoRoundRobin extends FilaEscalonador {
  private countExecutedSubProcess: number = 0
  private processInExecution: Processo | null = null

  constructor(private quantum: number) {
    super()
    this.quantum = quantum * GerenciadorCpu.NUMERO_DE_NUCLEOS
  }

  public adicionarSubProcesso(processo: Processo): void {
    this.filaProcessos.push(processo)

    const subProcessos = OperacaoSistema.chamadaSistema({
      tipoChamada: TipoChamadaSistema.LER_EM_MEMORIA,
      processo,
    }) as SubProcesso[]

    subProcessos.forEach((sp) => {
      this.filaSubProcessos.push(sp)
    })

    this.processInExecution = this.filaProcessos[0]
  }

  public executar(): RespostaExecucaoEscalonador | undefined {
    const elemento = this.filaSubProcessos.shift()

    if (elemento) {
      if (
        this.processInExecution?.getId &&
        elemento.getProcesso.getId === this.processInExecution.getId
      ) {
        this.countExecutedSubProcess++
      }
      if (
        this.processInExecution &&
        this.processInExecution.getTamanho < this.quantum
      ) {
        if (this.processInExecution.getTamanho === 1) {
          this.countExecutedSubProcess = 0
          this.filaProcessos.shift()
          this.processInExecution = this.filaProcessos[0]

          return {
            elemento,
            prioridade: elemento.getProcesso.getPrioridade,
            tempoExecucao: elemento.getProcesso.getTempoExecucao,
            tipo: TipoEscalonador.ROUND_ROBIN,
          }
        } else {
          this.countExecutedSubProcess = 0
          this.processInExecution = this.filaProcessos[0]

          return {
            elemento,
            prioridade: elemento.getProcesso.getPrioridade,
            tempoExecucao: elemento.getProcesso.getTempoExecucao,
            tipo: TipoEscalonador.ROUND_ROBIN,
          }
        }
      }
      if (this.countExecutedSubProcess === this.quantum) {
        this.rotacionar()
      }

      return {
        elemento,
        prioridade: elemento.getProcesso.getPrioridade,
        tempoExecucao: elemento.getProcesso.getTempoExecucao,
        tipo: TipoEscalonador.ROUND_ROBIN,
      }
    } else {
      return undefined
    }
  }

  public rotacionar() {
    if (
      this.processInExecution &&
      this.processInExecution.getInstrucoes >
        this.processInExecution.getInstrucoesExecutadas
    ) {
      const subProcessosPorProcesso = this.getSubProcessoPorProcesso()

      this.removerProcessoEsubProcesso()

      this.adicionarProcessoEsubProcessoNoFinal(subProcessosPorProcesso)

      this.processInExecution = this.filaProcessos[0]
      this.countExecutedSubProcess = 0
    }
  }

  private getSubProcessoPorProcesso() {
    return this.filaSubProcessos.filter(
      (sp) => sp.getProcesso.getId === this.processInExecution?.getId,
    )
  }

  private removerProcessoEsubProcesso() {
    this.filaProcessos.shift()

    this.filaSubProcessos = this.filaSubProcessos.filter(
      (sp) => sp.getProcesso.getId !== this.processInExecution?.getId,
    )
  }

  private adicionarProcessoEsubProcessoNoFinal(subProcessos: SubProcesso[]) {
    if (this.processInExecution) {
      this.filaProcessos.push(this.processInExecution)

      subProcessos.forEach((sp) => {
        this.filaSubProcessos.push(sp)
      })
    }
  }
}
