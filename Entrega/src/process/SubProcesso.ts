import { Processo } from './Processo'

export class SubProcesso {
  private id: string
  private instrucoes: number
  private processo: Processo
  private estaConcluido: boolean

  constructor(id: string, processo: Processo) {
    this.id = id
    this.instrucoes = 7
    this.processo = processo
    this.estaConcluido = false
  }

  public finalizar() {
    this.estaConcluido = true
  }

  public get getId(): string {
    return this.id
  }

  public get getInstrucoes() {
    return this.instrucoes
  }

  public get getEstaConcluido() {
    return this.estaConcluido
  }

  public get getProcesso() {
    return this.processo
  }
}
