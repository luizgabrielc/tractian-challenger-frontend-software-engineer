import type { Location, Asset } from "../types";
import apiData from "../data/api-data.json";

const BASE_URL = "https://fake-api.tractian.com";

export async function fetchCompanyData() {
  const companies = await fetch(`${BASE_URL}/companies`).then((res) => res.json());

  if (!companies || !companies.length) throw new Error("Nenhuma empresa encontrada.");

  const companyId = companies[0].id;

  const [locations, assets] = await Promise.all([
    fetch(`${BASE_URL}/companies/${companyId}/locations`).then((res) => res.json()),
    fetch(`${BASE_URL}/companies/${companyId}/assets`).then((res) => res.json()),
  ]);

  return {
    companyId,
    locations: locations as Location[],
    assets: assets as Asset[],
  };
}

export async function fetchCompanyDataLocal(companyId?: string) {
  try {
    // Busca todas as empresas primeiro para obter o ID correto
    const companies = await fetch(`${BASE_URL}/companies`).then((res) => res.json());
    
    if (!companies || !companies.length) {
      throw new Error("Nenhuma empresa encontrada.");
    }

    // Se não especificar companyId, usa a primeira empresa
    const targetCompanyId = companyId || companies[0].id;
    const company = companies.find((c: any) => c.id === targetCompanyId);
    
    if (!company) {
      throw new Error("Empresa não encontrada.");
    }

    // Busca locations e assets da empresa específica
    const [locations, assets] = await Promise.all([
      fetch(`${BASE_URL}/companies/${targetCompanyId}/locations`).then((res) => res.json()),
      fetch(`${BASE_URL}/companies/${targetCompanyId}/assets`).then((res) => res.json()),
    ]);

    return {
      companyId: targetCompanyId,
      companyName: company.name,
      locations: locations || [],
      assets: assets || [],
    };
  } catch (error) {
    console.error('Erro ao buscar dados da empresa:', error);
    
    // Fallback para dados locais em caso de erro
    const companies = apiData.companies as Array<{ id: string; name: string }>;
    
    if (!companies || !companies.length) {
      throw new Error("Nenhuma empresa encontrada.");
    }

    const targetCompanyId = companyId || companies[0].id;
    const company = companies.find(c => c.id === targetCompanyId);
    
    if (!company) {
      throw new Error("Empresa não encontrada.");
    }

    const companyData = apiData[targetCompanyId as keyof typeof apiData] as {
      locations: Location[];
      assets: Asset[];
    };

    if (!companyData) {
      throw new Error("Dados da empresa não encontrados.");
    }

    return {
      companyId: targetCompanyId,
      companyName: company.name,
      locations: companyData.locations || [],
      assets: companyData.assets || [],
    };
  }
}

export async function fetchAllCompanies() {
  try {
    const response = await fetch(`${BASE_URL}/companies`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const companies = await response.json();
    return companies as Array<{ id: string; name: string }>;
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    // Fallback para dados locais em caso de erro
    return apiData.companies as Array<{ id: string; name: string }>;
  }
}
