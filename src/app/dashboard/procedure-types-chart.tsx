"use client";

export function ProcedureTypesChart() {
  // For a real implementation, you would use a charting library like Recharts or Chart.js
  // This is a simplified demonstration using just HTML/CSS

  const procedureData = [
    { type: "Cranial", count: 14, color: "bg-blue-500" },
    { type: "Spinal", count: 10, color: "bg-green-500" },
    { type: "Vascular", count: 5, color: "bg-red-500" },
    { type: "Functional", count: 4, color: "bg-purple-500" },
    { type: "Pediatric", count: 3, color: "bg-yellow-500" },
  ];

  const total = procedureData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="space-y-8 w-full">
        <div className="flex justify-center space-x-4">
          {procedureData.map((item) => (
            <div key={item.type} className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-xs">{item.type}</span>
            </div>
          ))}
        </div>

        <div className="relative w-64 h-64 mx-auto">
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full flex">
              {procedureData.map((item, index) => {
                // Calculate previous sections total percentage
                const previousPercentage = procedureData
                  .slice(0, index)
                  .reduce((sum, prev) => sum + (prev.count / total) * 100, 0);

                // Calculate this section's percentage
                const percentage = (item.count / total) * 100;

                return (
                  <div
                    key={item.type}
                    className={`h-full ${item.color}`}
                    style={{
                      width: `${percentage}%`,
                      transform: `rotate(${previousPercentage * 3.6}deg)`,
                      transformOrigin: "0% 50%"
                    }}
                  ></div>
                );
              })}
            </div>
          </div>

          <div className="absolute inset-8 rounded-full bg-background flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold">{total}</div>
              <div className="text-xs text-muted-foreground">Total Procedures</div>
            </div>
          </div>
        </div>

        <div className="space-y-2 max-w-md mx-auto w-full">
          {procedureData.map((item) => (
            <div key={item.type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span>{item.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.count}</span>
                <span className="text-muted-foreground text-sm">
                  {((item.count / total) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
