import "./App.css";
import { useEffect } from "react";
import { Header } from "./components/Header";
import { AssetTree } from "./components/AssetTree";
import { AssetDetails } from "./components/AssetDetails";
import { useAssetData } from "./hooks/useAssetData";
import { fetchAllCompanies } from "./services/api";

function App() {
  const {
    tree,
    loading,
    error,
    selectedAsset,
    selectedCompany,
    handleCompanyChange,
    handleAssetSelect,
    loadCompanyData,
  } = useAssetData();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const companies = await fetchAllCompanies();
        if (companies.length > 0) {
          await loadCompanyData(companies[0].id);
        }
      } catch (err: any) {
        console.error("Erro ao inicializar aplicação:", err);
      }
    };

    initializeApp();
  }, []);

  if (error) return <p>Erro: {error}</p>;

  return (
    <div className="app">
      <Header 
        selectedCompany={selectedCompany}
        onCompanyChange={handleCompanyChange}
      />
      
      <div className="main-content">
        <AssetTree 
          tree={tree}
          selectedAsset={selectedAsset}
          onAssetSelect={handleAssetSelect}
          selectedCompanyName={selectedCompany?.name || ""}
          loading={loading}
        />
        
        <AssetDetails selectedAsset={selectedAsset} />
      </div>
    </div>
  );
}

export default App;
