import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class KnowledgeService {
  constructor(private prisma: PrismaService) {}

  async search(tenantId: string, query: string) {
    if (!query || query.length < 2) {
      // Retorna entradas prioritárias (destaques)
      return this.prisma.knowledgeEntry.findMany({
        where: { tenantId, priority: { gt: 0 } },
        take: 5,
        orderBy: { priority: 'desc' },
      });
    }

    const q = query.toLowerCase();
    const all = await this.prisma.knowledgeEntry.findMany({
      where: { tenantId },
    });

    // Busca fuzzy: match por intent, keywords ou conteúdo da resposta
    const scored = all
      .map(entry => {
        let score = 0;
        if (entry.intent.toLowerCase().includes(q)) score += 10;
        if (entry.keywords?.some(k => q.includes(k.toLowerCase()) || k.toLowerCase().includes(q))) score += 8;
        if (entry.answer.toLowerCase().includes(q)) score += 5;
        return { ...entry, score };
      })
      .filter(e => e.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return scored.length > 0 ? scored : all.filter(e => e.priority > 0).slice(0, 3);
  }
}