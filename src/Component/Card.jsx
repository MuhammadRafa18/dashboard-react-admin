const color = {
  green: "text-green-400",
  red: "text-red-400",
};
export const Card = ({ title, value, view, icon, persentase, colour }) => {
  const badgeStyles = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    neutral: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <div className="w-full sm:w-64 p-5 rounded-xl bg-bg-surface border border-border-light shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer">

      {/* Top Header: Title & Icon */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {title}
        </span>
        <div className="p-2.5 rounded-lg bg-gray-50 text-text-heading group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          {icon}
        </div>
      </div>

      {/* Bottom Content: Big Value & Trend Indicator */}
      <div className="flex items-baseline justify-between gap-2 mt-auto">
        <p className="text-2xl lg:text-3xl font-bold text-text-heading tracking-tight">
          {value}
        </p>

        {/* Trend Pill / Badge */}
        <div className="flex flex-col items-end">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${badgeStyles[colour] || badgeStyles.green}`}>
            {persentase}
          </span>
          {view && (
            <span className="text-[11px] text-text-muted mt-1 font-normal">
              {view}
            </span>
          )}
        </div>
      </div>

    </div>
  );
};
