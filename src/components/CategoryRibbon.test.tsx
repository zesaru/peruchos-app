import { Text } from "react-native";
import renderer, { act, type ReactTestInstance } from "react-test-renderer";

import { CategoryRibbon } from "./CategoryRibbon";

jest.mock("../store/useAppSettingsStore", () => ({
  useAppSettingsStore: (selector: (state: { language: "es" }) => unknown) =>
    selector({ language: "es" }),
}));

describe("CategoryRibbon", () => {
  it("deduplicates categories, translates All and notifies selection", async () => {
    const onSelect = jest.fn();
    let testRenderer!: renderer.ReactTestRenderer;

    await act(async () => {
      testRenderer = renderer.create(
        <CategoryRibbon
          categories={["All", "Ceviches", "All", "Bebidas"]}
          onSelect={onSelect}
          selectedCategory="All"
        />
      );
    });

    const root = testRenderer.root;
    const texts = root.findAllByType(Text).map((node: ReactTestInstance) => node.props.children);

    expect(texts.filter((value) => value === "Todo")).toHaveLength(1);
    expect(texts).toContain("Ceviches");
    expect(texts).toContain("Bebidas");

    const cevichesText = root
      .findAllByType(Text)
      .find((node: ReactTestInstance) => node.props.children === "Ceviches");

    function findPressTarget(node: ReactTestInstance | undefined): ReactTestInstance {
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
      findPressTarget(cevichesText).props.onPress();
    });

    expect(onSelect).toHaveBeenCalledWith("Ceviches");
  });
});
