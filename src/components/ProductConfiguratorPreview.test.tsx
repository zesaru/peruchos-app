import { Text } from "react-native";
import renderer, { act, type ReactTestInstance } from "react-test-renderer";

import type { FoodItem } from "../types";
import { ProductConfiguratorPreview } from "./ProductConfiguratorPreview";

const mockAddConfiguredItem = jest.fn(() => Promise.resolve());

jest.mock("../store/useAppSettingsStore", () => ({
  useAppSettingsStore: (selector: (state: { language: "es" }) => unknown) =>
    selector({ language: "es" }),
}));

jest.mock("../store/useCartStore", () => ({
  useCartStore: (selector: (state: { addConfiguredItem: typeof mockAddConfiguredItem }) => unknown) =>
    selector({ addConfiguredItem: mockAddConfiguredItem }),
}));

jest.mock("./RemoteImageCard", () => ({
  RemoteImageCard: () => null,
}));

const item: FoodItem = {
  id: "drink-1",
  title: "Inca Kola",
  description: "Gaseosa peruana",
  macroCategory: "drinks",
  category: "Bebidas",
  price: 1600,
  prepTime: "1 min",
};

describe("ProductConfiguratorPreview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("adds the configured item with quantity and selected options", async () => {
    const onAdded = jest.fn();
    const onClose = jest.fn();
    let testRenderer!: renderer.ReactTestRenderer;

    await act(async () => {
      testRenderer = renderer.create(
        <ProductConfiguratorPreview item={item} onAdded={onAdded} onClose={onClose} visible />
      );
    });

    const root = testRenderer.root;
    const plusText = root.findAllByType(Text).find((node: ReactTestInstance) => node.props.children === "+");
    const largeOptionText = root
      .findAllByType(Text)
      .find((node: ReactTestInstance) => node.props.children === "Grande");
    const noIceOptionText = root
      .findAllByType(Text)
      .find((node: ReactTestInstance) => node.props.children === "Sin hielo");
    const addButtonText = root
      .findAllByType(Text)
      .find((node: ReactTestInstance) => node.props.children === "Agregar al pedido");

    function findPressTarget(node: ReactTestInstance | undefined | null): ReactTestInstance {
      let current = node?.parent;
      while (current && typeof current.props.onPress !== "function") {
        current = current.parent;
      }

      if (!current) {
        throw new Error("Press target not found");
      }

      return current;
    }

    await act(async () => {
      findPressTarget(plusText).props.onPress();
    });

    await act(async () => {
      findPressTarget(largeOptionText).props.onPress();
    });

    await act(async () => {
      findPressTarget(noIceOptionText).props.onPress();
    });

    await act(async () => {
      await findPressTarget(addButtonText).props.onPress();
    });

    expect(mockAddConfiguredItem).toHaveBeenCalledWith({
      note: "",
      product: item,
      quantity: 2,
      selectedOptions: ["Tamaño: Grande", "Hielo: Sin hielo"],
    });
    expect(onAdded).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
