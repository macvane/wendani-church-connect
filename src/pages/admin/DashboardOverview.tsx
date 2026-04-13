import React, { useEffect, useState, useRef } from 'react';
import {
  Heart,
  Droplets,
  Baby,
  UserPlus,
  HandHeart,
  MessageSquare,
  Calendar,
  TrendingUp,
  TrendingDown,
  Loader2,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  prayerAPI,
  baptismAPI,
  dedicationAPI,
  membershipAPI,
  benevolenceAPI,
  contactAPI,
  eventAPI,
} from '@/utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

/* ─────────────────────────────────────────────
   UTILITY HELPERS
───────────────────────────────────────────── */
const toArray = (res) => (Array.isArray(res) ? res : res?.results ?? []);

const getMonth = (dateStr) => new Date(dateStr).getMonth();

const subWeeks = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n * 7);
  return d;
};

const withinDays = (dateStr, days) =>
  new Date(dateStr) >= new Date(Date.now() - days * 86400000);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const WEEK_LABELS = Array.from({ length: 8 }, (_, i) => {
  const d = subWeeks(7 - i);
  return `${MONTHS[d.getMonth()]} W${Math.ceil(d.getDate() / 7)}`;
});

/* ─────────────────────────────────────────────
   STATUS NORMALISER
   Maps any casing / variant to: pending | approved | rejected | completed
───────────────────────────────────────────── */
const normaliseStatus = (s = '') => {
  const v = String(s).toLowerCase().trim();
  if (['pending', 'new', 'submitted', 'open'].includes(v)) return 'pending';
  if (['approved', 'accepted', 'active', 'completed', 'resolved', 'done', 'disbursed'].includes(v)) return 'approved';
  if (['rejected', 'declined', 'cancelled'].includes(v)) return 'rejected';
  return 'review';
};

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
const StatCard = ({ title, current, previous, icon: Icon, color, bg }) => {
  const delta = current - previous;
  const pct = previous > 0 ? Math.round((delta / previous) * 100) : 0;
  const up = delta >= 0;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-xl ${bg}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <span
          className={`flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
            up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
          }`}
        >
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(pct)}%
        </span>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-0.5">{current}</div>
      <div className="text-sm font-medium text-gray-600">{title}</div>
      <div className="text-xs text-gray-400 mt-1">
        {up ? '+' : ''}{delta} vs previous {30} days
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────── */
const statusStyles = {
  pending:  { bg: 'bg-amber-50',   text: 'text-amber-700',  icon: Clock,         label: 'Pending'   },
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2,  label: 'Resolved'  },
  rejected: { bg: 'bg-red-50',     text: 'text-red-600',    icon: AlertCircle,   label: 'Rejected'  },
  review:   { bg: 'bg-blue-50',    text: 'text-blue-700',   icon: RefreshCw,     label: 'In Review' },
};
const StatusBadge = ({ status }) => {
  const s = statusStyles[status] ?? statusStyles.review;
  const Ic = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>
      <Ic className="h-3 w-3" /> {s.label}
    </span>
  );
};

/* ─────────────────────────────────────────────
   CHART DEFAULTS
───────────────────────────────────────────── */
const chartFont = { family: 'inherit', size: 11 };
const gridColor = 'rgba(0,0,0,0.06)';
const tickColor = '#9ca3af';

const baseLineOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: tickColor, font: chartFont } },
    y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: tickColor, font: chartFont } },
  },
};

