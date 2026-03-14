import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Footer from "@/components/layout/Footer";
import PublicNav from "@/components/layout/PublicNav";

export default async function PrivacyPage() {
  const t = await getTranslations("Privacy");

  const sections = t.raw("sections") as {
    title: string;
    intro?: string;
    body?: string;
    items?: string[];
    note?: string;
  }[];

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Content */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-xs text-gray-400 mb-2">{t("lastUpdated")}</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-10">{t("title")}</h1>

          <div className="space-y-10 text-gray-600 leading-relaxed">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h2>
                {section.intro && <p>{section.intro}</p>}
                {section.body && <p>{section.body}</p>}
                {section.items && (
                  <ul className="mt-3 ml-4 space-y-1.5 list-disc">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.note && <p className="mt-3">{section.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
