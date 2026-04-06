import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,
  ClipboardList,
  AlertCircle,
  Bookmark,
  ArrowPath,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { useToast } from "../../components/ui/Toast";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNotices: 0,
    urgentNotices: 0,
    importantNotices: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(
    async (showNotification = false) => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL?.replace(/\/$/, "")}/api/auth/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setStats(res.data);
        if (showNotification) {
          addToast("Dashboard updated successfully.", "success");
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        if (showNotification) {
          addToast("Unable to refresh dashboard. Please try again.", "error");
        }
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const StatCard = ({ title, value, icon: Icon, variant }) => {
    const variants = {
      primary: "bg-primary/10 text-primary",
      success: "bg-success/10 text-success",
      error: "bg-error/10 text-error",
      warning: "bg-warning/10 text-warning",
    };

    return (
      <Card className="flex items-center gap-4 p-6 hover:shadow-md transition-shadow">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${variants[variant]}`}
        >
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-text-secondary">
            {title}
          </p>
          <p className="mt-3 text-3xl font-semibold text-text-primary">
            {value}
          </p>
        </div>
      </Card>
    );
  };

  const StatSkeleton = () => (
    <Card className="h-[136px] border-border/70 shadow-none animate-pulse" />
  );

  return (
    <div className="space-y-8 p-6">
      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-text-secondary">
              Admin Dashboard
            </p>
            <h1 className="text-3xl font-semibold text-text-primary">
              Operations overview
            </h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => fetchStats(true)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ArrowPath size={16} />
              {loading ? "Refreshing..." : "Refresh metrics"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/manage")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-3 text-sm font-semibold text-text-primary transition hover:bg-surface"
            >
              <ArrowUpRight size={16} />
              Manage notices
            </button>
          </div>
        </div>
        <p className="max-w-2xl text-sm text-gray-500">
          Review the latest system KPIs and take quick actions to keep your
          notice board up to date.
        </p>
      </section>

      <section>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total users"
            value={stats.totalUsers}
            icon={Users}
            variant="primary"
          />
          <StatCard
            title="Total notices"
            value={stats.totalNotices}
            icon={ClipboardList}
            variant="success"
          />
          <StatCard
            title="Urgent alerts"
            value={stats.urgentNotices}
            icon={AlertCircle}
            variant="error"
          />
          <StatCard
            title="Important"
            value={stats.importantNotices}
            icon={Bookmark}
            variant="warning"
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card className="space-y-6 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-text-secondary">
                Insights
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-text-primary">
                Operations snapshot
              </h2>
              <p className="mt-3 max-w-xl text-sm text-gray-500">
                The dashboard keeps you informed with the latest counts and a
                clean action panel. Use this view to monitor alerts and stay
                ahead of urgent user activity.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles size={22} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border p-4">
              <p className="text-sm font-medium text-text-secondary">
                Latest status
              </p>
              <p className="mt-2 text-lg font-semibold text-text-primary">
                Stable
              </p>
              <p className="mt-2 text-sm text-gray-500">
                No critical issues detected in the most recent scan.
              </p>
            </div>
            <div className="rounded-3xl border border-border p-4">
              <p className="text-sm font-medium text-text-secondary">
                Response time
              </p>
              <p className="mt-2 text-lg font-semibold text-text-primary">
                1.2s
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Current metrics are within expected performance range.
              </p>
            </div>
          </div>
        </Card>

        <Card className="space-y-6 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-text-secondary">
                Quick actions
              </p>
              <h2 className="mt-2 text-xl font-semibold text-text-primary">
                Take action
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => navigate("/admin/create")}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              Create notice
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm font-semibold text-text-primary transition hover:bg-surface"
            >
              Manage users
            </button>
          </div>
        </Card>
      </section>
    </div>
  );
}
