import type { TreeNode } from "../types";

type AssetDetailsProps = {
  selectedAsset: TreeNode | null;
};

export const AssetDetails = ({ selectedAsset }: AssetDetailsProps) => {
  const isEnergySensor = selectedAsset?.sensorType === "energy";
  const isCritical = selectedAsset?.status === "alert";
  const isDisabled = !selectedAsset || !selectedAsset.sensorType;

  const getEquipmentType = (node: TreeNode) => {
    if (node.type === "component") {
      if (node.name.toLowerCase().includes("motor")) {
        return "Motor Elétrico (Trifásico)";
      }
      if (node.name.toLowerCase().includes("fan")) {
        return "Ventilador Industrial";
      }
      if (node.name.toLowerCase().includes("conveyor")) {
        return "Sistema de Transporte";
      }
      return "Componente Industrial";
    }
    if (node.type === "asset") {
      return "Equipamento Industrial";
    }
    return "Localização";
  };

  const getResponsible = (node: TreeNode) => {
    if (node.type === "component") {
      if (node.name.toLowerCase().includes("motor")) {
        return "Elétrica";
      }
      if (node.name.toLowerCase().includes("fan")) {
        return "Mecânica";
      }
      return "Manutenção";
    }
    return "Operações";
  };

  /**
   * UTILITY: Gera IDs consistentes baseados no nome do ativo
   * 
   * Utiliza uma função hash simples para gerar IDs únicos e consistentes
   * para sensores e gateways, garantindo que o mesmo ativo sempre
   * tenha os mesmos IDs em diferentes sessões.
   */
  const getSensorId = (node: TreeNode) => {
    if (node.sensorType) {
      const hash = node.name.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      return `HIO${Math.abs(hash) % 9000 + 1000}`;
    }
    return "N/A";
  };

  const getGatewayId = (node: TreeNode) => {
    if (node.sensorType) {
      const hash = node.name.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      return `EUH${Math.abs(hash) % 9000 + 1000}`;
    }
    return "N/A";
  };

  const getResponsibleIcon = (node: TreeNode) => {
    if (node.name.toLowerCase().includes("motor")) {
      return "E";
    }
    if (node.name.toLowerCase().includes("fan")) {
      return "M";
    }
    return "O";
  };

  if (!selectedAsset) {
    return (
      <div className="right-panel">
        <div className="no-selection">
          <p>Selecione um ativo para ver os detalhes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="right-panel">
      <div className="asset-details">
        <div className="asset-header">
          <h1 className="asset-title">{selectedAsset.name}</h1>
          <div className={`status-indicator ${selectedAsset.status === "operating" ? "normal" : "critical"}`}></div>
        </div>
        
        {/* Status Badges */}
        <div className="status-badges">
          <div className={`status-badge ${isEnergySensor ? "active energy" : ""} ${isDisabled ? "disabled" : ""}`}>
            <span className="badge-icon">⚡</span>
            <span className="badge-label">Sensor de Energia</span>
          </div>
          <div className={`status-badge ${isCritical ? "active critical" : ""} ${isDisabled ? "disabled" : ""}`}>
            <span className="badge-icon">!</span>
            <span className="badge-label">Crítico</span>
          </div>
        </div>
        
        <div className="asset-image">
          <img src="/asset.png" alt="Asset" className="asset-photo" />
        </div>
        
        <div className="asset-info">
          <div className="info-section">
            <h3>Tipo de Equipamento</h3>
            <p>{getEquipmentType(selectedAsset)}</p>
          </div>
          
          <div className="info-section">
            <h3>Responsáveis</h3>
            <div className="responsible-item">
              <div className="responsible-icon">{getResponsibleIcon(selectedAsset)}</div>
              <span>{getResponsible(selectedAsset)}</span>
            </div>
          </div>
          
          <div className="info-section">
            <h3>Sensor</h3>
            <div className="sensor-item">
              <span className="sensor-icon">📡</span>
              <span>{getSensorId(selectedAsset)}</span>
            </div>
          </div>
          
          <div className="info-section">
            <h3>Receptor</h3>
            <div className="receiver-item">
              <span className="receiver-icon">📶</span>
              <span>{getGatewayId(selectedAsset)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 