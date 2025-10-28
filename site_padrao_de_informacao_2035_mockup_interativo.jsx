import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, Search, Play, BookOpen, Sparkles, Wand2, Bot, Clock, Brain, Focus, BarChart4, ArrowRight, AlertTriangle, Shield } from "lucide-react";
import { motion } from "framer-motion";

// Mock data de conteúdo estruturado
const resumo30s = `Segurança cibernética industrial eficaz começa com gestão (políticas, processos, pessoas) e só depois vai para controles técnicos. O sistema adapta conteúdo por perfil, contexto e objetivo — reduz carga cognitiva, prioriza riscos e gera ação.`;

const microHistoria = {
  titulo: "Por que começamos pela gestão?",
  narrativa:
    "Em 2017, uma planta similar sofreu uma parada de 18h por falha de segmentação. Um checklist de gestão teria evitado 3 decisões ruins. Resultado: prejuízo de US$ 1,2M."
};

const passosAcao = [
  { id: 1, texto: "Definir política e papéis (ISA/IEC 62443-2-1)", impacto: "alto" },
  { id: 2, texto: "Mapear zonas e conduítes", impacto: "alto" },
  { id: 3, texto: "Priorizar riscos e estabelecer metas", impacto: "médio" },
  { id: 4, texto: "Especificar requisitos (CRS) por zona", impacto: "alto" },
  { id: 5, texto: "Implantar controles e instrumentar monitoramento", impacto: "alto" }
];

const dicas = [
  { title: "Contexto primeiro", body: "Mostre só o que o usuário precisa agora; o resto fica a um clique." },
  { title: "Chunking inteligente", body: "Quebre conteúdo em blocos curtos conectados logicamente." },
  { title: "Narrativas", body: "Explique o porquê com micro-histórias que unem dado e decisão." },
  { title: "Multimodal", body: "Combine texto, voz, visual e simulação simples." },
  { title: "Curadoria contínua", body: "Evite acúmulo. Consolide e remova redundâncias." }
];

// Mock de riscos para o Mapa de Riscos (probabilidade 1-5 x impacto 1-5)
const riscos = [
  { id: 1, titulo: "Acesso remoto sem MFA", zona: "DMZ", prob: 4, impacto: 4 },
  { id: 2, titulo: "Firmware desatualizado PLC", zona: "Zona 1", prob: 3, impacto: 5 },
  { id: 3, titulo: "Conduíte sem inspeção", zona: "Conduíte A", prob: 2, impacto: 4 },
  { id: 4, titulo: "Backups não testados", zona: "Zona 2", prob: 3, impacto: 3 },
  { id: 5, titulo: "Credenciais compartilhadas", zona: "Zona 1", prob: 5, impacto: 3 },
  { id: 6, titulo: "Segmentação insuficiente", zona: "Zona 2", prob: 2, impacto: 5 },
  { id: 7, titulo: "Estação de engenharia exposta", zona: "DMZ", prob: 3, impacto: 4 }
];

