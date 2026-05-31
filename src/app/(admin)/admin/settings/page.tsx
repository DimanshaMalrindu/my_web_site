import { requireSession } from "@/lib/session";
import { getSettings } from "@/lib/content";
import { SettingsForm, PasswordForm } from "@/components/admin/settings-forms";

export default async function AdminSettingsPage() {
  await requireSession();
  const s = await getSettings();
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Site settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">SEO, contact recipient, analytics.</p>
      </div>
      <SettingsForm
        initial={{
          siteTitle: s.siteTitle,
          siteDescription: s.siteDescription,
          ogImageUrl: s.ogImageUrl ?? "",
          analyticsId: s.analyticsId ?? "",
          contactToEmail: s.contactToEmail ?? "",
        }}
      />

      <div>
        <h2 className="text-xl font-semibold">Account</h2>
        <p className="mt-1 text-sm text-muted-foreground">Change your admin password.</p>
      </div>
      <PasswordForm />
    </div>
  );
}
