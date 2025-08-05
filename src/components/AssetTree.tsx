import { useState, useMemo } from "react";
import type { TreeNode } from "../types";
import { TreeNodeView } from "./TreeNodeView";

type AssetTreeProps = {
  tree: TreeNode[];
  selectedAsset: TreeNode | null;
  onAssetSelect: (asset: TreeNode) => void;
  selectedCompanyName: string;
  loading?: boolean;
};

export const AssetTree = ({ tree, selectedAsset, onAssetSelect, selectedCompanyName, loading = false }: AssetTreeProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * PERFORMANCE: Filtro memoizado da árvore de ativos
   * 
   * Esta função utiliza useMemo para evitar recálculos desnecessários
   * quando apenas o selectedAsset muda (que não afeta a filtragem).
   * 
   * Estratégia de filtragem:
   * - Busca recursiva em toda a hierarquia
   * - Mantém nós pais quando filhos correspondem ao filtro
   * - Preserva a estrutura da árvore durante a filtragem
   */
  const filteredTree = useMemo(() => {
    if (!searchTerm.trim()) {
      return tree;
    }

    const searchLower = searchTerm.toLowerCase();
    
    const filterNode = (node: TreeNode): TreeNode | null => {
      const matchesSearch = node.name.toLowerCase().includes(searchLower);
      
      const filteredChildren = node.children
        .map(filterNode)
        .filter((child): child is TreeNode => child !== null);
      
      if (matchesSearch || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren
        };
      }
      
      return null;
    };

    return tree
      .map(filterNode)
      .filter((node): node is TreeNode => node !== null);
  }, [tree, searchTerm]);

  return (
    <div className="left-panel">
      <div className="panel-header">
        <h2>Ativos / {selectedCompanyName} Unit</h2>
      </div>
      <div className="search-container">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar ativos, locais ou componentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
      <div className="tree-container">
        {loading ? (
          <div className="tree-loading">
            <div className="loading-spinner"></div>
            <p>Carregando ativos...</p>
          </div>
        ) : filteredTree.length > 0 ? (
          filteredTree.map((node) => (
            <TreeNodeView 
              key={node.id} 
              node={node} 
              onSelect={onAssetSelect}
              selectedAsset={selectedAsset}
            />
          ))
        ) : (
          <div className="no-results">
            <p>Nenhum ativo encontrado para "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}; 