export default function App() {
  const [densidade, setDensidade] = useState([60]);
  const [modoProfundo, setModoProfundo] = useState(false);
  const [itensConcluidos, setItensConcluidos] = useState<number[]>([]);
  const [filtro, setFiltro] = useState("");
  const [filtroZona, setFiltroZona] = useState("");
  const [scoreMin, setScoreMin] = useState([9]);

  const passosFiltrados = useMemo(() => {
    return passosAcao.filter(p => p.texto.toLowerCase().includes(filtro.toLowerCase()));
  }, [filtro]);

  // Derivações para o Mapa de Riscos
  const riscosFiltrados = useMemo(() => {
    const min = scoreMin[0];
    return riscos.filter(r =>
      (filtroZona ? r.zona.toLowerCase().includes(filtroZona.toLowerCase()) : true) &&
      (r.prob * r.impacto >= min)
    );
  }, [filtroZona, scoreMin]);

  const matriz = useMemo(() => {
    // 5x5 inicializado com arrays de riscos
    const grid: { items: typeof riscos }[][] = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ({ items: [] as typeof riscos })));
    riscosFiltrados.forEach(r => {
      const p = Math.min(Math.max(r.prob, 1), 5);
      const i = Math.min(Math.max(r.impacto, 1), 5);
      // índice da matriz: impacto (linhas), prob (colunas)
      grid[i - 1][p - 1].items.push(r);
    });
    return grid;
  }, [riscosFiltrados]);

  function corPorScore(score: number) {
    if (score >= 16) return "bg-red-100 border-red-300";
    if (score >= 11) return "bg-orange-100 border-orange-300";
    if (score >= 6) return "bg-yellow-100 border-yellow-300";
    return "bg-emerald-100 border-emerald-300";
  }

  function alternarChecklist(id: number) {
    setItensConcluidos(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white text-slate-900">
        {/* Hero */}
        <section className="px-6 md:px-12 lg:px-24 py-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-5xl mx-auto">
            <Badge className="mb-4 gap-2 text-sm"><Sparkles className="w-4 h-4"/>Padrão de Informação 2035</Badge>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
              Informação mínima para <span className="underline decoration-wavy decoration-sky-400">máxima ação</span>
            </h1>
            <p className="mt-4 text-slate-600 max-w-3xl">Um modelo de apresentação otimizada: contextual, adaptativa, multimodal e curada. Feito para reduzir carga cognitiva e acelerar decisões.</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="rounded-2xl"><Play className="w-4 h-4 mr-2"/>Ver demo de 30s</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[640px]">
                  <DialogHeader>
                    <DialogTitle>Resumo em 30 segundos</DialogTitle>
                  </DialogHeader>
                  <div className="prose prose-slate">
                    <p className="text-lg leading-relaxed">{resumo30s}</p>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="rounded-2xl"><BookOpen className="w-4 h-4 mr-2"/>Guia de design cognitivo</Button>
            </div>
          </motion.div>
        </section>

        {/* Controles cognitivos */}
        <section className="px-6 md:px-12 lg:px-24">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Focus className="w-4 h-4"/> Foco & Densidade</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">Controle o quanto ver: do ultrarresumo ao modo detalhado.</p>
                <div>
                  <Slider value={densidade} onValueChange={setDensidade} step={10} min={0} max={100}/>
                  <div className="text-xs text-slate-500 mt-2">Nível atual: {densidade}%</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Modo leitura profunda</span>
                  <Switch checked={modoProfundo} onCheckedChange={setModoProfundo}/>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Brain className="w-4 h-4"/> Adaptação por Perfil</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600">Selecione seu objetivo e receba apenas o necessário.</p>
                <Tabs defaultValue="acao">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="acao">Ação</TabsTrigger>
                    <TabsTrigger value="aprendizado">Aprendizado</TabsTrigger>
                    <TabsTrigger value="auditoria">Auditoria</TabsTrigger>
                  </TabsList>
                  <TabsContent value="acao" className="text-sm text-slate-700">Checklist minimalista e playbooks prontos.</TabsContent>
                  <TabsContent value="aprendizado" className="text-sm text-slate-700">Mapas conceituais e simulações curtas.</TabsContent>
                  <TabsContent value="auditoria" className="text-sm text-slate-700">Evidências, métricas e trilhas de decisão.</TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><BarChart4 className="w-4 h-4"/> Curadoria & Sinal</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600">Remoção de redundâncias e consolidação de aprendizados.</p>
                <ul className="text-sm list-disc ml-5 space-y-1">
                  <li>Consolida versões e destaca diferenças.</li>
                  <li>Promove conteúdo com maior impacto.</li>
                  <li>Arquiva o resto com recuperação sob demanda.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Apresentação principal com narrativa e chunking */}
        <section className="px-6 md:px-12 lg:px-24 py-10">
          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="rounded-2xl shadow-sm lg:col-span-2">
              <CardHeader className="pb-1"><CardTitle className="text-base flex items-center gap-2"><Clock className="w-4 h-4"/> Resumo em 30s</CardTitle></CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">{resumo30s}</p>
                <div className="mt-4 flex gap-2">
                  <Badge variant="secondary">Gestão primeiro</Badge>
                  <Badge variant="secondary">Risco → ação</Badge>
                  <Badge variant="secondary">Carga cognitiva baixa</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-1"><CardTitle className="text-base flex items-center gap-2"><Bot className="w-4 h-4"/> Assistente Contextual</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600">Converse para obter exatamente o que precisa.</p>
                <div className="flex items-center gap-2">
                  <Input placeholder="Pergunte algo… ex: gerar checklist"/>
                  <Button className="rounded-xl"><Wand2 className="w-4 h-4"/></Button>
                </div>
                <p className="text-xs text-slate-500">Sugestões: “Resuma por papel”, “Mostrar lacunas”, “Exportar plano”.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Micro-narrativa + Simulação */}
        <section className="px-6 md:px-12 lg:px-24 py-4">
          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="rounded-2xl shadow-sm lg:col-span-1">
              <CardHeader className="pb-1"><CardTitle className="text-base flex items-center gap-2"><BookOpen className="w-4 h-4"/> Micro‑narrativa</CardTitle></CardHeader>
              <CardContent>
                <h3 className="font-medium text-slate-800">{microHistoria.titulo}</h3>
                <p className="text-sm text-slate-600 mt-2">{microHistoria.narrativa}</p>
                <div className="mt-3 text-xs text-slate-500">Lição: gestão reduz decisões ruins quando a pressão é alta.</div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm lg:col-span-2">
              <CardHeader className="pb-1"><CardTitle className="text-base flex items-center gap-2"><Play className="w-4 h-4"/> Simulação interativa (conceito)</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl grid place-items-center text-sm text-slate-500">
                  (Área para visual interativo/RA — evento → impacto → mitigação)
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>Propagação</Badge>
                  <Badge>Isolamento</Badge>
                  <Badge>Recuperação</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Checklist acionável com filtro (chunking + priorização) */}
        <section className="px-6 md:px-12 lg:px-24 py-8">
          <div className="max-w-6xl mx-auto">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <CardTitle className="text-base flex items-center gap-2"><Search className="w-4 h-4"/> Checklist de Ação (filtrável)</CardTitle>
                <div className="flex items-center gap-3">
                  <Input placeholder="Filtrar por palavra‑chave…" value={filtro} onChange={(e) => setFiltro(e.target.value)} className="w-64"/>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="cursor-help">Priorize pelo impacto</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      Itens marcados como "alto" devem vir antes para maximizar ROI cognitivo.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {passosFiltrados.map((p) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={`p-4 rounded-xl border flex items-start gap-3 ${p.impacto === 'alto' ? 'border-sky-200 bg-sky-50' : 'border-slate-200 bg-white'}`}>
                      <button onClick={() => alternarChecklist(p.id)} className={`mt-0.5 rounded-full border w-5 h-5 grid place-items-center ${itensConcluidos.includes(p.id) ? 'bg-sky-500 text-white border-sky-500' : 'border-slate-300'}`}>
                        {itensConcluidos.includes(p.id) && <Check className="w-3 h-3"/>}
                      </button>
                      <div className="text-sm">
                        <div className="font-medium text-slate-800 flex items-center gap-2">{p.texto} <Badge variant="secondary" className="capitalize">{p.impacto}</Badge></div>
                        <div className="text-xs text-slate-500 mt-1">Dica: mantenha evidência mínima e mensurável.</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Mapa de Riscos (probabilidade x impacto) */}
        <section className="px-6 md:px-12 lg:px-24 py-8">
          <div className="max-w-6xl mx-auto">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Mapa de Riscos</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Score mínimo</Badge>
                    <div className="w-48">
                      <Slider value={scoreMin} onValueChange={setScoreMin} step={1} min={1} max={25}/>
                      <div className="text-xs text-slate-500 mt-1">Atual: {scoreMin}</div>
                    </div>
                  </div>
                  <Input className="w-56" placeholder="Filtrar por zona/conduíte…" value={filtroZona} onChange={(e) => setFiltroZona(e.target.value)} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Legenda */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded border bg-emerald-100 border-emerald-300"/>1–5</span>
                  <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded border bg-yellow-100 border-yellow-300"/>6–10</span>
                  <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded border bg-orange-100 border-orange-300"/>11–15</span>
                  <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded border bg-red-100 border-red-300"/>16–25</span>
                  <span className="inline-flex items-center gap-2 ml-4"><Shield className="w-3 h-3"/>score = probabilidade × impacto</span>
                </div>

                {/* Grade 5x5 */}
                <div className="overflow-auto">
                  <div className="min-w-[640px] grid grid-cols-6 gap-2">
                    {/* cabeçalho das colunas */}
                    <div></div>
                    {[1,2,3,4,5].map(p => (
                      <div key={p} className="text-center text-xs text-slate-500">Prob {p}</div>
                    ))}

                    {/* linhas (impacto 5 no topo) */}
                    {[5,4,3,2,1].map(i => (
                      <React.Fragment key={i}>
                        <div className="flex items-center text-xs text-slate-500">Impacto {i}</div>
                        {[1,2,3,4,5].map(p => {
                          const items = matriz[i-1][p-1].items;
                          const score = i * p;
                          return (
                            <div key={`${i}-${p}`} className={`p-3 rounded-lg border ${corPorScore(score)} transition-colors`}> 
                              <div className="text-sm font-medium">{items.length}</div>
                              <div className="text-[10px] text-slate-600">{score}</div>
                            </div>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Lista de riscos filtrados */}
                <div className="grid md:grid-cols-2 gap-3">
                  {riscosFiltrados.map(r => (
                    <div key={r.id} className="p-3 rounded-xl border bg-white flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-600"/>
                      <div className="text-sm">
                        <div className="font-medium text-slate-800">{r.titulo}</div>
                        <div className="text-xs text-slate-500">Zona: {r.zona} • Prob: {r.prob} • Impacto: {r.impacto} • Score: {r.prob * r.impacto}</div>
                      </div>
                    </div>
                  ))}
                  {riscosFiltrados.length === 0 && (
                    <div className="text-sm text-slate-500">Nenhum risco com o filtro atual.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Conteúdo expansível (mostrar sob demanda) */}
        <section className="px-6 md:px-12 lg:px-24 pb-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
            <Card className="rounded-2xl shadow-sm lg:col-span-2">
              <CardHeader className="pb-1"><CardTitle className="text-base flex items-center gap-2"><ArrowRight className="w-4 h-4"/> Expandir quando necessário</CardTitle></CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Mapa conceitual (visão geral → detalhes)</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-3 gap-3 text-sm">
                        <div className="p-3 rounded-lg bg-slate-50">Políticas & Papéis</div>
                        <div className="p-3 rounded-lg bg-slate-50">Zonas & Conduítes</div>
                        <div className="p-3 rounded-lg bg-slate-50">Requisitos & Controles</div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Glossário essencial (10 termos)</AccordionTrigger>
                    <AccordionContent>
                      <ul className="text-sm list-disc ml-5 space-y-1">
                        <li>IACS: Sistemas Industriais de Automação e Controle.</li>
                        <li>CRS: Conjunto de Requisitos de Segurança por zona.</li>
                        <li>DMZ industrial: camada de separação entre TI e TO.</li>
                        {/* ...mais itens conforme necessidade */}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Referências rápidas</AccordionTrigger>
                    <AccordionContent>
                      <div className="text-sm text-slate-600">Links para normas, playbooks e evidências (ex.: 62443-2-1, 3-3, 4-2).</div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-1"><CardTitle className="text-base flex items-center gap-2"><Sparkles className="w-4 h-4"/> Princípios do Padrão</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {dicas.map((d, i) => (
                  <div key={i} className="p-3 rounded-xl border bg-white">
                    <div className="text-sm font-medium">{d.title}</div>
                    <div className="text-xs text-slate-600 mt-1">{d.body}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 md:px-12 lg:px-24 py-8 border-t bg-white/60">
          <div className="max-w-6xl mx-auto text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between gap-3">
            <div>© 2035 — Padrão de Informação Otimizada</div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1"><Sparkles className="w-4 h-4"/>IA Contextual</span>
              <span className="inline-flex items-center gap-1"><Brain className="w-4 h-4"/>Design Cognitivo</span>
              <span className="inline-flex items-center gap-1"><Focus className="w-4 h-4"/>Curadoria Contínua</span>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
