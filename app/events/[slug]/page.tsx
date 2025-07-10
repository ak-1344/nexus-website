import { EventDetailPage } from "@/components/event-detail-page";

type EventPageProps = {
  // 👇 notice the Promise<>
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function EventPage({ params, searchParams }: EventPageProps) {
  console.log("EventPage params bfr:", params);
  const { slug } = await params;
  const query = await searchParams;
  const id = typeof query.id === "string" ? query.id : "";
  console.log("EventPage params:", slug, id);
  return <EventDetailPage eventId={id} eventSlug={slug} />;
}
