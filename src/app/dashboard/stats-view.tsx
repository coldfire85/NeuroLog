"use client";

export function StatsView() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-medium">Most Common Procedures</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Craniotomy</span>
            <span className="text-sm font-medium">12 procedures</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "33.3%" }}></div>
          </div>
        </div>

        <div className="space-y-2 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Laminectomy</span>
            <span className="text-sm font-medium">8 procedures</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: "22.2%" }}></div>
          </div>
        </div>

        <div className="space-y-2 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Aneurysm Clipping</span>
            <span className="text-sm font-medium">5 procedures</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full" style={{ width: "13.9%" }}></div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-sm font-medium mb-2">Hospital Distribution</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-3 border rounded-md">
            <div className="text-lg font-bold">15</div>
            <div className="text-xs text-center text-muted-foreground">Memorial Hospital</div>
          </div>
          <div className="flex flex-col items-center p-3 border rounded-md">
            <div className="text-lg font-bold">10</div>
            <div className="text-xs text-center text-muted-foreground">University Medical Center</div>
          </div>
          <div className="flex flex-col items-center p-3 border rounded-md">
            <div className="text-lg font-bold">7</div>
            <div className="text-xs text-center text-muted-foreground">Neuroscience Institute</div>
          </div>
          <div className="flex flex-col items-center p-3 border rounded-md">
            <div className="text-lg font-bold">4</div>
            <div className="text-xs text-center text-muted-foreground">Children's Medical Center</div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-sm font-medium mb-2">Surgeon Role Summary</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left pb-2 font-medium">Role</th>
              <th className="text-right pb-2 font-medium">Count</th>
              <th className="text-right pb-2 font-medium">Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Lead Surgeon</td>
              <td className="text-right py-2">24</td>
              <td className="text-right py-2">66.7%</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Assistant Surgeon</td>
              <td className="text-right py-2">9</td>
              <td className="text-right py-2">25.0%</td>
            </tr>
            <tr>
              <td className="py-2">Observer</td>
              <td className="text-right py-2">3</td>
              <td className="text-right py-2">8.3%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
