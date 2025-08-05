    import type { Location, Asset, TreeNode } from "../types";

export function buildTree(locations: Location[], assets: Asset[]): TreeNode[] {
  const locationMap = new Map<string, TreeNode>();
  const assetMap = new Map<string, TreeNode>();

  locations.forEach((loc) => {
    locationMap.set(loc.id, {
      id: loc.id,
      name: loc.name,
      type: "location",
      children: [],
    });
  });

  locations.forEach((loc) => {
    if (loc.parentId) {
      const parent = locationMap.get(loc.parentId);
      const current = locationMap.get(loc.id);
      if (parent && current) {
        parent.children.push(current);
      }
    }
  });

  assets.forEach((asset) => {
    const isComponent = !!asset.sensorType;

    const node: TreeNode = {
      id: asset.id,
      name: asset.name,
      type: isComponent ? "component" : "asset",
      sensorType: asset.sensorType,
      status: asset.status,
      children: [],
    };

    assetMap.set(asset.id, node);
  });

  assets.forEach((asset) => {
    const node = assetMap.get(asset.id);
    if (!node) return;

    if (asset.parentId) {
      const parent = assetMap.get(asset.parentId);
      if (parent) parent.children.push(node);
    } else if (asset.locationId) {
      const location = locationMap.get(asset.locationId);
      if (location) location.children.push(node);
    }
  });

  const root: TreeNode[] = [];

  locations.forEach((loc) => {
    if (!loc.parentId) {
      const node = locationMap.get(loc.id);
      if (node) root.push(node);
    }
  });

  assets.forEach((asset) => {
    if (!asset.parentId && !asset.locationId) {
      const node = assetMap.get(asset.id);
      if (node) root.push(node);
    }
  });

  return root;
}
