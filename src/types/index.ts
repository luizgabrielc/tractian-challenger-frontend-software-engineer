export type Company = {
  id: string;
  name: string;
};

export type TreeNode = {
  id: string;
  name: string;
  type: "location" | "asset" | "component";
  sensorType?: string;
  status?: string;
  children: TreeNode[];
};

export type Location = {
  id: string;
  name: string;
  parentId: string | null;
};

export type Asset = {
  id: string;
  name: string;
  parentId?: string | null;
  locationId?: string | null;
  sensorType?: "vibration" | "energy";
  status?: "operating" | "alert";
  sensorId?: string;
  gatewayId?: string;
};
