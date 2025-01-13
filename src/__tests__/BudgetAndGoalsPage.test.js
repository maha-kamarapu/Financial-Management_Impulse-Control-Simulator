import { render, screen, fireEvent } from "@testing-library/react";
import BudgetAndGoalsPage from "../pages/BudgetAndGoalsPage";

describe("Budget and Goals Page", () => {
  test("renders Budget and Goals Page correctly", () => {
    render(<BudgetAndGoalsPage />);

    expect(screen.getByText(/Budgets/i)).toBeInTheDocument();
    expect(screen.getByText(/Goals/i)).toBeInTheDocument();
  });

  test("adds a new budget", () => {
    render(<BudgetAndGoalsPage />);

    const input = screen.getByPlaceholderText("Enter budget name");
    const button = screen.getByText("Add Budget");

    fireEvent.change(input, { target: { value: "Groceries" } });
    fireEvent.click(button);

    expect(screen.getByText("Groceries")).toBeInTheDocument();
  });
});
