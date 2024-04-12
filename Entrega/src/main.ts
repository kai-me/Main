import { Processo } from './process/Processo'
import { TipoChamadaSistema } from './so/CallTypes'
import { OperacaoSistema } from './so/OperacaoSistema'


const p1 = OperacaoSistema.chamadaSistema({
  tipoChamada: TipoChamadaSistema.CRIAR_EM_MEMORIA,
  tamanhoProcesso: 15,
})

OperacaoSistema.chamadaSistema({
  tipoChamada: TipoChamadaSistema.ESCREVER_EM_MEMORIA,
  processo: p1 as Processo,
})
//-----------------------------------------------------------------------//
const p2 = OperacaoSistema.chamadaSistema({
  tipoChamada: TipoChamadaSistema.CRIAR_EM_MEMORIA,
  tamanhoProcesso: 14,
})

OperacaoSistema.chamadaSistema({
  tipoChamada: TipoChamadaSistema.ESCREVER_EM_MEMORIA,
  processo: p2 as Processo,
})
//-----------------------------------------------------------------------//
const p3 = OperacaoSistema.chamadaSistema({
  tipoChamada: TipoChamadaSistema.CRIAR_EM_MEMORIA,
  tamanhoProcesso: 20,
})

OperacaoSistema.chamadaSistema({
  tipoChamada: TipoChamadaSistema.ESCREVER_EM_MEMORIA,
  processo: p3 as Processo,
})
//-----------------------------------------------------------------------//
const p4 = OperacaoSistema.chamadaSistema({
  tipoChamada: TipoChamadaSistema.CRIAR_EM_MEMORIA,
  tamanhoProcesso: 150,
})

OperacaoSistema.chamadaSistema({
  tipoChamada: TipoChamadaSistema.ESCREVER_EM_MEMORIA,
  processo: p4 as Processo,
})
//-----------------------------------------------------------------------//
console.log(OperacaoSistema.gerenciadorHD.getHd);