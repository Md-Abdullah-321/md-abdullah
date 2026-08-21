import { ServiceForm } from "../service-form";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New Service</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Create a new service offering.
      </p>
      <div className="mt-8">
        <ServiceForm />
      </div>
    </div>
  );
}
