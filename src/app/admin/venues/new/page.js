import { VenueForm } from "@/components/admin/VenueForm";
import withAdminAuth from "@/components/auth/withAdminAuth";

function NewVenuePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Venue</h1>
      <VenueForm />
    </div>
  );
}

export default withAdminAuth(NewVenuePage);
