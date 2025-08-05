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
  const [activeFilters, setActiveFilters] = useState<{
    energy: boolean;
    critical: boolean;
  }>({
    energy: false,
    critical: false,
  });

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
  /**
   * PERFORMANCE: Filtros combinados memoizados
   * 
   * Aplica múltiplos filtros: busca por texto, sensores de energia
   * e status crítico, mantendo a estrutura hierárquica da árvore.
   */
  const filteredTree = useMemo(() => {
    let filtered = tree;

    // Filtro de busca por texto
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      
      const filterByText = (node: TreeNode): TreeNode | null => {
        const matchesSearch = node.name.toLowerCase().includes(searchLower);
        
        const filteredChildren = node.children
          .map(filterByText)
          .filter((child): child is TreeNode => child !== null);
        
        if (matchesSearch || filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren
          };
        }
        
        return null;
      };

      filtered = filtered
        .map(filterByText)
        .filter((node): node is TreeNode => node !== null);
    }

    // Filtro de sensores de energia
    if (activeFilters.energy) {
      const filterByEnergy = (node: TreeNode): TreeNode | null => {
        const isEnergySensor = node.sensorType === "energy";
        
        const filteredChildren = node.children
          .map(filterByEnergy)
          .filter((child): child is TreeNode => child !== null);
        
        if (isEnergySensor || filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren
          };
        }
        
        return null;
      };

      filtered = filtered
        .map(filterByEnergy)
        .filter((node): node is TreeNode => node !== null);
    }

    // Filtro de status crítico
    if (activeFilters.critical) {
      const filterByCritical = (node: TreeNode): TreeNode | null => {
        const isCritical = node.status === "alert";
        
        const filteredChildren = node.children
          .map(filterByCritical)
          .filter((child): child is TreeNode => child !== null);
        
        if (isCritical || filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren
          };
        }
        
        return null;
      };

      filtered = filtered
        .map(filterByCritical)
        .filter((node): node is TreeNode => node !== null);
    }

    return filtered;
  }, [tree, searchTerm, activeFilters]);

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
        
        <div className="filter-buttons">
          <button
            className={`filter-btn ${activeFilters.energy ? 'active energy' : ''}`}
            onClick={() => setActiveFilters(prev => ({ ...prev, energy: !prev.energy }))}
          >
            <span className="icon">⚡</span>
            <span>Energia</span>
          </button>
          
          <button
            className={`filter-btn ${activeFilters.critical ? 'active critical' : ''}`}
            onClick={() => setActiveFilters(prev => ({ ...prev, critical: !prev.critical }))}
          >
            <span className="icon">!</span>
            <span>Crítico</span>
          </button>
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