/* eslint-disable @typescript-eslint/no-unused-vars */
import { RespostaExecucaoEscalonador } from '../Interface/RespostaExecucaoEscalonador'
import { GerenciadorCpu } from '../cpu/GerenciadorCpu'
import { Processo } from '../process/Processo'
import { SubProcesso } from '../process/SubProcesso'

export abstract class Escalonador {
  private gerenciadorCpu: GerenciadorCpu

  constructor() {
    this.gerenciadorCpu = new GerenciadorCpu(this)
  }

  public abstract adicionarSubProcesso(processo: Processo): void
  public abstract executar(): RespostaExecucaoEscalonador | undefined
  public abstract encerrar(processo: Processo): void

  public get getGerenciadorCpu() {
    return this.gerenciadorCpu
  }
}
