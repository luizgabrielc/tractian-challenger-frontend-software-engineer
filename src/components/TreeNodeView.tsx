import { useState, memo } from "react";
import type { TreeNode } from "../types";

type TreeNodeProps = {
  node: TreeNode;
  level?: number;
  onSelect?: (node: TreeNode) => void;
  selectedAsset?: TreeNode | null;
};

const getIcon = (type: TreeNode["type"]) => {
  switch (type) {
    case "location":
      return "/location.png";
    case "asset":
      return "/asset.png";
    case "component":
      return "/component.png";
  }
};

const getStatusIcon = (node: TreeNode) => {
  if (node.sensorType === "energy") {
    return <span className="status-icon energy">⚡</span>;
  }
  if (node.status === "alert") {
    return <span className="status-icon critical">●</span>;
  }
  if (node.status === "operating") {
    return <span className="status-icon normal">●</span>;
  }
  return null;
};

const TreeNodeViewComponent = ({ node, level = 0, onSelect, selectedAsset }: TreeNodeProps) => {
  /**
   * PERFORMANCE: Lazy-render dos nodes da árvore
   * 
   * Somente os nodes raíz são expandidos por padrão para reduzir
   * drasticamente o número de elementos renderizados inicialmente.
   * Isso melhora significativamente a performance ao trocar entre empresas.
   */
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedAsset?.id === node.id;

  const handleClick = () => {
    if (hasChildren) {
      // Se não for leaf, apenas alterna expansão
      setIsExpanded(!isExpanded);
      return;
    }
    // Apenas nodes leaf disparam a seleção de detalhes
    if (onSelect) {
      onSelect(node);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="tree-node">
      <div 
        className={`tree-item ${isSelected ? "selected" : ""}`}
        onClick={handleClick}
        style={{ marginLeft: `${level * 20}px` }}
      >
        <div className="tree-item-content">
          {hasChildren && (
            <button 
              className="expand-btn"
              onClick={handleToggle}
            >
              {isExpanded ? "▼" : "▶"}
            </button>
          )}
          <img src={getIcon(node.type)} width={16} height={16} alt={node.type} />
          <span className="node-name">{node.name}</span>
          {getStatusIcon(node)}
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className="children">
          {node.children.map((child) => (
            <TreeNodeView 
              key={child.id} 
              node={child} 
              level={level + 1}
              onSelect={onSelect}
              selectedAsset={selectedAsset}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * PERFORMANCE: Função de comparação para memoização de nós
 * 
 * Esta função determina quando um TreeNodeView deve ser re-renderizado.
 * Re-renderiza apenas se:
 * - O próprio nó mudou (dados diferentes)
 * - O estado de seleção desse nó específico mudou
 * 
 * Isso evita re-renderizações desnecessárias de nós não afetados,
 * mantendo a performance mesmo em árvores com milhares de nós.
 */
const areEqual = (prev: TreeNodeProps, next: TreeNodeProps) => {
  if (prev.node !== next.node) return false;
  const prevSelected = prev.selectedAsset?.id === prev.node.id;
  const nextSelected = next.selectedAsset?.id === next.node.id;
  return prevSelected === nextSelected;
};

export const TreeNodeView = memo(TreeNodeViewComponent, areEqual);
