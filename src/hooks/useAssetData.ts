import { useState, useCallback } from "react";
import { buildTree } from "../utils/buildTree";
import type { TreeNode, Company } from "../types";
import { fetchCompanyDataLocal } from "../services/api";

/**
 * PERFORMANCE: Hook customizado para gerenciamento de dados de ativos
 * 
 * Este hook centraliza toda a lógica de estado dos ativos e utiliza
 * useCallback para memoizar funções que são passadas como props,
 * evitando re-renderizações desnecessárias dos components filhos.
 */
export const useAssetData = () => {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<TreeNode | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  /**
   * PERFORMANCE: Função memoizada para carregamento de dados
   * 
   * Utiliza useCallback para evitar recriação da função a cada render,
   * garantindo que components filhos que dependem desta função
   * não sejam re-renderizados desnecessariamente.
   */
  const loadCompanyData = useCallback(async (companyId: string) => {
    try {
      setLoading(true);
      setError(null);
      setTree([]);
      setSelectedAsset(null);
      
      const { locations, assets, companyName } = await fetchCompanyDataLocal(companyId);
      const treeBuilt = buildTree(locations, assets);
      
      setTree(treeBuilt);
      setSelectedCompany({ id: companyId, name: companyName });
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados da empresa.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * PERFORMANCE: Handlers memoizados para eventos de UI
   * 
   * Estas funções são memoizadas para evitar re-renderizações
   * desnecessárias dos components que as recebem como props.
   */
  const handleCompanyChange = useCallback((companyId: string) => {
    if (selectedCompany?.id === companyId) {
      return;
    }
    loadCompanyData(companyId);
  }, [loadCompanyData, selectedCompany?.id]);

  const handleAssetSelect = useCallback((asset: TreeNode) => {
    setSelectedAsset(asset);
  }, []);

  return {
    tree,
    loading,
    error,
    selectedAsset,
    selectedCompany,
    handleCompanyChange,
    handleAssetSelect,
    loadCompanyData,
  };
}; 