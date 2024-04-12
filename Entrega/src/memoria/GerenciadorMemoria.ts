import { EnderecoMemoria } from '../Interface/EnderecoMemoria'
import { Processo } from '../process/Processo'
import { SubProcesso } from '../process/SubProcesso'

export class GerenciadorMemoria {
  public memoriaFisica: (SubProcesso | undefined)[][]

  private memoriaLogica: Map<string, EnderecoMemoria>

  public static TAMANHO_PAGINA = 4
  public static TAMANHO_MEMORIA = 256

  constructor() {
    const quantidadePaginas =
      GerenciadorMemoria.TAMANHO_MEMORIA / GerenciadorMemoria.TAMANHO_PAGINA

    this.memoriaFisica = new Array(quantidadePaginas)
    for (let frame = 0; frame < this.memoriaFisica.length; frame++) {
      this.memoriaFisica[frame] = new Array<undefined>(
        GerenciadorMemoria.TAMANHO_PAGINA,
      )
    }

    this.memoriaLogica = new Map<string, EnderecoMemoria>()
  }

  public ler(processo: Processo) {
    const subProcessos: SubProcesso[] = []

    for (let i = 0; i < processo.getSubProcesso.length; i++) {
      const subProcessoIdSelecionado = processo.getSubProcesso[i]

      const enderecoSubProcesso = this.memoriaLogica.get(
        subProcessoIdSelecionado,
      )

      if (
        enderecoSubProcesso &&
        this.memoriaFisica[enderecoSubProcesso.quadro][
          enderecoSubProcesso.indice
        ]
      ) {
        subProcessos.push(
          this.memoriaFisica[enderecoSubProcesso.quadro][
            enderecoSubProcesso.indice
          ] as SubProcesso,
        )
      }
    }

    return subProcessos
  }

  public escrever(processo: Processo) {
    this.alocarProcessoComPaginacao(processo)
  }

  public swap(process: Processo): Processo[] {
    const sleeps: Processo[] = []
    const quantityPages = process.getTamanho / GerenciadorMemoria.TAMANHO_PAGINA

    let emptyFramesLength = this.encontrarPaginasVazias().length
    while (emptyFramesLength < quantityPages) {
      let firstProcess = null

      for (let i = 0; i < this.memoriaFisica.length; i++) {
        const element = this.memoriaFisica[i]

        if (element[0]) {
          const p = element[0].getProcesso
          if (!firstProcess) {
            firstProcess = p
          }

          if (firstProcess.getInputMemory > p.getInputMemory) {
            firstProcess = p
          }
        }
      }
      if (firstProcess) {
        const sleepProcess = this.excluir(firstProcess)
        emptyFramesLength = this.encontrarPaginasVazias().length
        sleeps.push(sleepProcess)
      }
    }

    return sleeps
  }

  public verificarEscrita(processo: Processo) {
    const framesVazios = this.encontrarPaginasVazias()
    if (
      framesVazios.length <
      processo.getTamanho / GerenciadorMemoria.TAMANHO_PAGINA
    ) {
      return false
    } else {
      return true
    }
  }

  private encontrarPaginasVazias() {
    const indicesFrames: number[] = []

    for (let frame = 0; frame < this.memoriaFisica.length; frame++) {
      const elemento = this.memoriaFisica[frame]

      if (!elemento[0]) {
        indicesFrames.push(frame)
      }
    }

    return indicesFrames
  }

  private alocarProcessoComPaginacao(processo: Processo) {
    const framesVazios = this.encontrarPaginasVazias()

    let contadorTamanho = 0

    for (let i = 0; i < framesVazios.length; i++) {
      const frame = framesVazios[i]
      const pagina = this.memoriaFisica[frame]

      let indicePagina = 0

      while (
        indicePagina < pagina.length &&
        contadorTamanho < processo.getTamanho
      ) {
        const subProcessoId = processo.getSubProcesso[contadorTamanho]

        this.memoriaFisica[frame][indicePagina] = new SubProcesso(
          subProcessoId,
          processo,
        )

        this.memoriaLogica.set(subProcessoId, {
          quadro: frame,
          indice: indicePagina,
        })

        contadorTamanho++
        indicePagina++
      }
    }

    this.imprimirMemoria()
  }

  public excluir(processo: Processo) {
    const subProcesso = processo.getSubProcesso

    this.memoriaFisica.forEach((pagina, indice, array) => {
      if (pagina[0]?.getProcesso.getId === processo.getId) {
        array[indice] = new Array(GerenciadorMemoria.TAMANHO_PAGINA)
      }
    })

    subProcesso.forEach((sb) => {
      this.memoriaLogica.delete(sb)
    })

    this.imprimirMemoria()

    return processo
  }

  private imprimirMemoria() {
    console.log(
      '----------------------------------------------------------------------',
    )
    for (let pagina = 0; pagina < this.memoriaFisica.length; pagina++) {
      const elemento = this.memoriaFisica[pagina].map(
        (subProcesso) => subProcesso?.getId,
      )

      console.log(
        pagina +
          ' ' +
          elemento.map((e) => {
            if (e) {
              return e
            } else {
              return ' - '
            }
          }),
      )
    }
  }
}
