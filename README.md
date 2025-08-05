# Tractian Asset Tree Viewer

Uma aplicação React moderna para visualização hierárquica de ativos industriais, desenvolvida como parte do desafio técnico da Tractian.

## Demonstração em Vídeo

O vídeo abaixo apresenta a aplicação abrindo os dados de cada empresa e utilizando os filtros disponíveis:

[![Assista no YouTube](https://img.youtube.com/vi/gddkRDNqvH0/0.jpg)](https://youtu.be/gddkRDNqvH0)

🔗 [Assista no YouTube](https://youtu.be/gddkRDNqvH0)

---

## Pontos que eu melhoraria com mais tempo

Se eu tivesse mais tempo disponível, gostaria de implementar as seguintes melhorias no projeto:

- **Tratamento completo de erros**: adicionar feedback visual para requisições com falha (como mensagens de erro em tela).
- **Skeleton Loaders**: mostrar carregamentos esqueléticos ao invés de loaders genéricos, melhorando a experiência de usuário.
- **Testes automatizados**: incluir testes unitários e de integração utilizando ferramentas como Vitest ou Testing Library.
- **Responsividade total**: adaptar o layout para dispositivos móveis com maior refinamento.
- **Aprimoramento do design**: melhorar o visual com design mais moderno e consistente.
- **Paginação e busca**: adicionar funcionalidades de paginação e busca nos ativos e localizações.
- **Melhor organização do código**: separar lógica de negócios e UI de forma mais granular, facilitando a escalabilidade do projeto.

---



## Funcionalidades

### Core Features
- **Árvore de Ativos**: Visualização hierárquica de locations, assets e components
- **Busca Inteligente**: Filtro em tempo real com busca recursiva
- **Filtros Avançados**: 
  - Sensores de Energia (⚡)
  - Status Crítico (!)
- **Troca de Empresas**: Integração com API fake para múltiplas empresas
- **Detalhes de Ativos**: Painel lateral com informações detalhadas

### Performance
- **Renderização Preguiçosa**: Apenas nós raíz expandidos por padrão
- **Memoização Inteligente**: React.memo com comparação customizada
- **Filtros Otimizados**: useMemo para cálculos de filtragem
- **Loading Granular**: Estados de carregamento por painel

## Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **CSS Modules** para estilização
- **API Integration** com fallback local

## Instalação

```bash
# Clone o repositório
git clone [url-do-repo]

# Instale as dependências
npm install
# ou
pnpm install

# Execute em desenvolvimento
npm run dev
# ou
pnpm dev
```

## Como Usar

1. **Seleção de Empresa**: Clique nos botões no header para trocar entre empresas
2. **Navegação na Árvore**: 
   - Clique nos nós para expandir/recolher
   - Clique em componentes (folhas) para ver detalhes
3. **Busca**: Digite no campo de busca para filtrar ativos
4. **Filtros**: Use os botões de filtro para isolar sensores específicos

## Arquitetura

```bash
src/
├── components/ # Componentes React
│ ├── AssetTree.tsx # Árvore principal
│ ├── TreeNodeView.tsx # Nós da árvore
│ ├── AssetDetails.tsx # Painel de detalhes
│ └── Header.tsx # Header com empresas
├── hooks/ # Custom hooks
│ └── useAssetData.ts # Gerenciamento de estado
├── services/ # Integração com API
│ └── api.ts # Chamadas da API
├── utils/ # Utilitários
│ └── buildTree.ts # Construção da árvore
└── types/ # Definições TypeScript
```

## Design

- Interface moderna e responsiva
- Gradientes e sombras elegantes
- Animações suaves
- Cores consistentes com a marca Tractian
- Loading states com spinners animados

## Desenvolvimento

```bash
# Lint
npm run lint

# Build
npm run build

# Preview
npm run preview
```

## Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktop (recomendado)
- Tablet
- Mobile (layout adaptativo)

---

