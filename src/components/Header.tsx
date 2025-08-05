import { useState, useEffect } from "react";
import { fetchAllCompanies } from "../services/api";
import type { Company } from "../types";

type HeaderProps = {
  selectedCompany: Company | null;
  onCompanyChange: (companyId: string) => void;
};

export const Header = ({ selectedCompany, onCompanyChange }: HeaderProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * PERFORMANCE: Carregamento assíncrono das empresas
     * 
     * Busca as empresas da API fake de forma assíncrona,
     * com fallback para dados locais em caso de erro.
     */
    const loadCompanies = async () => {
      try {
        setLoading(true);
        const allCompanies = await fetchAllCompanies();
        setCompanies(allCompanies);
      } catch (error) {
        console.error("Erro ao carregar empresas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">TRACTIAN</h1>
      </div>
      <div className="header-right">
        <div className="unit-selector">
          {loading ? (
            <div className="loading-companies">Carregando...</div>
          ) : (
            companies.map((company) => (
              <button 
                key={company.id}
                className={`unit-btn ${selectedCompany?.id === company.id ? "active" : ""}`}
                onClick={() => onCompanyChange(company.id)}
              >
                {company.name} Unit
              </button>
            ))
          )}
        </div>
      </div>
    </header>
  );
}; 