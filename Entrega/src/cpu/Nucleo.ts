import { RespostaExecucaoEscalonador } from '../Interface/RespostaExecucaoEscalonador'
import { TipoEscalonador } from '../escalonador/TypeEscaduler'
import { SubProcesso } from '../process/SubProcesso'

export class Nucleo {
  private id: number
  private numeroInstrucoesPorClock: number
  private _subProcesso: SubProcesso | undefined

  constructor(id: number, numeroInstrucoesPorClock: number) {
    this.id = id
    this.numeroInstrucoesPorClock = numeroInstrucoesPorClock

    this._subProcesso = undefined
  }

  public executar({
    prioridade,
    tempoExecucao,
    tipo,
  }: Omit<RespostaExecucaoEscalonador, 'elemento'>) {
    if (tipo === TipoEscalonador.FILA) {
      console.log(`Executando ${this._subProcesso?.getId}`)
    }

    if (tipo === TipoEscalonador.PRIORIDADE) {
      console.log(
        `Executando ${this._subProcesso?.getId} - Prioridade: ${prioridade !== 1}`,
      )
    }

    if (tipo === TipoEscalonador.ASCDESC) {
      console.log(
        `Executando ${this._subProcesso?.getId} - Tempo de execução: ${tempoExecucao}`,
      )
    }

    if (tipo === TipoEscalonador.LOTERIA) {
      console.log(`Executando ${this._subProcesso?.getId}`)
    }

    if (tipo === TipoEscalonador.ROUND_ROBIN) {
      console.log(`Executando ${this._subProcesso?.getId}`)
    }

    this.finalizar()
  }

  private finalizar() {
    if (
      this._subProcesso &&
      this._subProcesso.getProcesso.getInstrucoes >
        this._subProcesso.getProcesso.getInstrucoesExecutadas
    ) {
      this._subProcesso.finalizar()
      this._subProcesso.getProcesso.setInstrucoesExecutadas(
        this._subProcesso.getInstrucoes,
      )
      this._subProcesso.getProcesso.verificarConclusaoSubProcesso()
      this._subProcesso = undefined
    }
  }

  public get getId() {
    return this.id
  }

  public get subProcesso(): SubProcesso | undefined {
    return this._subProcesso
  }

  public set subProcesso(subProcesso: SubProcesso | undefined) {
    this._subProcesso = subProcesso
  }
}
