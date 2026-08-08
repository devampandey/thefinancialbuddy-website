import EmiCalculator from "@/components/EmiCalculator";

export const metadata = {
  title: "EMI Calculator",
  description:
    "Calculate your monthly loan EMI (Equated Monthly Installment), total payment, and total interest — free and instant.",
};

export default function EmiCalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-black dark:text-white">EMI Calculator</h1>
      <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
        Enter your loan amount, interest rate, and tenure to see your fixed
        monthly payment (EMI), total amount paid, and total interest over the
        life of the loan.
      </p>

      <div className="mt-10">
        <EmiCalculator />
      </div>

      <div className="prose-financial mt-12 max-w-2xl text-gray-700 dark:text-gray-300">
        <h2>How EMI is calculated</h2>
        <p>
          EMI stands for Equated Monthly Installment — a fixed payment made
          each month that covers both principal and interest, structured so
          the loan is fully paid off by the end of the tenure. Early payments
          are weighted more toward interest; later payments are weighted more
          toward principal, even though the total payment stays the same each
          month.
        </p>
        <h2>What changes your EMI the most</h2>
        <p>
          Interest rate and tenure both matter, but tenure has an outsized
          effect on total interest paid — stretching a loan from 15 to 30
          years lowers the monthly payment but can roughly double total
          interest paid over the life of the loan.
        </p>
      </div>
    </div>
  );
}
