import { Escalonador } from '../escalonador/Escaduler'
import { Nucleo } from './Nucleo'

export class GerenciadorCpu {
  private nucleos: Nucleo[]
  public static CLOCK: number = 2000
  public static NUMERO_DE_INSTRUCOES_POR_CLOCK: number = 7
  public static NUMERO_DE_NUCLEOS: number = 4
  private escalonador: Escalonador

  constructor(escalonador: Escalonador) {
    this.nucleos = new Array(GerenciadorCpu.NUMERO_DE_NUCLEOS)

    for (let indice = 0; indice < this.nucleos.length; indice++) {
      this.nucleos[indice] = new Nucleo(
        indice,
        GerenciadorCpu.NUMERO_DE_INSTRUCOES_POR_CLOCK,
      )
    }
    this.escalonador = escalonador
    this.iniciarClock()
  }

  private iniciarClock() {
    setInterval(() => {
      this.executarNucleos()
    }, GerenciadorCpu.CLOCK)
  }

  private executarNucleos() {
    this.nucleos.forEach((nucleo) => {
      const dados = this.escalonador.executar()

      if (dados) {
        if (!nucleo.subProcesso) {
          nucleo.subProcesso = dados.elemento
          nucleo.executar({
            prioridade: dados.prioridade,
            tempoExecucao: dados.tempoExecucao,
            tipo: dados.tipo,
          })
        }
      }
    })
    console.log('----------')
  }
}
