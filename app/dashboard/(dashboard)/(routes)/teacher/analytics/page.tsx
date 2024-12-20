import { getAnalytics } from "@/actions/getAnalytics";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DataCard from "./_components/DataCard";
import Chart from "./_components/Chart";

const AnalyticsPage = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard label="عدد مرات البيع" value={totalSales} />
        <DataCard
          label="اجمالي الدخل"
          value={totalRevenue}
          shouldFormat={true}
        />
      </div>
      <Chart data={data} />
    </div>
  );
};

export default AnalyticsPage;