const baseBarOpts = {
  ...baseLineOpts,
  scales: {
    ...baseLineOpts.scales,
    x: { ...baseLineOpts.scales.x, ticks: { color: tickColor, font: { ...chartFont, size: 10 }, maxRotation: 0 } },
  },
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const DashboardOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [range, setRange] = useState(30);
  const [raw, setRaw] = useState(null);

  /* ── fetch ── */
  const fetchAll = async (silent = false) => {
    try {
      silent ? setRefreshing(true) : setLoading(true);
      const [prayers, baptisms, dedications, memberships, benevolence, contacts, events] =
        await Promise.all([
          prayerAPI.list(),
          baptismAPI.list(),
          dedicationAPI.list(),
          membershipAPI.list(),
          benevolenceAPI.list(),
          contactAPI.list(),
          eventAPI.list(),
        ]);
      setRaw({
        prayers: toArray(prayers),
        baptisms: toArray(baptisms),
        dedications: toArray(dedications),
        memberships: toArray(memberships),
        benevolence: toArray(benevolence),
        contacts: toArray(contacts),
        events: toArray(events),
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  /* ── derived analytics ── */
  const analytics = React.useMemo(() => {
    if (!raw) return null;

    const dateField = (item) =>
      item.created_at || item.date_submitted || item.submission_date || item.created || null;

    const inRange = (arr, days) =>
      arr.filter((i) => {
        const d = dateField(i);
        return d ? withinDays(d, days) : true;
      });

    const prevRange = (arr, days) =>
      arr.filter((i) => {
        const d = dateField(i);
        if (!d) return false;
        const t = new Date(d).getTime();
        const now = Date.now();
        return t >= now - days * 2 * 86400000 && t < now - days * 86400000;
      });

    const all = [
      ...raw.prayers, ...raw.baptisms, ...raw.dedications,
      ...raw.memberships, ...raw.benevolence, ...raw.contacts,
    ];

    // filter by selected range
    const curr = {
      prayers: inRange(raw.prayers, range),
      baptisms: inRange(raw.baptisms, range),
      dedications: inRange(raw.dedications, range),
      memberships: inRange(raw.memberships, range),
      benevolence: inRange(raw.benevolence, range),
      contacts: inRange(raw.contacts, range),
    };
    const prev = {
      prayers: prevRange(raw.prayers, range),
      baptisms: prevRange(raw.baptisms, range),
      dedications: prevRange(raw.dedications, range),
      memberships: prevRange(raw.memberships, range),
      benevolence: prevRange(raw.benevolence, range),
      contacts: prevRange(raw.contacts, range),
    };

    // weekly trend (last 8 weeks across all types)
    const weekBuckets = Array(8).fill(0);
    all.forEach((item) => {
      const d = dateField(item);
      if (!d) return;
      const weeksAgo = Math.floor((Date.now() - new Date(d).getTime()) / (7 * 86400000));
      if (weeksAgo >= 0 && weeksAgo < 8) weekBuckets[7 - weeksAgo]++;
    });

    // membership by month
    const memberByMonth = Array(12).fill(0);
    raw.memberships.forEach((m) => {
      const d = dateField(m);
      if (d) memberByMonth[getMonth(d)]++;
    });

    // status counts across all actionable forms
    const actionable = [
      ...raw.prayers, ...raw.baptisms, ...raw.dedications,
      ...raw.memberships, ...raw.benevolence,
    ];
    const statusCount = { pending: 0, approved: 0, review: 0, rejected: 0 };
    actionable.forEach((i) => {
      const s = normaliseStatus(i.status);
      statusCount[s]++;
    });

    // benevolence pipeline
    const benTotal = raw.benevolence.length;
    const benReview = raw.benevolence.filter((b) => ['review', 'pending'].includes(normaliseStatus(b.status))).length;
    const benApproved = raw.benevolence.filter((b) => normaliseStatus(b.status) === 'approved').length;

    // category totals
    const categories = [
      { label: 'Prayer',      count: curr.prayers.length,      total: raw.prayers.length,      color: '#ef4444', bg: 'bg-red-50' },
      { label: 'Contact',     count: curr.contacts.length,     total: raw.contacts.length,     color: '#f97316', bg: 'bg-orange-50' },
      { label: 'Benevolence', count: curr.benevolence.length,  total: raw.benevolence.length,  color: '#8b5cf6', bg: 'bg-purple-50' },
      { label: 'Baptism',     count: curr.baptisms.length,     total: raw.baptisms.length,     color: '#3b82f6', bg: 'bg-blue-50' },
      { label: 'Membership',  count: curr.memberships.length,  total: raw.memberships.length,  color: '#10b981', bg: 'bg-emerald-50' },
      { label: 'Dedication',  count: curr.dedications.length,  total: raw.dedications.length,  color: '#ec4899', bg: 'bg-pink-50' },
    ];
    const maxCat = Math.max(...categories.map((c) => c.count), 1);

    return { curr, prev, weekBuckets, memberByMonth, statusCount, benTotal, benReview, benApproved, categories, maxCat, actionable };
  }, [raw, range]);

  /* ── loading ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analytics) return null;

  const {
    curr, prev, weekBuckets, memberByMonth,
    statusCount, benTotal, benReview, benApproved,
    categories, maxCat, actionable,
  } = analytics;

  const totalStatusCount = Object.values(statusCount).reduce((a, b) => a + b, 0) || 1;
  const resolvedPct = Math.round((statusCount.approved / totalStatusCount) * 100);

  /* ── chart data ── */
  const trendData = {
    labels: WEEK_LABELS,
    datasets: [{
      label: 'Requests',
      data: weekBuckets,
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.08)',
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: '#6366f1',
      fill: true,
      tension: 0.4,
    }],
  };

  const memberData = {
    labels: MONTHS,
    datasets: [{
      label: 'Transfers',
      data: memberByMonth,
      backgroundColor: '#10b981',
      borderRadius: 4,
      borderSkipped: false,
    }],
  };

  const donutData = {
    labels: ['Resolved', 'Pending', 'In Review', 'Rejected'],
    datasets: [{
      data: [statusCount.approved, statusCount.pending, statusCount.review, statusCount.rejected],
      backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };

  const donutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed} (${Math.round(ctx.parsed / totalStatusCount * 100)}%)` } },
    },
  };

  /* ── render ── */
  return (
    <div className="space-y-8 pb-10">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-gray-900">
            Ministry Analytics
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Real-time overview of church activity and requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Range selector */}
          <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm">
            {[30, 90, 180].map((d) => (
              <button
                key={d}
                onClick={() => setRange(d)}
                className={`px-3 py-1.5 transition-all ${
                  range === d
                    ? 'bg-gray-900 text-white font-medium'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
          <button
            onClick={() => fetchAll(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { title: 'Prayer Requests', icon: Heart,         color: 'text-red-500',    bg: 'bg-red-50',     key: 'prayers'     },
          { title: 'Baptism Inquiries', icon: Droplets,    color: 'text-blue-500',   bg: 'bg-blue-50',    key: 'baptisms'    },
          { title: 'Dedications',     icon: Baby,          color: 'text-pink-500',   bg: 'bg-pink-50',    key: 'dedications' },
          { title: 'Memberships',     icon: UserPlus,      color: 'text-emerald-600',bg: 'bg-emerald-50', key: 'memberships' },
          { title: 'Benevolence',     icon: HandHeart,     color: 'text-purple-600', bg: 'bg-purple-50',  key: 'benevolence' },
          { title: 'Contact Messages',icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-50',  key: 'contacts'    },
        ].map((card) => (
          <StatCard
            key={card.key}
            title={card.title}
            icon={card.icon}
            color={card.color}
            bg={card.bg}
            current={curr[card.key].length}
            previous={prev[card.key].length}
          />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Trend line */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-gray-800">Weekly Request Volume</div>
              <div className="text-xs text-gray-400 mt-0.5">All request types · last 8 weeks</div>
            </div>
            <div className="text-2xl font-bold text-indigo-600">
              {weekBuckets.reduce((a, b) => a + b, 0)}
            </div>
          </div>
          <div style={{ position: 'relative', height: 180 }}>
            <Line data={trendData} options={baseLineOpts} />
          </div>
        </div>

        {/* Donut */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="text-sm font-semibold text-gray-800 mb-1">Status Overview</div>
          <div className="text-xs text-gray-400 mb-4">All actionable requests</div>
          <div className="relative" style={{ position: 'relative', height: 160 }}>
            <Doughnut data={donutData} options={donutOpts} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-900">{resolvedPct}%</span>
              <span className="text-xs text-gray-400">resolved</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {[
              { label: 'Resolved',  count: statusCount.approved, color: 'bg-emerald-500' },
              { label: 'Pending',   count: statusCount.pending,  color: 'bg-amber-400'   },
              { label: 'In Review', count: statusCount.review,   color: 'bg-blue-500'    },
              { label: 'Rejected',  count: statusCount.rejected, color: 'bg-red-400'     },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-sm ${s.color}`} />
                  <span className="text-gray-600">{s.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.color}`}
                      style={{ width: `${Math.round((s.count / totalStatusCount) * 100)}%` }}
                    />
                  </div>
                  <span className="font-medium text-gray-700 w-6 text-right">{s.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="text-sm font-semibold text-gray-800 mb-1">Requests by Category</div>
          <div className="text-xs text-gray-400 mb-4">Last {range} days</div>
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">{cat.label}</span>
                  <span className="text-gray-900 font-semibold">{cat.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${maxCat > 0 ? Math.round((cat.count / maxCat) * 100) : 0}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Membership by month */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="text-sm font-semibold text-gray-800 mb-1">Membership Transfers</div>
          <div className="text-xs text-gray-400 mb-4">By month · full year</div>
          <div style={{ position: 'relative', height: 180 }}>
            <Bar data={memberData} options={baseBarOpts} />
          </div>
        </div>

        {/* Benevolence pipeline */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="text-sm font-semibold text-gray-800 mb-1">Benevolence Pipeline</div>
          <div className="text-xs text-gray-400 mb-5">Submitted → disbursed funnel</div>
          <div className="space-y-4">
            {[
              { label: 'Submitted',   val: benTotal,    color: 'bg-purple-500', pct: 100              },
              { label: 'Under Review',val: benReview,   color: 'bg-blue-500',   pct: benTotal > 0 ? Math.round(benReview / benTotal * 100) : 0 },
              { label: 'Approved',    val: benApproved, color: 'bg-emerald-500',pct: benTotal > 0 ? Math.round(benApproved / benTotal * 100) : 0 },
            ].map((stage) => (
              <div key={stage.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-600">{stage.label}</span>
                  <span className="font-semibold text-gray-900">{stage.val} <span className="font-normal text-gray-400">({stage.pct}%)</span></span>
                </div>
                <div className="h-5 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className={`h-full rounded-lg flex items-center pl-2 text-white text-xs font-medium transition-all duration-500 ${stage.color}`}
                    style={{ width: `${Math.max(stage.pct, stage.val > 0 ? 8 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-400 mb-2">Conversion rate</div>
            <div className="text-2xl font-bold text-gray-900">
              {benTotal > 0 ? Math.round((benApproved / benTotal) * 100) : 0}%
              <span className="text-sm font-normal text-gray-400 ml-1">approval</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent requests table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold text-gray-800">Recent Requests</div>
            <div className="text-xs text-gray-400 mt-0.5">Latest submissions across all categories</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Name', 'Type', 'Date', 'Status'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-400 pb-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                const tagged = [
                  ...raw.prayers.map((i) => ({ ...i, _type: 'Prayer' })),
                  ...raw.baptisms.map((i) => ({ ...i, _type: 'Baptism' })),
                  ...raw.dedications.map((i) => ({ ...i, _type: 'Dedication' })),
                  ...raw.memberships.map((i) => ({ ...i, _type: 'Membership' })),
                  ...raw.benevolence.map((i) => ({ ...i, _type: 'Benevolence' })),
                  ...raw.contacts.map((i) => ({ ...i, _type: 'Contact' })),
                ];
                const dateField = (i) => i.created_at || i.date_submitted || i.submission_date || i.created || '';
                const sorted = tagged.sort((a, b) => new Date(dateField(b)) - new Date(dateField(a))).slice(0, 8);

                if (sorted.length === 0) {
                  return (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">
                        No recent submissions found
                      </td>
                    </tr>
                  );
                }

                const typeColors = {
                  Prayer:     'bg-red-50 text-red-600',
                  Baptism:    'bg-blue-50 text-blue-600',
                  Dedication: 'bg-pink-50 text-pink-600',
                  Membership: 'bg-emerald-50 text-emerald-600',
                  Benevolence:'bg-purple-50 text-purple-600',
                  Contact:    'bg-orange-50 text-orange-600',
                };

                return sorted.map((item, idx) => {
                  const name =
                    item.full_name || item.child_full_name ||
                    item.contributorName || item.name || '—';
                  const date = dateField(item);
                  const status = normaliseStatus(item.status);
                  return (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 pr-4 font-medium text-gray-800">{name}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[item._type]}`}>
                          {item._type}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-400 text-xs">
                        {date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={status} />
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            title: 'Create Announcement',
            desc: 'Publish a new church announcement',
            action: () => navigate('/admin/dashboard/announcements'),
            color: 'from-indigo-50 to-blue-50',
            border: 'border-indigo-100',
          },
          {
            title: 'Add New Event',
            desc: 'Schedule an upcoming church event',
            action: () => navigate('/admin/dashboard/events'),
            color: 'from-emerald-50 to-teal-50',
            border: 'border-emerald-100',
          },
        ].map((qa) => (
          <button
            key={qa.title}
            onClick={qa.action}
            className={`group flex items-center justify-between p-4 text-left rounded-2xl border bg-gradient-to-br ${qa.color} ${qa.border} hover:shadow-md transition-all`}
          >
            <div>
              <div className="font-semibold text-gray-900">{qa.title}</div>
              <div className="text-sm text-gray-500 mt-0.5">{qa.desc}</div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;