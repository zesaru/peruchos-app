import { formatJPY } from "./currency";

describe("formatJPY", () => {
  it("formats whole yen amounts without decimal places", () => {
    expect(formatJPY(1600)).toBe("￥1,600");
  });

  it("rounds fractional values using JPY formatting rules", () => {
    expect(formatJPY(1600.49)).toBe("￥1,600");
    expect(formatJPY(1600.5)).toBe("￥1,601");
  });
});
