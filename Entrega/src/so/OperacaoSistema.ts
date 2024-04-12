import { Escalonador } from '../escalonador/Escaduler'
import { MetodoAscDesc } from '../escalonador/MethodAscDesc'
import { MethodQueue } from '../escalonador/MethodQueue'
import { MethodLottery } from '../escalonador/MethodLottery'
import { MethodPriority } from '../escalonador/MethodPriority'
import { MethodRoundRobin } from '../escalonador/MethodRoundRobin'
import { GerenciadorHD } from '../memoria/GerenciadorHD'
import { GerenciadorMemoria } from '../memoria/GerenciadorMemoria'
import { Processo } from '../process/Processo'
import { SubProcesso } from '../process/SubProcesso'
import { TipoChamadaSistema } from './CallTypes'

interface PropsChamadaSistema {
  tipoChamada: TipoChamadaSistema
  tamanhoProcesso?: number
  processo?: Processo
  prioridade?: number
}

export class OperacaoSistema {
  public static gerenciadorMemoria = new GerenciadorMemoria()
  public static gerenciadorHD = new GerenciadorHD()
  public static escalonador: Escalonador = new MethodLottery()

  public static chamadaSistema({
    tipoChamada,
    tamanhoProcesso,
    processo,
    prioridade,
  }: PropsChamadaSistema): Processo | void | SubProcesso[] {
    if (
      tipoChamada === TipoChamadaSistema.CRIAR_EM_MEMORIA &&
      tamanhoProcesso &&
      !processo
    ) {
      return new Processo(tamanhoProcesso, prioridade)
    }

    if (tipoChamada === TipoChamadaSistema.ESCREVER_EM_MEMORIA && processo) {
      const checarEscrita = this.gerenciadorMemoria.verificarEscrita(processo)

      if (checarEscrita) {
        this.gerenciadorMemoria.escrever(processo)
        this.escalonador.adicionarSubProcesso(processo)
      } else {
        const processos = this.gerenciadorMemoria.swap(processo)

        for (let i = 0; i < processos.length; i++) {
          const elemento = processos[i]
          this.gerenciadorHD.gravar(elemento)
          this.escalonador.encerrar(elemento)
        }

        this.gerenciadorMemoria.escrever(processo)
        this.escalonador.adicionarSubProcesso(processo)
      }
    }

    if (tipoChamada === TipoChamadaSistema.LER_EM_MEMORIA && processo) {
      return this.gerenciadorMemoria.ler(processo)
    }

    if (tipoChamada === TipoChamadaSistema.EXCLUIR_EM_MEMORIA && processo) {
      this.escalonador.encerrar(processo)
      return this.gerenciadorMemoria.excluir(processo)
    }

    if (tipoChamada === TipoChamadaSistema.PARAR && processo) {
      this.escalonador.encerrar(processo)
    }

    if (tipoChamada === TipoChamadaSistema.ACORDAR && processo) {
      const checarEscrita = this.gerenciadorMemoria.verificarEscrita(processo)

      if (checarEscrita) {
        this.gerenciadorMemoria.escrever(processo)
        this.escalonador.adicionarSubProcesso(processo)
        this.gerenciadorHD.remover(processo)
      } else {
        const processos = this.gerenciadorMemoria.swap(processo)

        for (let i = 0; i < processos.length; i++) {
          const elemento = processos[i]
          this.gerenciadorHD.gravar(elemento)
          this.escalonador.encerrar(elemento)
        }
        processo.setinputmemory = Date.now()

        this.gerenciadorMemoria.escrever(processo)
        this.escalonador.adicionarSubProcesso(processo)
        this.gerenciadorHD.remover(processo)
      }
    }
  }
}
