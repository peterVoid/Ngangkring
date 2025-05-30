import { FormAdminRequest } from "@/features/admin-request/components/FormAdminRequest";

export default function Page() {
  return (
    <div className="container my-6 flex h-[70vh] flex-col items-center justify-center gap-y-3">
      <h1 className="text-4xl font-bold uppercase">Request to be admin</h1>
      <FormAdminRequest />
    </div>
  );
}
