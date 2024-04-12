import { Processo } from '../process/Processo'

export class GerenciadorHD {
  private hd: Processo[]
  constructor() {
    this.hd = []
  }

  public gravar(processo: Processo) {
    this.hd.push(processo)
  }

  public remover(processo: Processo) {
    this.hd = this.hd.filter((p) => p.getId !== processo.getId)
  }

  public get getHd() {
    return this.hd
  }
}
